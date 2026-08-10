"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import PasswordInput from "@/components/PasswordInput";

type Status = "checking" | "ready" | "invalid";

export default function ReinitialiserMotDePasse() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setStatus("ready");
      }
    });

    async function init() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errorDescription = url.searchParams.get("error_description");

      if (errorDescription) {
        if (!cancelled) {
          setStatus("invalid");
          setError(errorDescription);
        }
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setStatus("invalid");
          setError(error.message);
          return;
        }
        setStatus("ready");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setStatus("ready");
      } else {
        setTimeout(async () => {
          if (cancelled) return;
          const { data: retry } = await supabase.auth.getSession();
          if (cancelled) return;
          setStatus(retry.session ? "ready" : "invalid");
        }, 1500);
      }
    }

    init();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne corre
