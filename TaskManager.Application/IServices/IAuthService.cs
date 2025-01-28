using TaskManager.Application.DTOs;

namespace TaskManager.Application.IServices;

public interface IAuthService
{
    Task<UserDto> RegisterUserAsync(RegisterDto registerDto);
    Task<UserDto> LoginAsync(LoginDto registerDto);
}
