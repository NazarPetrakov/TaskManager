using System.ComponentModel.DataAnnotations;

namespace TaskManager.Application.DTOs;

public class RegisterDto
{
    [Required]
    [StringLength(32, ErrorMessage = "Your nickname is too long")]
    public required string NickName { get; set; }
    [Required]
    [EmailAddress]
    public required string Email { get; set; }
    [Required]
    public DateOnly DateOfBirth { get; set; }
    [Required]
    [StringLength(16, MinimumLength = 8)]
    public required string Password {get; set;} 
}
