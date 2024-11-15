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

        // Get payment history by user ID
        [HttpGet("payment/{userId}")]
        public IActionResult GetPaymentHistory(int userId)
        {
            var history = _historyService.GetPaymentHistory(userId);
            return Ok(history);
        }

        // Add payment history
        [HttpPost("payment")]
        public IActionResult AddPaymentHistory([FromBody] PaymentHistory payment)
        {
            _historyService.AddPaymentHistory(payment);
            return Ok();
        }

        // Get print history by user ID
        [HttpGet("print/{userId}")]
        public IActionResult GetPrintHistory(int userId)
        {
            var history = _historyService.GetPrintHistory(userId);
            return Ok(history);
        }

        // Add print history
        [HttpPost("print")]
        public IActionResult AddPrintHistory([FromBody] PrintHistory print)
        {
            _historyService.AddPrintHistory(print);
            return Ok();
        }
    }

}
