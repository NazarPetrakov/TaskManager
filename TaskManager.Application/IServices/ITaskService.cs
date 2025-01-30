using System.Security.Claims;
using TaskManager.Application.DTOs.Task;
using TaskManager.Application.Helpers.QueryParams;

namespace TaskManager.Application.IServices;

public interface ITaskService
{
    Task<List<TaskDto>> GetTasksAsync(TaskQueryParams taskQueryParams);
    Task<TaskDto> GetTaskByIdAsync(int id);
    Task<TaskDto> CreateTaskAsync(CreateTaskDto createTask, ClaimsPrincipal claimsPrincipalUser);
    Task DeleteTask(int taskId);
}
