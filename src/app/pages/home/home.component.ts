import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APP_IMPORTS } from '../../imports/app.imports';
import { SerieStore } from '../../core/stores/serie.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ...APP_IMPORTS],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private serieStore = inject(SerieStore);

  series = this.serieStore.series;

  ngOnInit(): void {
    this.serieStore.loadSeries(1, 6);
  }
}
