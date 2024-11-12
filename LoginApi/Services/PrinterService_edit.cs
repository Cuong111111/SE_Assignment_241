using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;

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

            printers = new List<Printer>
            {
                new Printer { Id = 1, Name = "Máy in 1", IsActive = true },
                new Printer { Id = 2, Name = "Máy in 2", IsActive = true },
                new Printer { Id = 3, Name = "Máy in 3", IsActive = false },
                new Printer { Id = 4, Name = "Máy in 4", IsActive = true },
                new Printer { Id = 5, Name = "Máy in 5", IsActive = false },
                new Printer { Id = 6, Name = "Máy in 6", IsActive = true },
                new Printer { Id = 7, Name = "Máy in 7", IsActive = false }
            };

            _cache.Set(PrintersCacheKey, printers);
            return printers;
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

        // Thêm máy in
        public Printer AddPrinter(Printer printer)
        {
            var printers = GetPrinters(); //danh sach   
            
           
            printers.Add(printer);

           
            _cache.Set(PrintersCacheKey, printers); // save
            return printer;
        }
        
        // Xóa máy in
        public bool DeletePrinter(int id)
        {
            var printers = GetPrinters();
            var printerToDelete = printers.FirstOrDefault(p => p.Id == id);

            if (printerToDelete == null) // khong = id
            {
                return false; 
            }

            printers.Remove(printerToDelete);
            _cache.Set(PrintersCacheKey, printers);

            return true;
        }
    }

    public class Printer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

    public class PrinterStatusUpdateRequest
    {
        public int PrinterId { get; set; }
        public bool IsActive { get; set; }
    }
    
    

}

