﻿using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetTasks()
    {
        var tasks = _context.Tasks.ToList();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public IActionResult GetTask(int id)
    {
        var userId = User.FindFirst("id")?.Value;
        var task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.Goal.UserId == userId);
        if (task == null) return NotFound();
        return Ok(task);
    }

    [HttpPost]
    public IActionResult CreateTask([FromBody] TaskModel task)
    {
        if (string.IsNullOrEmpty(task.Title))
        {
            return BadRequest("Task title is required.");
        }

        var userId = User.FindFirst("id")?.Value;
        var goal = _context.Goals.FirstOrDefault(g => g.Id == task.GoalId && g.UserId == userId);

        if (goal == null)
        {
            //var allGoals = _context.Goals.Where(g => g.UserId == userId).ToList();
            return BadRequest("Invalid GoalId or unauthorized.");
        }

        _context.Tasks.Add(task);
        _context.SaveChanges();
        return StatusCode(201, new { task.Id, task.Title, task.IsCompleted, task.GoalId, task.DueDate });
    }

    [HttpPut("{id}")]
    public IActionResult UpdateTask(int id, [FromBody] TaskModel task)
    {
        if (id != task.Id)
        {
            return BadRequest("Task ID mismatch.");
        }
        var userId = User.FindFirst("id")?.Value;
        var existingTask = _context.Tasks.FirstOrDefault(t => t.Id == id && t.Goal.UserId == userId);

        if (existingTask == null)
        {
            return NotFound();
        }

        existingTask.Title = task.Title;
        existingTask.IsCompleted = task.IsCompleted;
        existingTask.DueDate = task.DueDate;
        existingTask.GoalId = task.GoalId;
        existingTask.DueDate = task.DueDate;

        _context.SaveChanges();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var userId = User.FindFirst("id")?.Value;
        var task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.Goal.UserId == userId);
        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        _context.SaveChanges();
        return NoContent();
    }
}