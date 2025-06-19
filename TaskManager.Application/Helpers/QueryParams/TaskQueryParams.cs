using System;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Helpers.QueryParams;

public class TaskQueryParams : PaginationQueryParams
{
    public int? UserId { get; set; }
    public ProgressStatus? Status { get; set; }
    public ProgressStatus? ExcludeStatus { get; set; }
    public string OrderBy { get; set; } = "createdAt_desc";
}
