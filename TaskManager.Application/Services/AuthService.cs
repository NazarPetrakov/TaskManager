using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TaskManager.Application.DTOs;
using TaskManager.Application.Exceptions;
using TaskManager.Application.IServices;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class AuthService(IMapper mapper, UserManager<AppUser> userManager,
    ITokenService tokenService) : IAuthService
{
    public async Task<UserDto> LoginAsync(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user == null || user.Email == null) throw new UnauthorizedAccessException("Invalid Email");

        var isCorrectPassword = await userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!isCorrectPassword) throw new UnauthorizedAccessException("Invalid Password");

        var email = await userManager.GetEmailAsync(user);
        if (email == null) throw new ArgumentException("No email for user");

        var token = await tokenService.CreateToken(user);

        return new UserDto
        {
            Email = email,
            Token = token,
            NickName = user.NickName
        };
    }

    public async Task<UserDto> RegisterUserAsync(RegisterDto registerDto)
    {
       if (await userManager.FindByEmailAsync(registerDto.Email) != null)
            throw new ArgumentException("A user with this email address is already registered.");

        var user = mapper.Map<AppUser>(registerDto);

        user.UserName = registerDto.Email;

        var createResult = await userManager.CreateAsync(user, registerDto.Password);
        if (!createResult.Succeeded) throw new ValidationException("Registration failed", createResult.Errors);

        var email = await userManager.GetEmailAsync(user);
        if (email == null) throw new ArgumentException("No email for user");

        var token = await tokenService.CreateToken(user);

        return new UserDto
        {
            Email = email,
            Token = token,
            NickName = registerDto.NickName
        };
    }
}
