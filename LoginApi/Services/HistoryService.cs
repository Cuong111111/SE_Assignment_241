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
            SeedHistory();
        }

        private void SeedHistory()
        {
        // Seed Payment History
        if (!_cache.TryGetValue(PaymentHistoryCacheKey, out List<PaymentHistory> paymentHistory))
            {
            paymentHistory = new List<PaymentHistory>
                {
                    new PaymentHistory { PaymentId = 1, UserId = 3, Amount = 100, PaymentDate = new DateTime(2024, 12, 1) },
                    new PaymentHistory { PaymentId = 2, UserId = 3, Amount = 250, PaymentDate = new DateTime(2024, 12, 3) },
                    new PaymentHistory { PaymentId = 3, UserId = 4, Amount = 175, PaymentDate = new DateTime(2024, 11, 28) },
                    new PaymentHistory { PaymentId = 4, UserId = 5, Amount = 300, PaymentDate = new DateTime(2024, 11, 30) },
                    new PaymentHistory { PaymentId = 5, UserId = 5, Amount = 120, PaymentDate = new DateTime(2024, 12, 5) }
                };
            _cache.Set(PaymentHistoryCacheKey, paymentHistory);
            }

        // Seed Print History
        if (!_cache.TryGetValue(PrintHistoryCacheKey, out List<PrintHistory> printHistory))
            {
            printHistory = new List<PrintHistory>
                {
                    new PrintHistory { PrintId = 1, UserId = 3, PrinterId = 2, PagesPrinted = 3, PrintDate = new DateTime(2024, 12, 1), FileFormats = "PDF", Title = "Report_2024" },
                    new PrintHistory { PrintId = 2, UserId = 3, PrinterId = 2, PagesPrinted = 4, PrintDate = new DateTime(2024, 12, 2), FileFormats = "DOCX", Title = "Thesis_Draft" },
                    new PrintHistory { PrintId = 3, UserId = 4, PrinterId = 2, PagesPrinted = 2, PrintDate = new DateTime(2024, 12, 3), FileFormats = "DOCX", Title = "Presentation" },
                    new PrintHistory { PrintId = 4, UserId = 4, PrinterId = 2, PagesPrinted = 1, PrintDate = new DateTime(2024, 11, 30), FileFormats = "DOCX", Title = "Invoice_1234" },
                    new PrintHistory { PrintId = 5, UserId = 5, PrinterId = 2, PagesPrinted = 5, PrintDate = new DateTime(2024, 12, 5), FileFormats = "DOCX", Title = "Notes" }
                };
            };
            _cache.Set(PrintHistoryCacheKey, printHistory);
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
