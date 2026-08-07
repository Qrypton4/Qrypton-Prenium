//+------------------------------------------------------------------+
//| OPR_Heartbeat.mqh                                                  |
//| Envoie un instantané balance/équité toutes les HeartbeatMinutes    |
//| minutes, pour que /challenge-prop-firm affiche des chiffres        |
//| réellement en temps réel (pas seulement à la clôture d'un trade). |
//+------------------------------------------------------------------+
#property strict

input int HeartbeatMinutes = 5; // Fréquence d'envoi du heartbeat

string HeartbeatUrl = "https://qryptonedge.com/api/v1/account/heartbeat";

//+------------------------------------------------------------------+
//| À appeler dans OnInit() de l'EA :  EventSetTimer(HeartbeatMinutes*60); |
//| Et dans OnDeinit() :               EventKillTimer();                |
//| Puis, dans OnTimer() de l'EA, appeler SendHeartbeat();              |
//+------------------------------------------------------------------+
void SendHeartbeat()
  {
   double balance  = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity   = AccountInfoDouble(ACCOUNT_EQUITY);
   double floatingPL = equity - balance;
   int    openCount  = PositionsTotal();

   string json = StringFormat(
      "{\"license_key\":\"%s\",\"account_login\":\"%d\",\"balance\":%.2f,"
      "\"equity\":%.2f,\"floating_pl\":%.2f,\"open_positions_count\":%d}",
      LicenseKey, AccountInfoInteger(ACCOUNT_LOGIN), balance, equity, floatingPL, openCount);

   char post[]; char result[]; string headers = "Content-Type: application/json\r\n"; string resultHeaders;
   StringToCharArray(json, post, 0, StringLen(json));

   int res = WebRequest("POST", HeartbeatUrl, headers, 5000, post, result, resultHeaders);

   if(res == -1)
      PrintFormat("Qrypton: échec du heartbeat (code %d). Retenté au prochain cycle.", GetLastError());
  }
