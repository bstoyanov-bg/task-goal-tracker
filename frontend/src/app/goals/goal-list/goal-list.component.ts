import { Component, OnInit } from '@angular/core';
import { GoalService } from '../goal.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-goal-list',
    standalone: true,
    imports: [CommonModule, MatSidenavModule, MatListModule],
    templateUrl: './goal-list.component.html',
    styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit {
    goals: any[] = [];

    constructor(private goalService: GoalService) { }

    ngOnInit(): void {
        this.goalService.getGoals().subscribe(goals => this.goals = goals);
    }
}