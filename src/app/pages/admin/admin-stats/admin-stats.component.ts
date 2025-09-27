import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card p-4 bg-container rounded shadow text-center">
      <h5 class="text-sm text-gray-400">{{ title }}</h5>
      <p class="text-3xl font-bold text-button">{{ value }}</p>
    </div>
  `,
  styles: [`
    .stat-card {
      transition: transform .2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
    }
  `]
})
export class AdminStatsComponent {
  @Input() title!: string;
  @Input() value: number = 0;
}
