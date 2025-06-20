using System.Security.Claims;
using System.Web;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TaskManager.Application.DTOs;
using TaskManager.Application.DTOs.User;
using TaskManager.Application.Exceptions;
using TaskManager.Application.Extensions;
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

        var id = await userManager.GetUserIdAsync(user);
        if (string.IsNullOrEmpty(id)) throw new ArgumentException("No id for user");

        var token = await tokenService.CreateToken(user);

        return new UserDto
        {
            Id = id,
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

        var id = await userManager.GetUserIdAsync(user);
        if (string.IsNullOrEmpty(id)) throw new ArgumentException("No id for user");

        var token = await tokenService.CreateToken(user);

        return new UserDto
        {
            Id = id,
            Token = token,
            NickName = registerDto.NickName
        };
    }
    public async Task<AppUserDto> GetAuthorizedUser(ClaimsPrincipal user)
    {
        var userId = user.GetUserId();
        var appUser = await userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("No users with this id");

        var result = mapper.Map<AppUserDto>(appUser);

        return result;
    }
    public async Task ChangeEmail(ClaimsPrincipal user, string newEmail)
    {
        var userId = user.GetUserId();
        var appUser = await userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("No users with this id");

        var emailResult = await userManager.SetEmailAsync(appUser, newEmail);
        if (!emailResult.Succeeded)
            throw new ValidationException("Changing email failed", emailResult.Errors);

        var usernameResult = await userManager.SetUserNameAsync(appUser, newEmail);
        if (!usernameResult.Succeeded)
            throw new ValidationException("Changing email failed", usernameResult.Errors);

        await userManager.UpdateAsync(appUser);
    }
    public async Task ChangePassword(ClaimsPrincipal user, ChangePasswordDto change)
    {
        var userId = user.GetUserId();
        var appUser = await userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("No users with this id");

        var passwordResult = await userManager.ChangePasswordAsync(appUser, change.CurrentPassword, change.NewPassword);
        if (!passwordResult.Succeeded)
            throw new ValidationException("Changing password failed", passwordResult.Errors);

        await userManager.UpdateAsync(appUser);

    }
}
