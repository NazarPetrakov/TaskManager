using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Infrastructure.Data;

namespace TaskManager.API.Controllers
{
    [Authorize]
    public class UsersController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            return Ok(await context.Users.ToListAsync());
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            return Ok(await context.Users.FindAsync(id));
        }
    }
}
