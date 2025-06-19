using System;
using System.ComponentModel.DataAnnotations;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.DTOs.Task;

public class CreateTaskDto
{
    public string? Title { get; set; }
    [Required]
    public required string Description { get; set; }
    [Range(0,3, ErrorMessage = "Invalid Priority level")]
    public PriorityLevel Priority { get; set; } = PriorityLevel.Low;
    public DateTime? DeadLine { get; set; }
}
