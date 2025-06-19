using System;
using Microsoft.AspNetCore.Identity;

namespace TaskManager.Domain.Entities;

public class AppRole : IdentityRole<int>
{
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
}
