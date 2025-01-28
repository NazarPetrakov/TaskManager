using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.Application.IServices;
using TaskManager.Application.Services;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;

namespace TaskManager.API.Extensions;

public static class ServicesExtension
{
    public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors();
        services.AddDbContext<AppDbContext>(o =>
            o.UseSqlite(configuration.GetConnectionString("DefaultConnection")));
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.AddIdentityCore<AppUser>(o =>
        {
            o.Password.RequireNonAlphanumeric = false;
            o.Password.RequiredLength = 8;
            o.User.RequireUniqueEmail = true;
        })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddEntityFrameworkStores<AppDbContext>();

        services.AddControllers();

        return services;
    }
}
