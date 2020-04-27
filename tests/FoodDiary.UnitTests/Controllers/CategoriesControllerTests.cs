﻿using System.Reflection;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using FoodDiary.API;
using FoodDiary.API.Controllers.v1;
using FoodDiary.Domain.Dtos;
using FoodDiary.Domain.Entities;
using FoodDiary.Domain.Services;
using FoodDiary.UnitTests.Customizations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace FoodDiary.UnitTests.Controllers
{
    public class CategoriesControllerTests
    {
        private readonly ILoggerFactory _loggerFactory;

        private readonly IMapper _mapper;

        private readonly Mock<ICategoryService> _categoryServiceMock;

        private readonly IFixture _fixture;

        public CategoriesControllerTests()
        {
            var serviceProvider = new ServiceCollection()
                .AddLogging()
                .AddAutoMapper(Assembly.GetAssembly(typeof(AutoMapperProfile)))
                .BuildServiceProvider();

            _loggerFactory = serviceProvider.GetService<ILoggerFactory>();
            _mapper = serviceProvider.GetService<IMapper>();
            _categoryServiceMock = new Mock<ICategoryService>();
            _fixture = SetupFixture();
        }

        private IFixture SetupFixture()
        {
            var _fixture = new Fixture();
            _fixture.Customize(new FixtureWithCircularReferencesCustomization());
            return _fixture;
        }

        public CategoriesController CategoriesController => new CategoriesController(_loggerFactory, _mapper, _categoryServiceMock.Object);

        [Fact]
        public async void GetCategories_ReturnsRequestedCategories()
        {
            var expectedCategories = _fixture.CreateMany<Category>();
            _categoryServiceMock.Setup(s => s.GetCategoriesAsync(default))
                .ReturnsAsync(expectedCategories);

            var result = await CategoriesController.GetCategories(default);

            _categoryServiceMock.Verify(s => s.GetCategoriesAsync(default), Times.Once);
            result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async void CreateCategory_CreatesCategory_WhenCategoryCanBeCreated()
        {
            var categoryInfo = _fixture.Create<CategoryCreateEditDto>();
            var createdCategory = _fixture.Create<Category>();
            var validationResult = _fixture.Build<ValidationResultDto>()
                .With(r => r.IsValid, true)
                .Create();
            _categoryServiceMock.Setup(s => s.ValidateCategoryAsync(categoryInfo, default))
                .ReturnsAsync(validationResult);
            _categoryServiceMock.Setup(s => s.CreateCategoryAsync(It.IsNotNull<Category>(), default))
                .ReturnsAsync(createdCategory);

            var result = await CategoriesController.CreateCategory(categoryInfo, default);

            _categoryServiceMock.Verify(s => s.ValidateCategoryAsync(categoryInfo, default), Times.Once);
            _categoryServiceMock.Verify(s => s.CreateCategoryAsync(It.IsNotNull<Category>(), default), Times.Once);
            result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async void CreateCategory_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            var categoryInfo = _fixture.Create<CategoryCreateEditDto>();
            var controller = CategoriesController;
            controller.ModelState.AddModelError("error", "error");

            var result = await controller.CreateCategory(categoryInfo, default);

            _categoryServiceMock.Verify(s => s.ValidateCategoryAsync(categoryInfo, default), Times.Never);
            _categoryServiceMock.Verify(s => s.CreateCategoryAsync(It.IsNotNull<Category>(), default), Times.Never);
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void CreateCategory_ReturnsBadRequest_WhenCategoryCannotBeCreated()
        {
            var categoryInfo = _fixture.Create<CategoryCreateEditDto>();
            var validationResult = _fixture.Build<ValidationResultDto>()
                .With(r => r.IsValid, false)
                .Create();
            _categoryServiceMock.Setup(s => s.ValidateCategoryAsync(categoryInfo, default))
                .ReturnsAsync(validationResult);

            var result = await CategoriesController.CreateCategory(categoryInfo, default);

            _categoryServiceMock.Verify(s => s.ValidateCategoryAsync(categoryInfo, default), Times.Once);
            _categoryServiceMock.Verify(s => s.CreateCategoryAsync(It.IsNotNull<Category>(), default), Times.Never);
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void EditCategory_UpdatesCategory_WhenCategoryCanBeUpdated()
        {
            var categoryId = _fixture.Create<int>();
            var categoryInfo = _fixture.Create<CategoryCreateEditDto>();
            var originalCategory = _fixture.Create<Category>();
            var validationResult = _fixture.Build<ValidationResultDto>()
                .With(r => r.IsValid, true)
                .Create();
            _categoryServiceMock.Setup(s => s.GetCategoryByIdAsync(categoryId, default))
                .ReturnsAsync(originalCategory);
            _categoryServiceMock.Setup(s => s.ValidateCategoryAsync(categoryInfo, default))
                .ReturnsAsync(validationResult);
            _categoryServiceMock.Setup(s => s.IsEditedCategoryValid(categoryInfo, originalCategory, validationResult))
                .Returns(true);

            var result = await CategoriesController.EditCategory(categoryId, categoryInfo, default);

            _categoryServiceMock.Verify(s => s.GetCategoryByIdAsync(categoryId, default), Times.Once);
            _categoryServiceMock.Verify(s => s.ValidateCategoryAsync(categoryInfo, default), Times.Once);
            _categoryServiceMock.Verify(s => s.IsEditedCategoryValid(categoryInfo, originalCategory, validationResult), Times.Once);
            _categoryServiceMock.Verify(s => s.EditCategoryAsync(It.IsNotNull<Category>(), default), Times.Once);
            result.Should().BeOfType<OkResult>();
        }

        [Fact]
        public async void EditCategory_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            var categoryId = _fixture.Create<int>();
            var categoryInfo = _fixture.Create<CategoryCreateEditDto>();
            var controller = CategoriesController;
            controller.ModelState.AddModelError("error", "error");

            var result = await controller.EditCategory(categoryId, categoryInfo, default);

            _categoryServiceMock.Verify(s => s.GetCategoryByIdAsync(categoryId, default), Times.Never);
            _categoryServiceMock.Verify(s => s.ValidateCategoryAsync(categoryInfo, default), Times.Never);
            _categoryServiceMock.Verify(s => s.IsEditedCategoryValid(categoryInfo, It.IsAny<Category>(), It.IsAny<ValidationResultDto>()), Times.Never);
            _categoryServiceMock.Verify(s => s.EditCategoryAsync(It.IsNotNull<Category>(), default), Times.Never);
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void EditCategory_ReturnsNotFound_WhenCategoryForUpdateDoesNotExist()
        {
            var categoryId = _fixture.Create<int>();
            var categoryInfo = _fixture.Create<CategoryCreateEditDto>();
            _categoryServiceMock.Setup(s => s.GetCategoryByIdAsync(categoryId, default))
                .ReturnsAsync(null as Category);

            var result = await CategoriesController.EditCategory(categoryId, categoryInfo, default);

            _categoryServiceMock.Verify(s => s.GetCategoryByIdAsync(categoryId, default), Times.Once);
            _categoryServiceMock.Verify(s => s.ValidateCategoryAsync(categoryInfo, default), Times.Never);
            _categoryServiceMock.Verify(s => s.IsEditedCategoryValid(categoryInfo, It.IsAny<Category>(), It.IsAny<ValidationResultDto>()), Times.Never);
            _categoryServiceMock.Verify(s => s.EditCategoryAsync(It.IsNotNull<Category>(), default), Times.Never);
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async void EditCategory_ReturnsBadRequest_WhenCategoryCannotBeUpdated()
        {
            var categoryId = _fixture.Create<int>();
            var categoryInfo = _fixture.Create<CategoryCreateEditDto>();
            var originalCategory = _fixture.Create<Category>();
            var validationResult = _fixture.Build<ValidationResultDto>()
                .With(r => r.IsValid, false)
                .Create();
            _categoryServiceMock.Setup(s => s.GetCategoryByIdAsync(categoryId, default))
                .ReturnsAsync(originalCategory);
            _categoryServiceMock.Setup(s => s.ValidateCategoryAsync(categoryInfo, default))
                .ReturnsAsync(validationResult);
            _categoryServiceMock.Setup(s => s.IsEditedCategoryValid(categoryInfo, originalCategory, validationResult))
                .Returns(false);

            var result = await CategoriesController.EditCategory(categoryId, categoryInfo, default);

            _categoryServiceMock.Verify(s => s.GetCategoryByIdAsync(categoryId, default), Times.Once);
            _categoryServiceMock.Verify(s => s.ValidateCategoryAsync(categoryInfo, default), Times.Once);
            _categoryServiceMock.Verify(s => s.IsEditedCategoryValid(categoryInfo, originalCategory, validationResult), Times.Once);
            _categoryServiceMock.Verify(s => s.EditCategoryAsync(It.IsNotNull<Category>(), default), Times.Never);
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async void DeleteCategory_DeletesCategory_WhenCategoryForDeleteExists()
        {
            var categoryForDelete = _fixture.Create<Category>();
            _categoryServiceMock.Setup(s => s.GetCategoryByIdAsync(categoryForDelete.Id, default))
                .ReturnsAsync(categoryForDelete);

            var result = await CategoriesController.DeleteCategory(categoryForDelete.Id, default);

            _categoryServiceMock.Verify(s => s.GetCategoryByIdAsync(categoryForDelete.Id, default), Times.Once);
            _categoryServiceMock.Verify(s => s.DeleteCategoryAsync(categoryForDelete, default), Times.Once);
            result.Should().BeOfType<OkResult>();
        }

        [Fact]
        public async void DeleteCategory_ReturnsNotFound_WhenCategoryForDeleteDoesNotExist()
        {
            var categoryForDeleteId = _fixture.Create<int>();
            _categoryServiceMock.Setup(s => s.GetCategoryByIdAsync(categoryForDeleteId, default))
                .ReturnsAsync(null as Category);

            var result = await CategoriesController.DeleteCategory(categoryForDeleteId, default);

            _categoryServiceMock.Verify(s => s.GetCategoryByIdAsync(categoryForDeleteId, default), Times.Once);
            _categoryServiceMock.Verify(s => s.DeleteCategoryAsync(It.IsAny<Category>(), default), Times.Never);
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async void GetCategoriesDropdown_ReturnsRequestedCategories()
        {
            var request = _fixture.Create<CategoryDropdownSearchRequest>();
            var expectedCategories = _fixture.CreateMany<Category>();
            _categoryServiceMock.Setup(s => s.GetCategoriesDropdownAsync(request, default))
                .ReturnsAsync(expectedCategories);

            var result = await CategoriesController.GetCategoriesDropdown(request, default);

            _categoryServiceMock.Verify(s => s.GetCategoriesDropdownAsync(request, default), Times.Once);
            result.Should().BeOfType<OkObjectResult>();
        }
    }
}
