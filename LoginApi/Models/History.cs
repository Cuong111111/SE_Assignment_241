namespace LoginApi.Models
{
    public class PaymentHistory
    {
        public int PaymentId { get; set; }
        public int UserId { get; set; }
        public DateTime PaymentDate { get; set; }
        public int Amount { get; set; }
    }

    public class PrintHistory
    {
        public int PrintId { get; set; }
        public int UserId { get; set; }
        public DateTime PrintDate { get; set; }
        public int PagesPrinted { get; set; }
        public int PrinterId { get; set; }
        public string FileFormats { get; set; }
        public string Title { get; set; }
    }
    
    public class PrinterReport
    {
        public int PrinterId { get; set; }
        public int PagesPrinted { get; set; }
    }

    public class MonthlyReport
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<PrinterReport> PrinterReports { get; set; }
        public decimal TotalPayments { get; set; }
    }

    public class DetailedMonthlyReport
{
    public int Year { get; set; }
    public int Month { get; set; }
    public List<PrintHistoryDetail> PrintHistory { get; set; }
    public List<PaymentHistoryDetail> PaymentHistory { get; set; }
    public List<PrinterReport> PrinterReports { get; set; }
    public decimal TotalPayments { get; set; }
}

public class PrintHistoryDetail
{
    public int PrintId { get; set; }
    public int UserId { get; set; }
    public int PrinterId { get; set; }
    public int PagesPrinted { get; set; }
    public DateTime PrintDate { get; set; }
    public string FileFormats { get; set; }
    public string Title { get; set; }
}

public class PaymentHistoryDetail
{
    public int PaymentId { get; set; }
    public int UserId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
}



}
