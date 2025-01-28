using System.Text.Json;
using TaskManager.Application.Exceptions;

namespace TaskManager.API.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }
    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        int statusCode = ExceptionStatusCodes.Map.GetValueOrDefault(exception.GetType(), StatusCodes.Status500InternalServerError);
        object response;

        switch (exception)
        {
            case ValidationException validationException:
                response = new { message = validationException.Message, errors = validationException.Errors };
                break;

            default:
                response = new { message = exception.Message };
                break;
    }

    context.Response.StatusCode = statusCode;
    return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
