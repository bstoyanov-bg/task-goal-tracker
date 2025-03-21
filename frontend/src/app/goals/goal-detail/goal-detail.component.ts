import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../../tasks/task-item/task-item.component';
import { TaskService } from '../../tasks/task.service';
import { Goal } from '../../Models/Goal';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-goal-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    FormsModule,
    TaskItemComponent
  ],
  templateUrl: './goal-detail.component.html',
  styleUrl: './goal-detail.component.scss'
})
export class GoalDetailComponent {
  @Input() goal: any;
  @Output() update = new EventEmitter<Goal>();
  @Output() delete = new EventEmitter<number>();
  @Output() taskChange = new EventEmitter<void>(); // Notify parent of task changes
  newTaskTitle: string = '';
  error: string | null = null;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) { }

  saveGoal(): void {
    this.update.emit(this.goal);
  }

  deleteGoal(): void {
    this.delete.emit(this.goal.id);
  }

  createTask(): void {
    if (!this.newTaskTitle.trim()) {
      this.error = 'Task title is required.';
      return;
    }
    const task = {
      id: 0,
      title: this.newTaskTitle,
      isCompleted: false,
      goalId: this.goal.id,
      dueDate: new Date(),
    };
    this.taskService.createTask(task).subscribe({
      next: (newTask) => {
        if (!this.goal.tasks) this.goal.tasks = [];
        this.goal.tasks.push(newTask);
        this.newTaskTitle = '';
        this.error = null;
        this.taskChange.emit();
        this.cdr.detectChanges();
      },
      error: (err) => this.error = 'Failed to create task: ' + err.message
    });
  }

  getProgress(): number {
    if (!this.goal.tasks || this.goal.tasks.length === 0) return 0;
    const completed = this.goal.tasks.filter((t: { isCompleted: any; }) => t.isCompleted).length;
    return (completed / this.goal.tasks.length) * 100;
  }
}
