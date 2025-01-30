using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TaskManager.Application.DTOs.Task;
using TaskManager.Application.Helpers.QueryParams;
using TaskManager.Application.IRepositories;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;

namespace TaskManager.Infrastructure.Repositories;

public class TaskRepository(AppDbContext context, IMapper mapper) : ITaskRepository
{
    public async Task CreateTaskAsync(AppTask task)
    {
        await context.Tasks.AddAsync(task);
    }

    public void DeleteTask(AppTask task)
    {
        context.Tasks.Remove(task);
    }
    public async Task<AppTask?> GetTaskByIdAsync(int id)
    {
        return await context.Tasks.FirstOrDefaultAsync(td => td.Id == id);
    }

    public async Task<List<TaskDto>> GetTasksAsync(TaskQueryParams taskQueryParams)
    {
        var query = context.Tasks.ProjectTo<TaskDto>(mapper.ConfigurationProvider);

        if (taskQueryParams.UserId.HasValue)
        {
            query = query.Where(td => td.UserId == taskQueryParams.UserId.Value);
        }

        return await query.ToListAsync();
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
