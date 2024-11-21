using Microsoft.AspNetCore.Mvc;
using LoginApi.Services;
using LoginApi.Models;

namespace LoginApi.Controllers
{
    [ApiController]
    [Route("api/history")]
    public class HistoryController : ControllerBase
    {
        private readonly HistoryService _historyService;

        public HistoryController(HistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpGet("payment/{userId}")]
        public IActionResult GetPaymentHistory(int userId)
        {
            var history = _historyService.GetPaymentHistory(userId);
            if (history == null )
            {
                return NotFound($"No payment history found for UserId: {userId}");
            }
            return Ok(history);
        }

        // Add payment history
        [HttpPost("payment")]
        public IActionResult AddPaymentHistory([FromBody] PaymentHistory payment)
        {
            var success = _historyService.AddPaymentHistory(payment);
            if (!success)
            {
                return NotFound($"UserId: {payment.UserId} is not valid for adding payment history.");
            }
            return Ok(new { Message = "Payment history added successfully.", PaymentId = payment.PaymentId });
        }

        // Get print history by user ID
        [HttpGet("print/{userId}")]
        public IActionResult GetPrintHistory(int userId)
        {
            var history = _historyService.GetPrintHistory(userId);
            if (history == null)
            {
                return NotFound($"No print history found for UserId: {userId}");
            }
            return Ok(history);
        }

        // Add print history
        [HttpPost("print")]
        public IActionResult AddPrintHistory([FromBody] PrintHistory print)
        {
            var success = _historyService.AddPrintHistory(print);
            if (!success)
            {
                return NotFound($"UserId: {print.UserId} is not valid for adding print history.");
            }
            return Ok(new { Message = "Print history added successfully.", PrintId = print.PrintId });
        }
        
        [HttpGet("allprint")]
        public IActionResult GetAllPrintHistory()
        {
            var history = _historyService.GetAllPrintHistory();
            if (history == null)
            {
                return NotFound("No print history found.");
            }
            return Ok(history);

        }
        [HttpGet("print/month")]
        public IActionResult GetPrintHistoryByFilter([FromQuery] int year, [FromQuery] int month, [FromQuery]int day)
        {
            var history = _historyService.GetPrintHistoryByFilter(year, month,day);
            if (history == null || history.Count == 0)
            {
                return NotFound($"No print history found for {day:00}-{month:00}-{year}.");
            }
        return Ok(history);
        }
        
        [HttpGet("monthly-report")]
        public IActionResult GetMonthlyReport([FromQuery] int year, [FromQuery] int month)
        {
            var report = _historyService.GetMonthlyReport(year, month);
            if (report == null)
                return NotFound($"No data found for {month:00}-{year}.");

            return Ok(report);
        }
    }

}
