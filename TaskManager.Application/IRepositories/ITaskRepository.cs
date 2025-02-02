using TaskManager.Application.DTOs.Task;
using TaskManager.Application.Helpers.QueryParams;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.IRepositories;

public interface ITaskRepository
{
    Task<List<TaskDto>> GetTasksAsync(TaskQueryParams taskQueryParams);
    Task<AppTask?> GetTaskByIdAsync(int id);
    Task CreateTaskAsync(AppTask task);
    void DeleteTask(AppTask task);
    void UpdateTask(AppTask task);
    Task<bool> SaveChangesAsync();

}
