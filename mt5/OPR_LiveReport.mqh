//+------------------------------------------------------------------+
//| OPR_LiveReport.mqh |
//| Envoie chaque trade clôturé vers l'API Qrypton (Performance live)|
//| À appeler depuis OnTradeTransaction() quand un deal de sortie |
//| est détecté (DEAL_ENTRY_OUT). |
//+------------------------------------------------------------------+
#property strict

string ReportUrl = "https://api.qrypton.io/v1/trades/report";

//+------------------------------------------------------------------+
//| dealTicket = ticket du deal de clôture (fourni par OnTradeTransaction) |
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

   // R multiple approximatif basé sur le risque fixe défini dans l'EA (RiskPercent)
   double riskAmount = balanceAfter * (RiskPercent / 100.0);
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
      PrintFormat("Qrypton: échec de l'envoi du trade au serveur (code %d). Il sera retenté au prochain trade.", GetLastError());
   else
      Print("Qrypton: trade reporté avec succès.");
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
