using System;
using System.Security.Claims;

namespace TaskManager.Application.Extensions;

public static class ClaimsPrincipalExtension
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        var id = user.FindFirstValue(ClaimTypes.NameIdentifier
            ?? throw new Exception("Cannot get id from token"));
        return id!;
    }
}
