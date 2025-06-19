using Microsoft.AspNetCore.JsonPatch;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.IServices;

public interface IUserService
{
    Task PatchUserAsync(string userId, JsonPatchDocument<AppUser> doc);
}
