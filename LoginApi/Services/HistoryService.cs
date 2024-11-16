using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using LoginApi.Models;

namespace LoginApi.Services
{
    public class HistoryService
    {
        private readonly IMemoryCache _cache;
        private const string PaymentHistoryCacheKey = "PaymentHistory";
        private const string PrintHistoryCacheKey = "PrintHistory";

        public HistoryService(IMemoryCache cache)
        {
            _cache = cache;
        }

        // Methods for Payment History
        public List<PaymentHistory> GetPaymentHistory(int userId)
        {
            if (_cache.TryGetValue(PaymentHistoryCacheKey, out List<PaymentHistory> paymentHistory))
            {
                return paymentHistory.Where(p => p.UserId == userId).ToList();
            }
            return new List<PaymentHistory>();
        }

        public void AddPaymentHistory(PaymentHistory payment)
        {
            var paymentHistory = GetPaymentHistory(payment.UserId);
            paymentHistory.Add(payment);
            _cache.Set(PaymentHistoryCacheKey, paymentHistory);
        }

        // Methods for Print History
        public List<PrintHistory> GetPrintHistory(int userId)
        {
            if (_cache.TryGetValue(PrintHistoryCacheKey, out List<PrintHistory> printHistory))
            {
                return printHistory.Where(p => p.UserId == userId).ToList();
            }
            return new List<PrintHistory>();
        }

        public void AddPrintHistory(PrintHistory print)
        {
            var printHistory = GetPrintHistory(print.UserId);
            printHistory.Add(print);
            _cache.Set(PrintHistoryCacheKey, printHistory);
        }
    }
    
}
