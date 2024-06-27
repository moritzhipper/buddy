import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
   selector: 'app-legal-page',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './legal-page.component.html',
   styleUrl: './legal-page.component.scss',
})
export class LegalPageComponent {}
