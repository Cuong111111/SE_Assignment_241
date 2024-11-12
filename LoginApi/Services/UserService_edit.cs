using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;

namespace LoginApi.Services
{
    public class UserService
    {
        private readonly IMemoryCache _cache;
        private const string UserCacheKey = "Users";

        public UserService(IMemoryCache cache)
        {
            _cache = cache;
            SeedUsers();
        }

        // Phương thức để khởi tạo dữ liệu người dùng mẫu, bao gồm số dư trang
        private void SeedUsers()
        {
            if (!_cache.TryGetValue(UserCacheKey, out List<User> users))
            {
                users = new List<User>
                {
                    new User {ID=1, Email = "example@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A", isSPSO = true, Page_balance = 100,
                    PrintHistory = new List<PrintHistory>{
                         new PrintHistory { FileName = "Document1.pdf", Date = DateTime.Now.AddDays(-3), PrinterId = 1, NumberOfPages = 10 },
                        new PrintHistory { FileName = "Report2021.docx", Date = DateTime.Now.AddDays(-7), PrinterId = 2, NumberOfPages = 5 }}
                    },
                    new User {ID=2, Email = "example1@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A1", isSPSO = true, Page_balance = 200,
                     PrintHistory = new List<PrintHistory>{
                         new PrintHistory { FileName = "Document2.pdf", Date = DateTime.Now.AddDays(-5), PrinterId = 3, NumberOfPages = 2 }}
                    },
                    new User {ID=3, Email = "example2@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A2", isSPSO = false, Page_balance = 150,
                     PrintHistory = new List<PrintHistory>{
                         new PrintHistory { FileName = "Document3.pdf", Date = DateTime.Now.AddDays(-6), PrinterId = 4, NumberOfPages = 3 },
                        new PrintHistory { FileName = "Report2023.docx", Date = DateTime.Now.AddDays(-8), PrinterId = 5, NumberOfPages = 5 }}
                     },
                    new User {ID=4, Email = "example3@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A3", isSPSO = false, Page_balance = 75,
                     PrintHistory = new List<PrintHistory>{
                         new PrintHistory { FileName = "Document4.pdf", Date = DateTime.Now.AddDays(3), PrinterId = 6, NumberOfPages = 6 },
                        new PrintHistory { FileName = "Report2024.docx", Date = DateTime.Now.AddDays(7), PrinterId = 7, NumberOfPages = 7 }}
                     },
                    new User {ID=5, Email = "example5@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A4", isSPSO = false, Page_balance = 120,
                     PrintHistory = new List<PrintHistory>{
                         new PrintHistory { FileName = "Document5.pdf", Date = DateTime.Now.AddDays(-1), PrinterId = 8, NumberOfPages = 8 },
                        new PrintHistory { FileName = "Report2025.docx", Date = DateTime.Now.AddDays(-2), PrinterId = 9, NumberOfPages = 2 }}
                     }
                };
                _cache.Set(UserCacheKey, users);
            }
        }
        public int? GetUserPageBalance(int userId)
        {
            var user = GetUserById(userId);
            if(user==null) return null;
            return user?.Page_balance ?? 0;
        }

        // Cập nhật số dư trang của người dùng theo userID
        public int? UpdateUserPageBalance(int userId, int newBalance)
        {
            var users = GetUsers();
            var user = users.Find(u => u.ID == userId);
            if (user != null)
            {
                user.Page_balance = newBalance;
                _cache.Set(UserCacheKey, users); // Lưu lại vào cache sau khi cập nhật
                return user?.Page_balance ?? 0;
            }
            return null;
        }

        // Phương thức để lấy người dùng theo ID
        public User GetUserById(int id)
        {
            if (_cache.TryGetValue(UserCacheKey, out List<User> users))
            {
                return users.Find(user => user.ID == id);
            }
            return null;
        }

        // Lấy người dùng theo email
        public User GetUserByEmail(string email)
        {
            if (_cache.TryGetValue(UserCacheKey, out List<User> users))
            {
                return users.Find(user => user.Email == email);
            }
            return null;
        }

        // Lấy số dư trang của người dùng
        public int GetUserPageBalance(string email)
        {
            var user = GetUserByEmail(email);
            return user?.Page_balance ?? 0;
        }

        // Cập nhật số dư trang của người dùng
        public void UpdateUserPageBalance(string email, int newBalance)
        {
            var users = GetUsers();
            var user = users.Find(u => u.Email == email);
            if (user != null)
            {
                user.Page_balance = newBalance;
                _cache.Set(UserCacheKey, users); // Lưu lại vào cache sau khi cập nhật
            }
        }

        // Phương thức để lấy tất cả người dùng từ cache
        private List<User> GetUsers()
        {
            return _cache.TryGetValue(UserCacheKey, out List<User> users) ? users : new List<User>();
        }

         public List<PrintHistory> GetUserPrintHistory(int userId)
        {
            var user = GetUserById(userId);
            return user?.PrintHistory ?? new List<PrintHistory>();
        }
    }

    // Model User
    public class User
    {
        public int ID{ get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public bool isSPSO { get; set; }
        public int Page_balance { get; set; }
        public List<PrintHistory> PrintHistory { get; set; }
    }

    // Model UserRequest (yêu cầu đăng nhập)
    public class UserRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    
    public class PrintHistory
    {
        public string FileName { get; set; }
        public DateTime Date { get; set; }
        public int PrinterId { get; set; }
        public int NumberOfPages { get; set; }
    }
}
