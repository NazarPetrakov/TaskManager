using System.Security.Claims;
using Microsoft.AspNetCore.JsonPatch;
using TaskManager.Application.DTOs.Task;
using TaskManager.Application.Helpers.Pagination;
using TaskManager.Application.Helpers.QueryParams;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.IServices;

public interface ITaskService
{
    Task<PagedList<TaskDto>> GetTasksAsync(TaskQueryParams taskQueryParams);
    Task<TaskDto> GetTaskByIdAsync(int id);
    Task<TaskDto> CreateTaskAsync(CreateTaskDto createTask, ClaimsPrincipal claimsPrincipalUser);
    Task DeleteTaskAsync(int taskId);
    Task PatchTaskAsync(int taskId, JsonPatchDocument<AppTask> doc);
    Task<TaskStatDto> GetTaskStatistics(ClaimsPrincipal user);
}
