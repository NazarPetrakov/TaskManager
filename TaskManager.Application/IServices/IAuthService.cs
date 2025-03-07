using System.Security.Claims;
using TaskManager.Application.DTOs;
using TaskManager.Application.DTOs.User;

namespace TaskManager.Application.IServices;

public interface IAuthService
{
    Task<UserDto> RegisterUserAsync(RegisterDto registerDto);
    Task<UserDto> LoginAsync(LoginDto registerDto);
    Task<AppUserDto> GetAuthorizedUser(ClaimsPrincipal user);
    Task ChangeEmail(ClaimsPrincipal user, string newEmail);
    Task ChangePassword(ClaimsPrincipal user, ChangePasswordDto change);
}
