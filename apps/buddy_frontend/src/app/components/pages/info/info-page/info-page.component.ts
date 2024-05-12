import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccordionComponent } from '../accordion/accordion.component';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
  standalone: true,
  imports: [AccordionComponent, RouterModule]
})
export class InfoPageComponent {}
