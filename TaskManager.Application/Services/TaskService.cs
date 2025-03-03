using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using TaskManager.Application.DTOs.Task;
using TaskManager.Application.Exceptions;
using TaskManager.Application.Extensions;
using TaskManager.Application.Helpers.Pagination;
using TaskManager.Application.Helpers.QueryParams;
using TaskManager.Application.IRepositories;
using TaskManager.Application.IServices;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class TaskService(ITaskRepository taskRepository,
    IMapper mapper, UserManager<AppUser> userManager) : ITaskService
{
    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTask,
        ClaimsPrincipal claimsPrincipalUser)
    {
        var task = mapper.Map<AppTask>(createTask);
        var currentUserId = claimsPrincipalUser.GetUserId();
        var user = await userManager.FindByIdAsync(currentUserId) ??
            throw new KeyNotFoundException("User not found");

        task.UserId = int.Parse(currentUserId);
        task.User = user;

        await taskRepository.CreateTaskAsync(task);

        if (!await taskRepository.SaveChangesAsync())
            throw new DatabaseSaveException("Failed to save the task");

        return mapper.Map<TaskDto>(task);
    }

    public async Task DeleteTaskAsync(int taskId)
    {
        var task = await taskRepository.GetTaskByIdAsync(taskId)
            ?? throw new KeyNotFoundException("Task not found");

        taskRepository.DeleteTask(task);

        if (!await taskRepository.SaveChangesAsync())
            throw new DatabaseSaveException("Failed to save the task");
    }
    public async Task PatchTaskAsync(int taskId, JsonPatchDocument<AppTask> doc)
    {
        var task = await taskRepository.GetTaskByIdAsync(taskId)
            ?? throw new KeyNotFoundException("Task not found");

        doc.ApplyTo(task);

        taskRepository.UpdateTask(task);

        if (!await taskRepository.SaveChangesAsync())
            throw new DatabaseSaveException("Failed to save the task");
    }

    public async Task<TaskDto> GetTaskByIdAsync(int id)
    {
        var task = await taskRepository.GetTaskByIdAsync(id)
            ?? throw new KeyNotFoundException("Task not found");

        return mapper.Map<TaskDto>(task);

    }
    public async Task<PagedList<TaskDto>> GetTasksAsync(TaskQueryParams taskQueryParams)
    {
        var pagedTasks = await taskRepository.GetTasksAsync(taskQueryParams);

        var taskDtos = mapper.Map<List<TaskDto>>(pagedTasks);

        return new PagedList<TaskDto>
        (
            taskDtos,
            pagedTasks.TotalCount,
            pagedTasks.CurrentPage,
            pagedTasks.PageSize
        );
    }

    public async Task<TaskStatDto> GetTaskStatistics(ClaimsPrincipal user)
    {
        var id = int.Parse(user.GetUserId());
        var stats = await taskRepository.GetTaskStatsAsync(id);
        return mapper.Map<TaskStatDto>(stats);
    }
}
