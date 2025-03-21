import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../tasks/task.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task: any;
  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();

  constructor(private taskService: TaskService) { }

  toggleTask(): void {
    this.taskService.updateTask(this.task).subscribe({
      next: () => this.update.emit(),
      error: (err) => console.error('Failed to update task:', err)
    });
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => this.delete.emit(this.task.id),
      error: (err) => console.error('Failed to delete task:', err)
    });
  }
}