using Microsoft.AspNetCore.Mvc;
using LoginApi.Services;
using System.Collections.Generic;
using LoginApi.Models;

namespace LoginApi.Controllers
{
    [ApiController]
    [Route("api/printers")]
    public class PrinterController : ControllerBase
    {
        private readonly PrinterService _printerService;

        public PrinterController(PrinterService printerService)
        {
            _printerService = printerService;
        }

        [HttpGet("status")]
        public IActionResult GetPrintersByStatus()
        {
            var printers = _printerService.GetPrinters();
            var activePrinters = printers.FindAll(p => p.IsActive);
            var inactivePrinters = printers.FindAll(p => !p.IsActive);

            return Ok(new { ActivePrinters = activePrinters, InactivePrinters = inactivePrinters });
        }

        [HttpPut("status")]
        public IActionResult UpdatePrinterStatuses([FromBody] List<PrinterStatusUpdateRequest> requests)
        {
            _printerService.UpdatePrinterStatuses(requests);
            return Ok();
        }

        [HttpGet("{printerId}")]
        public IActionResult GetPrinterById(int printerId){
            var printer = _printerService.GetPrinterById(printerId);
            if(printer == null) 
                return NotFound($"Printer with ID {printerId} not found.");
            return Ok(printer);
        }
        
        [HttpPost("add")]
        public IActionResult AddPrinter([FromBody] Printer printer)
        {
            _printerService.AddPrinter(printer);
            return Ok("Printer added successfully.");
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeletePrinter(int id)
        {
            bool isDeleted = _printerService.DeletePrinter(id);
            if (isDeleted)
            {
                return Ok("Printer deleted successfully.");
            }
            else
            {
                return NotFound("Printer not found.");
            }
        }
    }
}
