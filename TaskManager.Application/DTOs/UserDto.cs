namespace TaskManager.Application.DTOs;

public class UserDto
{
    public required string Email { get; set; }
    public required string Token { get; set; }
    public string? NickName { get; set; }

}
