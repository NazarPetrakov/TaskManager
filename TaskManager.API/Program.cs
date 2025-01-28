using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Extensions;
using TaskManager.API.Middlewares;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container

builder.Services.AddServices(configuration);
builder.Services.AddAuth(configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200"));

app.UseAuthorization();
app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    var logger = services.GetRequiredService<ILogger<Program>>();

    await context.Database.MigrateAsync();
    await Seed.SeedUsersAsync(userManager, roleManager, logger);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
    throw;
}

app.Run();
