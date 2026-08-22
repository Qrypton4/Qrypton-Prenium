//+------------------------------------------------------------------+
//| OPR_LiveReport.mqh |
//| Envoie chaque trade clôturé vers l'API Qrypton (Performance live)|
//| À appeler depuis OnTradeTransaction() quand un deal de sortie |
//| est détecté (DEAL_ENTRY_OUT). Inclut un rattrapage automatique |
//| des trades manqués (PC/MT5 éteint au moment de la clôture), |
//| à appeler dans OnInit() via CatchUpMissedTrades(). |
//+------------------------------------------------------------------+
#property strict

string ReportUrl = "https://qryptonedge.com/api/v1/trades/report";

// Mémorise le dernier trade correctement envoyé, pour ne pas le renvoyer
// deux fois et pour savoir jusqu'où remonter au redémarrage.
ulong g_lastReportedTicket = 0;

string GlobalVarName()
  {
   return "Qrypton_LastTicket_" + IntegerToString((int)AccountInfoInteger(ACCOUNT_LOGIN)) + "_" + _Symbol;
  }

void SaveLastReportedTicket(ulong ticket)
  {
   if(ticket > g_lastReportedTicket)
     {
      g_lastReportedTicket = ticket;
      GlobalVariableSet(GlobalVarName(), (double)ticket);
     }
  }

//+------------------------------------------------------------------+
//| dealTicket = ticket du deal de clôture (fourni par OnTradeTransaction |
//| ou par le rattrapage CatchUpMissedTrades) |
//+------------------------------------------------------------------+
void ReportClosedTrade(ulong dealTicket)
  {
   if(!HistoryDealSelect(dealTicket))
      return;

   double profit = HistoryDealGetDouble(dealTicket, DEAL_PROFIT)
                    + HistoryDealGetDouble(dealTicket, DEAL_SWAP)
                    + HistoryDealGetDouble(dealTicket, DEAL_COMMISSION);
   double volume = HistoryDealGetDouble(dealTicket, DEAL_VOLUME);
   string symbol = HistoryDealGetString(dealTicket, DEAL_SYMBOL);
   long dealType = HistoryDealGetInteger(dealTicket, DEAL_TYPE);
   string direction = (dealType == DEAL_TYPE_SELL) ? "sell" : "buy"; // sortie d'un achat = vente, etc.
   datetime closeTime = (datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME);
   double closePrice = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
   double balanceAfter = AccountInfoDouble(ACCOUNT_BALANCE);

   // Recherche du deal d'entrée de la même position pour récupérer l'heure et le prix d'ouverture réels
   long positionId = HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID);
   datetime openTime = closeTime; // valeur de repli si jamais l'entrée n'est pas retrouvée
   double openPrice = 0;

   if(HistorySelectByPosition(positionId))
     {
      int totalDeals = HistoryDealsTotal();
      for(int i = 0; i < totalDeals; i++)
        {
         ulong ticket = HistoryDealGetTicket(i);
         if(HistoryDealGetInteger(ticket, DEAL_ENTRY) == DEAL_ENTRY_IN)
           {
            openTime = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);
            openPrice = HistoryDealGetDouble(ticket, DEAL_PRICE);
            break;
           }
        }
     }

   // R multiple approximatif basé sur le risque fixe défini dans l'EA (InpRiskPercent)
   double riskAmount = balanceAfter * (InpRiskPercent / 100.0);
   double rMultiple = (riskAmount != 0) ? profit / riskAmount : 0;

   string json = StringFormat(
      "{\"license_key\":\"%s\",\"account_login\":\"%d\",\"symbol\":\"%s\",\"direction\":\"%s\","
      "\"open_time\":\"%s\",\"close_time\":\"%s\",\"open_price\":%.5f,\"close_price\":%.5f,"
      "\"lot_size\":%.2f,\"profit\":%.2f,\"r_multiple\":%.2f,\"balance_after\":%.2f}",
      LicenseKey, AccountInfoInteger(ACCOUNT_LOGIN), symbol, direction,
      TimeToString(openTime, TIME_DATE|TIME_SECONDS), TimeToString(closeTime, TIME_DATE|TIME_SECONDS),
      openPrice, closePrice, volume, profit, rMultiple, balanceAfter);

   char post[]; char result[]; string headers = "Content-Type: application/json\r\n"; string resultHeaders;
   StringToCharArray(json, post, 0, StringLen(json));

   int res = WebRequest("POST", ReportUrl, headers, 5000, post, result, resultHeaders);

   if(res == -1)
      PrintFormat("Qrypton: échec de l'envoi du trade #%d au serveur (code %d). Il sera retenté au prochain démarrage.", dealTicket, GetLastError());
   else
     {
      Print("Qrypton: trade #", dealTicket, " reporté avec succès.");
      SaveLastReportedTicket(dealTicket);
     }
  }

