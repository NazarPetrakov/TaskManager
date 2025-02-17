using System;

namespace TaskManager.Application.Helpers.QueryParams;

public abstract class PaginationQueryParams
{
    const int maxPageSize = 50;
    private int _pageSize = 10;
    public int PageNumber { get; set; } = 1;
    public int PageSize
    {
        get { return _pageSize; }
        set
        {
            if (value > maxPageSize) _pageSize = maxPageSize;
            _pageSize = value;
        }
    }
}
