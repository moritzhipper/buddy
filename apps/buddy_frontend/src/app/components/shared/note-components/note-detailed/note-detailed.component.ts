import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoteAbstract } from '../note-abstract';

@Component({
   selector: 'app-note-detailed',
   templateUrl: './note-detailed.component.html',
   styleUrl: './note-detailed.component.scss',
   standalone: true,
   imports: [CommonModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailedComponent extends NoteAbstract {}
