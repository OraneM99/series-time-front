import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdminStatsComponent } from '../admin-stats/admin-stats.component';
import { APP_IMPORTS } from '../../../imports/app.imports';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [...APP_IMPORTS, AdminStatsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);

  usersCount = 0;
  seriesCount = 0;
  filmsCount = 0;
  lastUsers: any[] = [];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.http.get<any>(`${environment.apiUrl}/admin/stats`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.usersCount = data.usersCount;
          this.seriesCount = data.seriesCount;
          this.filmsCount = data.filmsCount;
          this.lastUsers = data.lastUsers;
        },
        error: (err) => console.error('Erreur chargement stats admin', err)
      });
  }
}
