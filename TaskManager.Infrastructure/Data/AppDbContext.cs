using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using AppTask = TaskManager.Domain.Entities.AppTask;

namespace TaskManager.Infrastructure.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int>(options)
{
    public DbSet<AppTask> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppRole>()
            .HasMany(p => p.UserRoles)
            .WithOne(ur => ur.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();
        builder.Entity<AppUser>()
            .HasMany(p => p.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();
    }
}
