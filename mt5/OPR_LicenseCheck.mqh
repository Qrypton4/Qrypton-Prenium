//+------------------------------------------------------------------+
//| OPR_LicenseCheck.mqh                                             |
//| Vérification de licence Qrypton — à inclure dans OPR_Edge.mq5   |
//+------------------------------------------------------------------+
#property strict

input string LicenseKey = "";              // Clé fournie dans l'espace client
string       ApiUrl     = "https://qryptonedge.com/api/v1/license/verify";

datetime g_lastCheckOK   = 0;
bool     g_licenseValid  = false;
int      g_graceHours    = 48;             // tolérance en cas de coupure réseau

//+------------------------------------------------------------------+
//| Appelée au OnInit() et une fois par jour depuis OnTick()         |
//+------------------------------------------------------------------+
bool CheckLicense()
  {
   string headers = "Content-Type: application/json\r\n";
   string body = StringFormat(
      "{\"license_key\":\"%s\",\"account_login\":\"%d\",\"account_broker\":\"%s\",\"ea_version\":\"1.80\"}",
      LicenseKey, AccountInfoInteger(ACCOUNT_LOGIN), AccountInfoString(ACCOUNT_COMPANY));

   char   post[]; char result[]; string resultHeaders;
   StringToCharArray(body, post, 0, StringLen(body));

   int res = WebRequest("POST", ApiUrl, headers, 5000, post, result, resultHeaders);

   if(res == -1)
     {
      // Pas de connexion — on utilise le cache si encore dans la période de grâce
      PrintFormat("Qrypton: vérification licence impossible (réseau). Code erreur: %d", GetLastError());
      Print("→ Vérifiez que ", ApiUrl, " est ajouté dans Outils > Options > Expert Advisors > URL autorisées.");
      return UseGraceCache();
     }

   string response = CharArrayToString(result);

   if(StringFind(response, "\"valid\":true") >= 0)
     {
      g_licenseValid = true;
      g_lastCheckOK  = TimeCurrent();
      return true;
     }

   g_licenseValid = false;
   Print("Qrypton: licence invalide — ", response);
   return false;
  }

//+------------------------------------------------------------------+
//| Tolère une coupure réseau temporaire sans bloquer le robot       |
//+------------------------------------------------------------------+
bool UseGraceCache()
  {
   if(g_licenseValid && (TimeCurrent() - g_lastCheckOK) < g_graceHours * 3600)
      return true;

   Print("Qrypton: licence non vérifiée depuis plus de ", g_graceHours, "h. EA en pause.");
   return false;
  }
//+------------------------------------------------------------------+
