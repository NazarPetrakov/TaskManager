using Microsoft.AspNetCore.Http;

namespace TaskManager.Application.Exceptions;

public static class ExceptionStatusCodes
{
    public static readonly Dictionary<Type, int> Map = new()
    {
        { typeof(ValidationException), StatusCodes.Status400BadRequest },
        { typeof(ArgumentException), StatusCodes.Status400BadRequest },
        { typeof(UnauthorizedAccessException), StatusCodes.Status401Unauthorized },
        { typeof(KeyNotFoundException), StatusCodes.Status404NotFound }
    };
}
