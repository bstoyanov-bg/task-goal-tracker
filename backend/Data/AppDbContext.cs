using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<GoalModel> Goals { get; set; }
        public DbSet<TaskModel> Tasks { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<GoalModel>()
        //        .HasKey();

        //    modelBuilder.Entity<GoalModel>()
        //        .HasMany(g => g.Tasks)
        //        .WithOne(t => t.Goal)
        //        .HasForeignKey(t => t.GoalId);

        //    modelBuilder.Entity<TaskModel>()
        //        .HasKey();

        //    // Seed initial data (optional)
        //    modelBuilder.Entity<GoalModel>().HasData(
        //        new GoalModel { Id = 1, Title = "Sample Goal", Description = "A test goal" }
        //    );
        //    modelBuilder.Entity<Task>().HasData(
        //        new TaskModel { Id = 1, Title = "Sample Task", IsCompleted = false, GoalId = 1 }
        //    );
        //}
    }
}