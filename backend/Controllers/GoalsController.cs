using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

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

    // GET: api/goals
    [HttpGet]
    public IActionResult GetGoals()
    {
        var goals = _context.Goals.ToList();
        return Ok(goals);
    }

    // POST: api/goals
    [HttpPost]
    public IActionResult CreateGoal([FromBody] GoalModel goal)
    {
        if (goal == null || string.IsNullOrEmpty(goal.Title))
        {
            return BadRequest("Goal title is required.");
        }

        _context.Goals.Add(goal);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetGoals), new { id = goal.Id }, goal);
    }
}