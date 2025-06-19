namespace TaskManager.Application.DTOs.Task;

public class TaskStatDto
{
    public int ToDoCount { get; set; }
    public int CompleteCount { get; set; }
    public TaskDto[]? UrgentTasks { get; set; }
}
