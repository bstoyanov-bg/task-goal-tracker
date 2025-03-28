import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../../tasks/task.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

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
    MatSelectModule,
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
  editedPriority: string = 'Medium';
  priorityOptions = ['Low', 'Medium', 'High'];
  isOverdue: boolean = false;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeFields();
  }

  ngAfterViewInit(): void {
    this.checkOverdue();
    this.cdr.detectChanges();
  }

  ngOnChanges(): void {
    this.initializeFields();
  }

  @Input()
  set taskInput(value: any) {
    this.task = value;
    this.initializeFields();
    this.checkOverdue();
    this.cdr.detectChanges();
  }

  private initializeFields(): void {
    if (this.task) {
      this.editedTitle = this.task.title || '';
      this.editedDueDate = this.task.dueDate ? new Date(this.task.dueDate) : null;
      this.editedPriority = this.task.priority || 'Medium';
    }
  }

  toggleTask(): void {
    if (!this.task?.id) return;
    this.taskService.updateTask(this.task).subscribe({
      next: () => {
        this.update.emit();
        this.checkOverdue();
      },
      error: (err) => console.error('Failed to update task:', err)
    });
  }

  deleteTask(): void {
    if (!this.task?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { taskTitle: this.task.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(this.task.id).subscribe({
          next: () => this.delete.emit(this.task.id),
          error: (err) => console.error('Failed to delete task:', err)
        });
      }
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
    this.task.priority = this.editedPriority;
    this.taskService.updateTask(this.task).subscribe({
      next: () => {
        this.isEditing = false;
        this.update.emit();
        this.checkOverdue();
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

  private checkOverdue(): void {
    if (this.task && this.task.dueDate && !this.task.isCompleted) {
      const dueDate = new Date(this.task.dueDate);
      const currentDate = new Date();
      this.isOverdue = dueDate < currentDate;
    } else {
      this.isOverdue = false;
    }
  }
}