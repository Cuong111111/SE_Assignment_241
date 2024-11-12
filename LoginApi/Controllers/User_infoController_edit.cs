using Microsoft.AspNetCore.Mvc;
using LoginApi.Services;

namespace LoginApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class User_infoController : ControllerBase
    {
        private readonly UserService _userService;

        public User_infoController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserRequest loginRequest)
        {
            var user = _userService.GetUserByEmail(loginRequest.Email);
            if (user == null)
            {
                return NotFound(new { message = "No account found" });
            }
            if (user.Password != loginRequest.Password)
            {
                return Unauthorized(new { message = "Incorrect password" });
            }
            return Ok(new { message = "Login successful", user = new {user.ID, user.Name, user.isSPSO}});
            
        }
        [HttpGet("{userId}/pagebalance")]
        public IActionResult GetUserPageBalance(int userId)
        {
            var balance = _userService.GetUserPageBalance(userId);
            if (balance == null)
            {
                return NotFound(new { message = "No account found" });
            }
            return Ok(new { UserId = userId, PageBalance = balance });
        }

        // API cập nhật số dư trang của người dùng theo userID
        [HttpPut("{userId}/pagebalance")]
        public IActionResult UpdateUserPageBalance(int userId, [FromBody] int newBalance)
        {
            if(_userService.UpdateUserPageBalance(userId, newBalance)==null)
                return NotFound(new { message = "No account found" });
            return Ok(new { UserId = userId, UpdatedPageBalance = newBalance });
        }
        
        [HttpGet("{userId}/printhistory")]
        public IActionResult GetUserPrintHistory(int userId)
        {
            var printHistory = _userService.GetUserPrintHistory(userId);
            if (printHistory == null || printHistory.Count == 0)
                return NotFound(new { message = "No print history found" });
            
            var formattedHistory = printHistory.Select(ph => new 
            {
            ph.FileName,
            Date = ph.Date.ToString("yyyy-MM-dd HH:mm:ss"),
            ph.PrinterId,
            ph.NumberOfPages
            }).ToList();

            return Ok(new { UserId = userId, PrintHistory = formattedHistory });

        }
    }
}
