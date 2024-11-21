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
        
        public List<PrintHistory> GetAllPrintHistory()
        {
            if (_cache.TryGetValue(PrintHistoryCacheKey, out List<PrintHistory> printHistory))
                return printHistory;
            return new List<PrintHistory>(); 
        }
         public List<PrintHistory> GetPrintHistoryByFilter(int year, int month, int day)
        {
            if (_cache.TryGetValue(PrintHistoryCacheKey, out List<PrintHistory> printHistory))
                return printHistory.Where(ph => ph.PrintDate.Year == year && ph.PrintDate.Month == month && ph.PrintDate.Day == day).ToList();
    
            return new List<PrintHistory>();
        }
        
        public MonthlyReport GetMonthlyReport(int year, int month)
        {
            var printHistory = _cache.TryGetValue(PrintHistoryCacheKey, out List<PrintHistory> printData)
            ? printData.Where(ph => ph.PrintDate.Year == year && ph.PrintDate.Month == month).ToList()
            : new List<PrintHistory>();

            var paymentHistory = _cache.TryGetValue(PaymentHistoryCacheKey, out List<PaymentHistory> paymentData)
            ? paymentData.Where(ph => ph.PaymentDate.Year == year && ph.PaymentDate.Month == month).ToList()
            : new List<PaymentHistory>();

    
            var printerSummary = printHistory
            .GroupBy(ph => ph.PrinterId)
            .Select(group => new PrinterReport
            {
                PrinterId = group.Key,
                PagesPrinted = group.Sum(ph => ph.PagesPrinted)
            }).ToList();

            decimal totalPayments = paymentHistory.Sum(ph => ph.Amount); //total payment for month

            if (printerSummary.Count == 0 && totalPayments == 0)
        
                return null;

            return new MonthlyReport
            {
            Year = year,
            Month = month,
            PrinterReports = printerSummary,
            TotalPayments = totalPayments
            };
        }
    }
    
}
