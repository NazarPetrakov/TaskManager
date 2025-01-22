using Microsoft.AspNetCore.Identity;

namespace TaskManager.Domain.Entities;

public class AppUser : IdentityUser<int>
{
    public DateOnly DateOfBirth { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AppTask> Tasks { get; set; } = [];

    public ICollection<AppUserRole> UserRoles { get; set; } = [];

}
