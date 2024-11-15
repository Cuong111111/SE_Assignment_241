using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;
using LoginApi.Models;

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
                    new User {ID=1, Email = "example@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A", isSPSO = true, Page_balance = 100 },
                    new User {ID=2, Email = "example1@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A1", isSPSO = true, Page_balance = 200 },
                    new User {ID=3, Email = "example2@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A2", isSPSO = false, Page_balance = 150 },
                    new User {ID=4, Email = "example3@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A3", isSPSO = false, Page_balance = 75 },
                    new User {ID=5, Email = "example5@hcmut.edu.vn", Password = "password123", Name = "Nguyen Van A4", isSPSO = false, Page_balance = 120 }
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
    }
}
