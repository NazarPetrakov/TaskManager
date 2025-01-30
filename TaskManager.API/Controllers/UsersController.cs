using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.IServices;

namespace TaskManager.API.Controllers
{
    [Authorize]
    public class UsersController(IAuthService authService) : BaseApiController
    {
        [HttpGet("me")]
        public async Task<ActionResult<AppUserDto>> GetAuthorizedUser() =>
            await authService.GetAuthorizedUser(User);
            
    }
}
