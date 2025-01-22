using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using Task = System.Threading.Tasks.Task;

namespace TaskManager.Infrastructure.Data;

public static class Seed
{
    public static async Task SeedUsersAsync(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        if(await userManager.Users.AnyAsync()) return;

        var file = await File.ReadAllTextAsync("..\\TaskManager.Infrastructure\\Data\\UsersData");

        var options = new JsonSerializerOptions {PropertyNameCaseInsensitive = true};

        var users = JsonSerializer.Deserialize<List<AppUser>>(file, options);

        if(users == null) return ;

        var roles = new List<AppRole> 
        {
            new() {Name = "User"},
            new() {Name = "Admin"},
        };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }

        foreach (var user in users)
        {
            await userManager.CreateAsync(user, "Password1234");
            await userManager.AddToRoleAsync(user, "User");
        }
    }
}
