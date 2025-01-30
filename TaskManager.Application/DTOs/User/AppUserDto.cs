namespace TaskManager.Application.DTOs;

public class AppUserDto
{
    public int Id { get; set; }
    public string? Email { get; set; }
    public string? NickName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
