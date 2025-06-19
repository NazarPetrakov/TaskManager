
using System.ComponentModel.DataAnnotations;

namespace TaskManager.Application.DTOs.User;

public class ChangeEmailDto
{
    [Required]
    [EmailAddress]
    public required string NewEmail { get; set; }
}
