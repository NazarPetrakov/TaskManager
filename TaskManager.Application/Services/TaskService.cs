using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TaskManager.Application.DTOs.Task;
using TaskManager.Application.Exceptions;
using TaskManager.Application.Extensions;
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

    public async Task DeleteTask(int taskId)
    {
        var task = await taskRepository.GetTaskByIdAsync(taskId)
            ?? throw new KeyNotFoundException("Task not found");
        
        taskRepository.DeleteTask(task);

        if (!await taskRepository.SaveChangesAsync())
            throw new DatabaseSaveException("Failed to save the task");
    }

    public async Task<TaskDto> GetTaskByIdAsync(int id)
    {
        var task = await taskRepository.GetTaskByIdAsync(id) 
            ?? throw new KeyNotFoundException("Task not found");

        return mapper.Map<TaskDto>(task);
        
    }

    public async Task<List<TaskDto>> GetTasksAsync(TaskQueryParams taskQueryParams)
    {
        return await taskRepository.GetTasksAsync(taskQueryParams);
    }
}
