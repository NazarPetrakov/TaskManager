using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.IServices;
using TaskManager.Domain.Entities;

namespace TaskManager.API.Controllers
{
    public class AccountController(UserManager<AppUser> userManager,
        ITokenService tokenService, IMapper mapper) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await userManager.FindByEmailAsync(registerDto.Email) != null)
                return BadRequest("A user with this email address is already registered.");

            var user = mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Email;

            var createResult = await userManager.CreateAsync(user, registerDto.Password);
            if (!createResult.Succeeded) return BadRequest(createResult.Errors);

            var email = await userManager.GetEmailAsync(user);
            if (email == null) return BadRequest("No email for user");

            var token = await tokenService.CreateToken(user);

            return new UserDto
            {
                Email = email,
                Token = token,
                NickName = registerDto.NickName
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || user.Email == null) return Unauthorized("Invalid Email");

            var isCorrectPassword = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!isCorrectPassword) return Unauthorized("Invalid Password");

            var email = await userManager.GetEmailAsync(user);
            if (email == null) return BadRequest("No email for user");

            var token = await tokenService.CreateToken(user);

            return new UserDto
            {
                Email = email,
                Token = token,
                NickName = user.NickName
            };
        }
    }
}
