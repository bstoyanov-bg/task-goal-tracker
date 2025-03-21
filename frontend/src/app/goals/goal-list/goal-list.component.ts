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
import { GoalDetailComponent } from '../goal-detail/goal-detail.component';

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
    MatProgressBarModule,
    GoalDetailComponent
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

  selectGoal(goal: any): void {
    this.selectedGoal = { ...goal };
    this.cdr.detectChanges();
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

  updateGoal(goal: any): void {
    this.goalService.updateGoal(goal).subscribe({
      next: () => this.loadGoals(),
      error: (err) => this.error = 'Failed to update goal: ' + err.message
    });
  }

  deleteGoal(id: number): void {
    this.goalService.deleteGoal(id).subscribe({
      next: () => {
        this.goals = this.goals.filter(g => g.id !== id);
        this.selectedGoal = null;
      },
      error: (err) => this.error = 'Failed to delete goal: ' + err.message
    });
  }

  refreshTasks(): void {
    this.loadGoals(); // Reload to reflect task changes
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}