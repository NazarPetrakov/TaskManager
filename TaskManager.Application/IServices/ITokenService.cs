using TaskManager.Domain.Entities;

namespace TaskManager.Application.IServices;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}
