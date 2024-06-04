import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { Therapist } from '@buddy/base-utils'

@Component({
   selector: 'app-search-results',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './search-results.component.html',
   styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
   @Input() therapists: Therapist[]
}
