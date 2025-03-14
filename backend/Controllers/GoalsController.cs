using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GoalsController : ControllerBase
{
    private readonly AppDbContext _context;

    public GoalsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetGoals()
    {
        var userId = User.FindFirst("id")?.Value;
        var goals = _context.Goals
            .Where(g => g.UserId == userId)
            .Include(g => g.Tasks)
            .ToList();
        return Ok(goals);
    }

    [HttpPost]
    public IActionResult CreateGoal([FromBody] GoalModel goal)
    {
        if (string.IsNullOrEmpty(goal.Title))
        {
            return BadRequest("Goal title is required.");
        }
        var userId = User.FindFirst("id")?.Value;
        Console.WriteLine($"UserId from custom id claim: {userId}");
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User not authenticated or no user ID found.");
        }
        goal.UserId = userId;
        _context.Goals.Add(goal);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetGoals), new { id = goal.Id }, goal);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateGoal(int id, [FromBody] GoalModel goal)
    {
        if (id != goal.Id)
        {
            return BadRequest("ID mismatch.");
        }

        var userId = User.FindFirst("id")?.Value;
        var existingGoal = _context.Goals.FirstOrDefault(g => g.Id == id && g.UserId == userId);

        if (existingGoal == null)
        {
            return NotFound();
        }

        existingGoal.Title = goal.Title;
        existingGoal.Description = goal.Description;
        _context.SaveChanges();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteGoal(int id)
    {
        var userId = User.FindFirst("id")?.Value;
        var goal = _context.Goals.FirstOrDefault(g => g.Id == id && g.UserId == userId);
        if (goal == null)
        {
            return NotFound();
        }

        _context.Goals.Remove(goal);
        _context.SaveChanges();
        return NoContent();
    }
}