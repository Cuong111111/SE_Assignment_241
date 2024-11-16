namespace LoginApi.Models
{
    public class User
    {
        public int ID{ get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public bool isSPSO { get; set; }
        public int Page_balance { get; set; }
        public List<PaymentHistory> RecentPayments { get; set; }
        public List<PrintHistory> RecentPrints { get; set; }
    }
    
    public class UserRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}