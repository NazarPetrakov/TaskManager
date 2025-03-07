using System;
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Application.DTOs.User;

public class ChangePasswordDto
{
    [Required]
    [StringLength(16, MinimumLength = 8)]
    public required string CurrentPassword { get; set; }
    [Required]
    [StringLength(16, MinimumLength = 8)]
    public required string NewPassword { get; set; }
}
