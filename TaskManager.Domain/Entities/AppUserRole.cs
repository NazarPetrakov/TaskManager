using System;
using Microsoft.AspNetCore.Identity;

namespace TaskManager.Domain.Entities;

public class AppUserRole : IdentityUserRole<int>
{
    public AppUser User { get; set; } = null!;
    public AppRole Role { get; set; } = null!;
}
