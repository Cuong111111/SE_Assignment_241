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
        private const string UserCacheKey = "Users";

        public HistoryService(IMemoryCache cache)
        {
            _cache = cache;
        }

        private bool IsUserIdValid(int userId)
        {
            Console.WriteLine("haa22");
            if (_cache.TryGetValue(UserCacheKey, out List<User> users))
            {
                return users.Any(user => user.ID == userId);
            }
            return false;
        }

        public bool AddPaymentHistory(PaymentHistory payment)
        {
            if (!IsUserIdValid(payment.UserId)) return false;

            if (!_cache.TryGetValue(PaymentHistoryCacheKey, out List<PaymentHistory> paymentHistory))
            {
                paymentHistory = new List<PaymentHistory>();
            }

            payment.PaymentId = paymentHistory.Any() ? paymentHistory.Max(p => p.PaymentId) + 1 : 1;
            paymentHistory.Add(payment);
            _cache.Set(PaymentHistoryCacheKey, paymentHistory);
            return true;
        }

        // Updated AddPrintHistory method
        public bool AddPrintHistory(PrintHistory print)
        {
            if (!IsUserIdValid(print.UserId)) return false;

            if (!_cache.TryGetValue(PrintHistoryCacheKey, out List<PrintHistory> printHistory))
            {
                printHistory = new List<PrintHistory>();
            }

            print.PrintId = printHistory.Any() ? printHistory.Max(p => p.PrintId) + 1 : 1;
            printHistory.Add(print);
            _cache.Set(PrintHistoryCacheKey, printHistory);
            return true;
        }

        // Updated GetPaymentHistory to return null if userId is invalid
        public List<PaymentHistory> GetPaymentHistory(int userId)
        {
            if (!IsUserIdValid(userId)) return null;

            if (_cache.TryGetValue(PaymentHistoryCacheKey, out List<PaymentHistory> paymentHistory))
            {
                return paymentHistory.Where(p => p.UserId == userId).ToList();
            }
            return new List<PaymentHistory>();
        }

        // Updated GetPrintHistory to return null if userId is invalid
        public List<PrintHistory> GetPrintHistory(int userId)
        {
            if (!IsUserIdValid(userId)) return null;

            if (_cache.TryGetValue(PrintHistoryCacheKey, out List<PrintHistory> printHistory))
            {
                return printHistory.Where(p => p.UserId == userId).ToList();
            }
            return new List<PrintHistory>();
        }
    }
    
}
