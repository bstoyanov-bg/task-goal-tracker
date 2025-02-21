namespace backend.Models
{
    public class GoalModel
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public List<TaskModel> Tasks { get; set; } = new();
        public string? UserId { get; set; }
    }
}
