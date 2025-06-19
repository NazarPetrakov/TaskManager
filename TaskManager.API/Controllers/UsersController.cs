using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.DTOs.User;
using TaskManager.Application.Extensions;
using TaskManager.Application.IServices;
using TaskManager.Domain.Entities;

namespace TaskManager.API.Controllers
{
    [Authorize]
    public class UsersController(IAuthService authService, IUserService userService) : BaseApiController
    {
        [HttpGet("me")]
        public async Task<ActionResult<AppUserDto>> GetAuthorizedUser() =>
            await authService.GetAuthorizedUser(User);
        [HttpPatch("me")]
        public async Task PatchUser([FromBody] JsonPatchDocument<AppUser> doc) =>
            await userService.PatchUserAsync(User.GetUserId(), doc);
        [HttpPost("me/change-email")]
        public async Task ChangeEmail([FromBody] ChangeEmailDto emailDto) =>
            await authService.ChangeEmail(User, emailDto.NewEmail);
        [HttpPost("me/change-password")]
        public async Task ChangePassword([FromBody] ChangePasswordDto changePasswordDto) =>
            await authService.ChangePassword(User, changePasswordDto);
    }
}