//+------------------------------------------------------------------+
//| Rattrapage des trades clôturés pendant que le robot était éteint |
//| (PC arrêté, MT5 fermé, coupure...). À appeler dans OnInit(), |
//| après la vérification de licence. |
//+------------------------------------------------------------------+
void CatchUpMissedTrades()
  {
   string varName = GlobalVarName();
   bool firstRun = !GlobalVariableCheck(varName);

   if(firstRun)
     {
      // Premier lancement avec ce système : on ne renvoie pas tout l'historique
      // existant du compte, on se contente de retenir le dernier trade déjà
      // présent comme point de départ pour les futurs rattrapages.
      ulong maxTicket = 0;
      if(HistorySelect(0, TimeCurrent()))
        {
         int total = HistoryDealsTotal();
         for(int i = 0; i < total; i++)
           {
            ulong ticket = HistoryDealGetTicket(i);
            if(HistoryDealGetString(ticket, DEAL_SYMBOL) != _Symbol) continue;
            if(HistoryDealGetInteger(ticket, DEAL_MAGIC) != InpMagicNumber) continue;
            if(HistoryDealGetInteger(ticket, DEAL_ENTRY) != DEAL_ENTRY_OUT) continue;
            if(ticket > maxTicket) maxTicket = ticket;
           }
        }
      g_lastReportedTicket = maxTicket;
      GlobalVariableSet(varName, (double)maxTicket);
      Print("Qrypton: initialisation du suivi des trades (aucun rattrapage au premier lancement).");
      return;
     }

   g_lastReportedTicket = (ulong)GlobalVariableGet(varName);

   if(!HistorySelect(0, TimeCurrent()))
      return;

   int total = HistoryDealsTotal();
   ulong toProcess[];
   int count = 0;
   ArrayResize(toProcess, total);

   for(int i = 0; i < total; i++)
     {
      ulong ticket = HistoryDealGetTicket(i);
      if(ticket <= g_lastReportedTicket) continue;
      if(HistoryDealGetString(ticket, DEAL_SYMBOL) != _Symbol) continue;
      if(HistoryDealGetInteger(ticket, DEAL_MAGIC) != InpMagicNumber) continue;
      if(HistoryDealGetInteger(ticket, DEAL_ENTRY) != DEAL_ENTRY_OUT) continue;

      toProcess[count] = ticket;
      count++;
     }

   if(count == 0)
     {
      Print("Qrypton: aucun trade manqué à rattraper.");
      return;
     }

   ArrayResize(toProcess, count);
   ArraySort(toProcess);

   PrintFormat("Qrypton: %d trade(s) manqué(s) détecté(s), rattrapage en cours...", count);

   for(int i = 0; i < count; i++)
      ReportClosedTrade(toProcess[i]);
  }

//+------------------------------------------------------------------+
//| À placer dans le fichier principal de l'EA : |
//| |
//| void OnTradeTransaction(const MqlTradeTransaction& trans, |
//| const MqlTradeRequest& request, |
//| const MqlTradeResult& result) |
//| { |
//| if(trans.type == TRADE_TRANSACTION_DEAL_ADD) |
//| { |
//| if(HistoryDealSelect(trans.deal) && |
//| HistoryDealGetInteger(trans.deal, DEAL_ENTRY) == DEAL_ENTRY_OUT) |
//| ReportClosedTrade(trans.deal); |
//| } |
//| } |
//+------------------------------------------------------------------+
