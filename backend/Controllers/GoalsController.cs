using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        var userId = User.Claims
            .Where(c => c.Type == ClaimTypes.NameIdentifier)
            .LastOrDefault(c => Guid.TryParse(c.Value, out _))?.Value;
        var goals = _context.Goals.Where(g => g.UserId == userId).ToList();
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
}