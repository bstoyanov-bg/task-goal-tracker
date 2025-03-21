import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GoalService } from '../goal.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskService } from '../../tasks/task.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Goal } from '../../Models/Goal';
import { Subscription } from 'rxjs';
import { Task } from '../../Models/Task';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FormsModule,
    MatToolbarModule,
    MatProgressBarModule
  ],
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit, OnDestroy {
  goals: Goal[] = [];
  error: string | null = null;
  newGoalTitle: string = '';
  newGoalDescription: string = '';
  selectedGoal: any = null;
  newTaskTitle: string = '';
  userEmail: string | null = null;

  subUpdateTask: Subscription | null = null;

  constructor(
    private goalService: GoalService, 
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.loadGoals();
  }

  ngOnDestroy(): void {
      if (this.subUpdateTask) {
        this.subUpdateTask.unsubscribe();
      }
  }

  loadGoals(): void {
    this.goalService.getGoals().subscribe({
      next: (goals) => {
        this.goals = goals;
      },
      error: (err) => this.error = 'Could not load goals: ' + err.message
    });
  }

  createGoal(): void {
    if (!this.newGoalTitle.trim()) {
      this.error = 'Goal title is required.';
      return;
    }
    const goal = { id: 0, title: this.newGoalTitle, description: this.newGoalDescription, tasks: [] };
    this.goalService.createGoal(goal).subscribe({
      next: (newGoal) => {
        this.goals.push(newGoal);
        this.newGoalTitle = '';
        this.newGoalDescription = '';
        this.error = null;
      },
      error: (err) => this.error = 'Failed to create goal: ' + err.message
    });
  }

  selectGoal(goal: Goal): void {
    this.selectedGoal = { ...goal };
  }

  updateGoal(): void {
    if (!this.selectedGoal || !this.selectedGoal.title.trim()) {
      this.error = 'Goal title is required.';
      return;
    }
    this.goalService.updateGoal(this.selectedGoal).subscribe({
      next: () => {
        const index = this.goals.findIndex(g => g.id === this.selectedGoal.id);
        this.goals[index] = { ...this.selectedGoal };
        this.selectedGoal = null;
        this.error = null;
      },
      error: (err) => this.error = 'Failed to update goal: ' + err.message
    });
  }

  deleteGoal(id: number): void {
    this.goalService.deleteGoal(id).subscribe({
      next: () => {
        this.goals = this.goals.filter(g => g.id !== id);
        if (this.selectedGoal?.id === id) this.selectedGoal = null;
        this.error = null;
      },
      error: (err) => this.error = 'Failed to delete goal: ' + err.message
    });
  }

  createTask(): void {
    if (!this.selectedGoal || !this.newTaskTitle.trim()) {
      this.error = 'Select a goal and enter a task title.';
      return;
    }
    const task = {
      id: 0,
      title: this.newTaskTitle,
      isCompleted: false,
      dueDate: new Date(),
      goalId: this.selectedGoal.id
    };
    this.taskService.createTask(task).subscribe({
      next: (newTask) => {
        if (!this.selectedGoal.tasks) this.selectedGoal.tasks = [];
        this.selectedGoal.tasks.push(newTask);
        this.newTaskTitle = '';
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to create task: ' + err.message;
      }
    });
  }

  toggleTaskCompletion(task: Task): void {
    // Toggle explicitly
    task.isCompleted = !task.isCompleted;
  
    const taskIndex = this.selectedGoal.tasks.findIndex((t: Task) => t.id === task.id);
    if (taskIndex !== -1) {
      this.selectedGoal.tasks[taskIndex] = { ...task }; // Update with toggled state
      this.selectedGoal = { ...this.selectedGoal, tasks: [...this.selectedGoal.tasks] }; // New reference
      this.cdr.detectChanges();
    }
  
    this.taskService.updateTask(task).subscribe({
      next: () => {
        this.cdr.detectChanges();
      },
      error: (err) => {
        task.isCompleted = !task.isCompleted; // Rollback
        const rollbackIndex = this.selectedGoal.tasks.findIndex((t: Task) => t.id === task.id);
        if (rollbackIndex !== -1) {
          this.selectedGoal.tasks[rollbackIndex] = { ...task };
          this.selectedGoal = { ...this.selectedGoal, tasks: [...this.selectedGoal.tasks] };
        }
        this.error = 'Failed to update task: ' + err.message;
        this.cdr.detectChanges();
      }
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        if (this.selectedGoal && this.selectedGoal.tasks) {
          this.selectedGoal.tasks = this.selectedGoal.tasks.filter((t: { id: number; }) => t.id !== id);
        }
      },
      error: (err) => this.error = 'Failed to delete task: ' + err.message
    });
  }

  getProgress(goal: Goal): number {
    if (!goal.tasks || goal.tasks.length === 0) return 0;
    const completed = goal.tasks.filter((t: { isCompleted: boolean; }) => t.isCompleted).length;
    return (completed / goal.tasks.length) * 100;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}