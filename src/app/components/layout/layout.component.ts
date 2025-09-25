import { Component } from '@angular/core';
import { LAYOUT_IMPORTS } from '../../imports/layout.imports';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [...LAYOUT_IMPORTS],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {}
