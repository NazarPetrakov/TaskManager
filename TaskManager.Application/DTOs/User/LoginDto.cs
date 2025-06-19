using System.ComponentModel.DataAnnotations;

namespace TaskManager.Application.DTOs;

public class LoginDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
    [Required]
    [StringLength(16, MinimumLength = 8)]
    public required string Password {get; set;} 
}
