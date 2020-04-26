﻿using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FoodDiary.Domain.Dtos;
using FoodDiary.Domain.Entities;
using FoodDiary.Domain.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;

namespace FoodDiary.API.Controllers.v1
{
    [ApiController]
    [Route("v1/notes")]
    [ApiExplorerSettings(GroupName = "v1")]
    public class NotesController : ControllerBase
    {
        private readonly ILogger<NotesController> _logger;
        private readonly IMapper _mapper;
        private readonly INoteService _noteService;

        public NotesController(
            ILoggerFactory loggerFactory,
            IMapper mapper,
            INoteService noteService)
        {
            _logger = loggerFactory?.CreateLogger<NotesController>() ?? throw new ArgumentNullException(nameof(loggerFactory));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _noteService = noteService ?? throw new ArgumentNullException(nameof(noteService));
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<NoteItemDto>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetNotes([FromQuery] NotesSearchRequestDto request, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noteEntities = await _noteService.SearchNotesAsync(request, cancellationToken);
            var notesListResponse = _mapper.Map<List<NoteItemDto>>(noteEntities);
            return Ok(notesListResponse);
        }

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> CreateNote([FromBody] NoteCreateEditDto newNote, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noteValidationResult = await _noteService.ValidateNoteDataAsync(newNote, cancellationToken);
            if (!noteValidationResult.IsValid)
            {
                ModelState.AddModelError(noteValidationResult.ErrorKey, noteValidationResult.ErrorMessage);
                return BadRequest(ModelState);
            }

            var note = _mapper.Map<Note>(newNote);

            await _noteService.CreateNoteAsync(note, cancellationToken);
            return Ok();
        }

        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> EditNote([FromRoute] int id, [FromBody] NoteCreateEditDto updatedNote, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noteValidationResult = await _noteService.ValidateNoteDataAsync(updatedNote, cancellationToken);
            if (!noteValidationResult.IsValid)
            {
                ModelState.AddModelError(noteValidationResult.ErrorKey, noteValidationResult.ErrorMessage);
                return BadRequest(ModelState);
            }

            var originalNote = await _noteService.GetNoteByIdAsync(id, cancellationToken);
            if (originalNote == null)
            {
                return NotFound();
            }

            originalNote = _mapper.Map(updatedNote, originalNote);
            await _noteService.EditNoteAsync(originalNote, cancellationToken);
            return Ok();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> DeleteNote([FromRoute] int id, CancellationToken cancellationToken)
        {
            var noteForDelete = await _noteService.GetNoteByIdAsync(id, cancellationToken);
            if (noteForDelete == null)
            {
                return NotFound();
            }

            await _noteService.DeleteNoteAsync(noteForDelete, cancellationToken);
            return Ok();
        }

        [HttpDelete("batch")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> DeleteNotes([FromBody] IEnumerable<int> ids, CancellationToken cancellationToken)
        {
            var notesForDelete = await _noteService.GetNotesByIdsAsync(ids, cancellationToken);
            if (!_noteService.AllNotesFetched(ids, notesForDelete))
            {
                ModelState.AddModelError(String.Empty, "Unable to delete target notes: wrong ids specified");
                return BadRequest(ModelState);
            }

            await _noteService.DeleteNotesAsync(notesForDelete, cancellationToken);
            return Ok();
        }

        [HttpPut("move")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ModelStateDictionary), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> MoveNote([FromBody] NoteMoveRequestDto moveRequest, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var noteForMove = await _noteService.GetNoteByIdAsync(moveRequest.NoteId, cancellationToken);
            if (noteForMove == null)
            {
                return NotFound();
            }

            if (!await _noteService.NoteCanBeMovedAsync(noteForMove, moveRequest, cancellationToken))
            {
                ModelState.AddModelError(String.Empty, "Note cannot be moved on target meal group to the specified position");
                return BadRequest(ModelState);
            }

            await _noteService.MoveNoteAsync(noteForMove, moveRequest, cancellationToken);
            return Ok();
        }
    }
}