using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using TaskManager.Application.Exceptions;
using TaskManager.Application.IRepositories;
using TaskManager.Application.IServices;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class UserService(UserManager<AppUser> userManager, IUserRepository userRepository) : IUserService
{
    public async Task PatchUserAsync(string userId, JsonPatchDocument<AppUser> doc)
    {
        var user = await userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found");

        doc.ApplyTo(user);

        userRepository.UpdateUser(user);

        if (!await userRepository.SaveChangesAsync())
            throw new DatabaseSaveException("Failed to save the user");
    }
}
