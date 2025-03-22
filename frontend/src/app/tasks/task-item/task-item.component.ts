import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../../tasks/task.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task: any = { title: '', dueDate: null, isCompleted: false, id: 0 }; // Default value
  @Output() update = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();
  isEditing = false;
  editedTitle: string = '';
  editedDueDate: Date | null = null;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeFields();
  }

  ngOnChanges(): void {
    this.initializeFields();
  }

  private initializeFields(): void {
    this.editedTitle = this.task?.title || '';
    this.editedDueDate = this.task?.dueDate ? new Date(this.task.dueDate) : null;
  }

  toggleTask(): void {
    if (!this.task?.id) return;
    this.taskService.updateTask(this.task).subscribe({
      next: () => this.update.emit(),
      error: (err) => console.error('Failed to update task:', err)
    });
  }

  deleteTask(): void {
    if (!this.task?.id) return;
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => this.delete.emit(this.task.id),
      error: (err) => console.error('Failed to delete task:', err)
    });
  }

  startEditing(): void {
    if (!this.task) return;
    this.isEditing = true;
    this.initializeFields();
    this.cdr.detectChanges();
  }

  saveTask(): void {
    if (!this.editedTitle.trim() || !this.task?.id) return;
    this.task.title = this.editedTitle;
    this.task.dueDate = this.editedDueDate ? this.editedDueDate.toISOString() : null;
    this.taskService.updateTask(this.task).subscribe({
      next: () => {
        this.isEditing = false;
        this.update.emit();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to save task:', err)
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.initializeFields();
    this.cdr.detectChanges();
  }
}