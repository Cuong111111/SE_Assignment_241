using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;

namespace LoginApi.Services
{
    public class SystemConfigService
    {
        private readonly IMemoryCache _cache;
        private const string SystemConfigCacheKey = "SystemConfig";

        public SystemConfigService(IMemoryCache cache)
        {
            _cache = cache;
        }

        // Lấy cấu hình hệ thống từ cache
        public SystemConfig GetSystemConfig()
        {
            if (_cache.TryGetValue(SystemConfigCacheKey, out SystemConfig config))
            {
                return config;
            }

            // Nếu chưa có trong cache, tạo cấu hình mặc định
            config = new SystemConfig
            {
                AllowedFileFormats = new List<string> { "PDF", "DOCX" },
                DefaultPrintPageLimit = 100,
                IssueDate = DateTime.Now
            };

            // Lưu cấu hình mặc định vào cache
            _cache.Set(SystemConfigCacheKey, config);
            return config;
        }

        // Cập nhật cấu hình hệ thống trong cache
        public void UpdateSystemConfig(SystemConfig config)
        {
            _cache.Set(SystemConfigCacheKey, config);
        }
    }

    public class SystemConfig
    {
        public List<string> AllowedFileFormats { get; set; }
        public int DefaultPrintPageLimit { get; set; }
        public DateTime IssueDate { get; set; }
    }
}
