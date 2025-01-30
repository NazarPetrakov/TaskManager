using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs.Task;
using TaskManager.Application.Helpers.QueryParams;
using TaskManager.Application.IServices;

namespace TaskManager.API.Controllers;

[Authorize]
public class TasksController(ITaskService taskService) : BaseApiController
{
    //admin
    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetTasks(
        [FromQuery] TaskQueryParams taskQueryParams) =>
            await taskService.GetTasksAsync(taskQueryParams);

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTaskById(int id) =>
        await taskService.GetTaskByIdAsync(id);

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto task) =>
        await taskService.CreateTaskAsync(task, User);
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id) 
    {
        await taskService.DeleteTask(id);
        return Ok();
    }
        
}
