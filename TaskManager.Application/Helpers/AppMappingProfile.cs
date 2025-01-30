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
    }
}
