import { Component, OnInit, inject } from '@angular/core';
import { SerieStore } from '../../../core/stores/serie.store';
import {SERIE_IMPORTS} from '../../../imports/serie.imports';

@Component({
  selector: 'app-series-list',
  standalone: true,
  imports: [...SERIE_IMPORTS],
  templateUrl: './serie-list.component.html',
  styleUrls: ['./serie-list.component.css'],
})
export class SerieListComponent implements OnInit {
  store = inject(SerieStore);

  p = 1;
  perPage = 12;
  isAdmin = false; // ⚡ À brancher plus tard sur AuthService

  ngOnInit(): void {
    this.store.loadSeries(this.p, this.perPage);
  }

  onPageChange(page: number): void {
    this.p = page;
    this.store.loadSeries(page, this.perPage);
  }
}
