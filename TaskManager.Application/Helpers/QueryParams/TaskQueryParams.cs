using System;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Helpers.QueryParams;

public class TaskQueryParams
{
    public int? UserId { get; set; }
    public ProgressStatus? Status { get; set; }
    public ProgressStatus? ExcludeStatus { get; set; }
}
