import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
   selector: 'app-search-page',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './search-page.component.html',
   styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {}
