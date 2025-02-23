using Microsoft.AspNetCore.Mvc;
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

    // GET: api/tasks
    [HttpGet]
    public IActionResult GetTasks()
    {
        var tasks = _context.Tasks.ToList();
        return Ok(tasks);
    }

    // GET: api/tasks/{id}
    [HttpGet("{id}")]
    public IActionResult GetTask(int id)
    {
        var userId = User.FindFirst("id")?.Value;
        var task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.Goal.UserId == userId);
        if (task == null) return NotFound();
        return Ok(task);
    }

    // POST: api/tasks
    [HttpPost]
    public IActionResult CreateTask([FromBody] TaskModel task)
    {
        if (task == null || string.IsNullOrEmpty(task.Title) || task.GoalId <= 0)
        {
            return BadRequest("Task title and valid GoalId are required.");
        }

        var userId = User.FindFirst("id")?.Value;
        var goal = _context.Goals.FirstOrDefault(g => g.Id == task.GoalId && g.UserId == userId);
        if (goal == null)
        {
            return BadRequest("Invalid GoalId or unauthorized.");
        }

        _context.Tasks.Add(task);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    // PUT: api/tasks/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateTask(int id, [FromBody] TaskModel task)
    {
        if (id != task.Id)
        {
            return BadRequest("Task ID mismatch.");
        }

        var existingTask = _context.Tasks.FirstOrDefault(t => t.Id == id);

        if (existingTask == null)
        {
            return NotFound();
        }

        existingTask.Title = task.Title;
        existingTask.IsCompleted = task.IsCompleted;
        existingTask.DueDate = task.DueDate;
        existingTask.GoalId = task.GoalId;

        _context.SaveChanges();
        return NoContent();
    }

    // DELETE: api/tasks/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var task = _context.Tasks.FirstOrDefault(g => g.Id == id);
        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        _context.SaveChanges();
        return NoContent();
    }
}