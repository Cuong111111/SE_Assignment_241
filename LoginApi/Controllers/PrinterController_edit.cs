using Microsoft.AspNetCore.Mvc;
using LoginApi.Services;
using System.Collections.Generic;

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

        // Cập nhật trạng thái của nhiều máy in trong một lần gọi
        [HttpPut("status")]
        public IActionResult UpdatePrinterStatuses([FromBody] List<PrinterStatusUpdateRequest> requests)
        {
            _printerService.UpdatePrinterStatuses(requests);
            return Ok();
        }

        [HttpPost("add")]
        public IActionResult AddPrinter([FromBody] Printer printer)
        {
            if (printer == null)
                return BadRequest("Printer data is required");
            try
            {  
                var newPrinter = _printerService.AddPrinter(printer);
                return CreatedAtAction(nameof(AddPrinter), new { id = newPrinter.Id}, newPrinter);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message); 
            }
        }
        
        [HttpDelete("{id}/delete")]
        public IActionResult DeletePrinter(int id)
        {
            var success = _printerService.DeletePrinter(id);

            if (!success)
            {
                return NotFound($"Printer with ID {id} not found.");
            }

            return NoContent();
        }


    }
}
