import { Component, OnInit } from '@angular/core';
import { GoalService } from '../goal.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    FormsModule
  ],
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit {
  goals: any[] = [];
  error: string | null = null;
  newGoalTitle = '';
  newGoalDescription = '';
  selectedGoal: any = null;

  constructor(private goalService: GoalService) { }

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.goalService.getGoals().subscribe({
      next: (goals) => this.goals = goals,
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

  selectGoal(goal: any): void {
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
}