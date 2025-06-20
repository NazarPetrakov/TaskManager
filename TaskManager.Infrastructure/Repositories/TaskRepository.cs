using Microsoft.EntityFrameworkCore;
using TaskManager.Application.Helpers.Pagination;
using TaskManager.Application.Helpers.QueryParams;
using TaskManager.Application.IRepositories;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Infrastructure.Data;

namespace TaskManager.Infrastructure.Repositories;

public class TaskRepository(AppDbContext context) : ITaskRepository
{
    public async Task CreateTaskAsync(AppTask task)
    {
        await context.Tasks.AddAsync(task);
    }
    public void DeleteTask(AppTask task)
    {
        context.Tasks.Remove(task);
    }
    public void UpdateTask(AppTask task)
    {
        context.Entry(task).State = EntityState.Modified;
    }
    public async Task<AppTask?> GetTaskByIdAsync(int id)
    {
        return await context.Tasks.FirstOrDefaultAsync(td => td.Id == id);
    }
    public async Task<PagedList<AppTask>> GetTasksAsync(TaskQueryParams taskQueryParams)
    {
        var query = context.Tasks.AsNoTracking();

        if (taskQueryParams.UserId.HasValue)
            query = query.Where(td => td.UserId == taskQueryParams.UserId.Value);

        if (taskQueryParams.Status.HasValue)
            query = query.Where(td => td.Status == taskQueryParams.Status.Value);

        if (taskQueryParams.ExcludeStatus.HasValue)
            query = query.Where(td => td.Status != taskQueryParams.ExcludeStatus.Value);

        if (!string.IsNullOrEmpty(taskQueryParams.OrderBy))
        {
            query = taskQueryParams.OrderBy.ToLower() switch
            {
                "createdat_desc" => query.OrderByDescending(x => x.CreatedAt),
                "createdat" or "createdat_asc" => query.OrderBy(x => x.CreatedAt),
                "deadline_desc" => query.OrderByDescending(x => x.DeadLine),
                "deadline" or "deadline_asc" => query.OrderBy(x => x.DeadLine == null)
                    .ThenBy(x => x.DeadLine),
                "priority_desc" => query.OrderByDescending(x => x.Priority),
                "priority" or "priority_asc" => query.OrderBy(x => x.Priority),
                _ => query.OrderBy(x => x.CreatedAt)
            };
        }

        return await PagedList<AppTask>.PaginateAsync(query,
            taskQueryParams.PageNumber, taskQueryParams.PageSize);
    }
    public async Task<TaskStat> GetTaskStatsAsync(int userId)
    {
        var toDoCount = await context.Tasks.CountAsync(t => t.UserId == userId && t.Status != ProgressStatus.Done);
        var completeCount = await context.Tasks.CountAsync(t => t.UserId == userId && t.Status == ProgressStatus.Done);
        var urgentTasks = await context.Tasks
            .Where(t => t.UserId == userId && t.DeadLine != null
                && t.DeadLine <= DateTime.UtcNow.AddDays(1)
                && t.DeadLine >= DateTime.UtcNow)
            .OrderBy(t => t.DeadLine)
            .ToArrayAsync();

        return new TaskStat
        {
            ToDoCount = toDoCount,
            CompleteCount = completeCount,
            UrgentTasks = urgentTasks
        };
    }
    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
