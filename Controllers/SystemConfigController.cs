using Microsoft.AspNetCore.Mvc;
using LoginApi.Services;
using LoginApi.Models;

namespace LoginApi.Controllers
{
    [ApiController]
    [Route("api/system-config")]
    public class SystemConfigController : ControllerBase
    {
        private readonly SystemConfigService _configService;

        public SystemConfigController(SystemConfigService configService)
        {
            _configService = configService;
        }

        [HttpGet]
        public IActionResult GetSystemConfig()
        {
            var config = _configService.GetSystemConfig();
            return Ok(config);
        }

        [HttpPut]
        public IActionResult UpdateSystemConfig([FromBody] SystemConfig config)
        {
            _configService.UpdateSystemConfig(config);
            return Ok(config);
        }
    }
}
