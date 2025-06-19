using System;
using AutoMapper;
using TaskManager.Application.DTOs;
using TaskManager.Application.DTOs.Task;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Helpers;

public class AppMappingProfile : Profile
{
    public AppMappingProfile()
    {
        CreateMap<RegisterDto, AppUser>();
        CreateMap<AppUser, AppUserDto>();
        CreateMap<AppTask, TaskDto>();
        CreateMap<CreateTaskDto, AppTask>();
        CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>()
            .ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
        CreateMap<TaskStat, TaskStatDto>();
    }
}
