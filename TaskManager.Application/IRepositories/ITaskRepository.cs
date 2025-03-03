using TaskManager.Application.Helpers.Pagination;
using TaskManager.Application.Helpers.QueryParams;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.IRepositories;

public interface ITaskRepository
{
    Task<PagedList<AppTask>> GetTasksAsync(TaskQueryParams taskQueryParams);
    Task<AppTask?> GetTaskByIdAsync(int id);
    Task CreateTaskAsync(AppTask task);
    void DeleteTask(AppTask task);
    void UpdateTask(AppTask task);
    Task<TaskStat> GetTaskStatsAsync(int userId);
    Task<bool> SaveChangesAsync();

}
