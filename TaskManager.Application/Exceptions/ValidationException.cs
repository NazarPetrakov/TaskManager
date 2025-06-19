using Microsoft.AspNetCore.Identity;

namespace TaskManager.Application.Exceptions;

public class ValidationException : Exception
{
    public IEnumerable<IdentityError> Errors { get; }

    public ValidationException(string message, IEnumerable<IdentityError> errors) 
        : base(message)
    {
        Errors = errors;
    }
}
