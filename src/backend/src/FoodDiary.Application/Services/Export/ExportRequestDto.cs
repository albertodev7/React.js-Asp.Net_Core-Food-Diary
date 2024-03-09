using System;
using JetBrains.Annotations;

namespace FoodDiary.Application.Services.Export;

[PublicAPI]
public class ExportRequestDto
{
    public required DateOnly StartDate { get; init; }
    public required DateOnly EndDate { get; init; }
}