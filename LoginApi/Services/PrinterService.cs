using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;
using LoginApi.Models;

namespace LoginApi.Services
{
    public class PrinterService
    {
        private readonly IMemoryCache _cache;
        private const string PrintersCacheKey = "Printers";

        public PrinterService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public List<Printer> GetPrinters()
        {
            if (_cache.TryGetValue(PrintersCacheKey, out List<Printer> printers))
            {
                return printers;
            }

            printers = new List<Printer> {
                new Printer { Id = 1, Name = "Printer 1", IsActive = true, Brand = "Brand A", Model = "Model X", Description = "High-speed laser printer", Location = "Campus A, Building B, Room 101" },
                new Printer { Id = 2, Name = "Printer 2", IsActive = true, Brand = "Brand B", Model = "Model Y", Description = "Color inkjet printer", Location = "Campus A, Building C, Room 202" },
                new Printer { Id = 3, Name = "Printer 3", IsActive = false, Brand = "Brand A", Model = "Model Z", Description = "Eco-friendly printer", Location = "Campus B, Building A, Room 103" },
            };

            _cache.Set(PrintersCacheKey, printers);
            return printers;
        }

        public Printer GetPrinterById(int printerId)
        {
            var printers = GetPrinters();
            return printers.FirstOrDefault(p => p.Id == printerId);
        }

        // Cập nhật trạng thái cho nhiều máy in
        public void UpdatePrinterStatuses(List<PrinterStatusUpdateRequest> printerStatusUpdates)
        {
            var printers = GetPrinters();

            foreach (var update in printerStatusUpdates)
            {
                var printer = printers.FirstOrDefault(p => p.Id == update.PrinterId);
                if (printer != null)
                {
                    printer.IsActive = update.IsActive;
                }
            }
            _cache.Set(PrintersCacheKey, printers);
        }

        public void AddPrinter(Printer printer)
        {
            var printers = GetPrinters();
            printer.Id = printers.Any() ? printers.Max(p => p.Id) + 1 : 1; 
            printers.Add(printer);
            _cache.Set(PrintersCacheKey, printers);
        }

        public bool DeletePrinter(int id)
        {
            var printers = GetPrinters();
            var printer = printers.FirstOrDefault(p => p.Id == id);
            if (printer != null)
            {
                printers.Remove(printer);
                _cache.Set(PrintersCacheKey, printers);
                return true;
            }
            return false;
        }
    }

    
}
