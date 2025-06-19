namespace TaskManager.Domain.Entities;

public class TaskStat
{
    public int ToDoCount { get; set; }
    public int CompleteCount { get; set;}
    public AppTask[]? UrgentTasks { get; set; }
}
