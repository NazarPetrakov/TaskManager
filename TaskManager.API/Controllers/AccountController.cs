using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.IServices;

namespace TaskManager.API.Controllers
{
    public class AccountController(IAuthService authService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) =>
            await authService.RegisterUserAsync(registerDto);

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) =>
            await authService.LoginAsync(loginDto);
    }
}
