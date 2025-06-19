using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.Extensions;
using TaskManager.Application.DTOs.Task;
using TaskManager.Application.Helpers.QueryParams;
using TaskManager.Application.IServices;
using TaskManager.Domain.Entities;

namespace TaskManager.API.Controllers;

[Authorize]
public class TasksController(ITaskService taskService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetTasks(
        [FromQuery] TaskQueryParams taskQueryParams)
    {
        var pagedTaskList = await taskService.GetTasksAsync(taskQueryParams);

        Response.AddPaginationHeader(pagedTaskList);

        return Ok(pagedTaskList);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTaskById(int id) =>
        await taskService.GetTaskByIdAsync(id);

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto task) =>
        await taskService.CreateTaskAsync(task, User);

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        await taskService.DeleteTaskAsync(id);
        return Ok();
    }
    [HttpPatch("{id}")]
    public async Task<ActionResult> PatchTask(int id, [FromBody] JsonPatchDocument<AppTask> doc)
    {
        await taskService.PatchTaskAsync(id, doc);
        return Ok();
    }
    [HttpGet("stats")]
    public async Task<ActionResult> GetTaskStats()
    {
        var stats = await taskService.GetTaskStatistics(User);
        return Ok(stats);
    }

}
