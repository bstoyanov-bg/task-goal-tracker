using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoalsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetGoals()
    {
        // Temporary mock data; replace with DB later
        var goals = new List<GoalModel> { new GoalModel { Id = 1, Title = "Learn Angular", Description = "Master the framework" } };
        return Ok(goals);
    }
}