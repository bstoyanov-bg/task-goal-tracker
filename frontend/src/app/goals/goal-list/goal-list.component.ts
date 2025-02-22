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

  constructor(private goalService: GoalService) { }

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.goalService.getGoals().subscribe({
      next: (goals) => this.goals = goals,
      error: (err) => {
        console.error('Failed to fetch goals:', err);
        this.error = 'Could not load goals. Check backend.';
      }
    });
  }

  createGoal(): void {
    if (!this.newGoalTitle.trim()) {
      this.error = 'Goal title is required.';
      return;
    }
    const goal = {
      id: 0,
      title: this.newGoalTitle,
      description: this.newGoalDescription,
      tasks: []
    };
    this.goalService.createGoal(goal).subscribe({
      next: (newGoal) => {
        this.goals.push(newGoal);
        this.newGoalTitle = '';
        this.newGoalDescription = '';
        this.error = null;
      },
      error: (err) => {
        console.error('Failed to create goal:', err);
        this.error = 'Failed to create goal.';
      }
    });
  }
}