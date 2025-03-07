using System;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.IRepositories;

public interface IUserRepository
{
    void UpdateUser(AppUser user);
    Task<bool> SaveChangesAsync();

}
