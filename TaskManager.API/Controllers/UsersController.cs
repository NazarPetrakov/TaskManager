using Microsoft.AspNetCore.Mvc;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;

namespace TaskManager.API.Controllers
{
    public class UsersController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(context.Users.ToList());
        }
    }
}
