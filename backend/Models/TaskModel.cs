namespace backend.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
        public int GoalId { get; set; }
        public GoalModel? Goal { get; set; }
        public string Priority { get; set; } = "Medium";
    }
}
