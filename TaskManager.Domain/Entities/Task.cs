using TaskManager.Domain.Enums;

namespace TaskManager.Domain.Entities;

public class AppTask
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public required string Description { get; set; }
    public ProgressStatus Status { get; set; } = ProgressStatus.NotStarted;
    public PriorityLevel Priority { get; set; } = PriorityLevel.Low;
    public DateTime? DeadLine { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;

}
