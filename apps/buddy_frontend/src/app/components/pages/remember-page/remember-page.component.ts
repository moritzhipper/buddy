import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { fadeOutAnimation } from "../../../animations";
import { selectNotesToRemember } from "../../../store/buddy.selectors";
import { trackById } from "../../../utils";
import { NoteDetailedComponent } from "../../shared/note-components/note-detailed/note-detailed.component";
import { PagePlaceholderTextComponent } from "../../shared/page-placeholder-text/page-placeholder-text.component";


@Component({
  selector: 'app-remember-page',
  templateUrl: './remember-page.component.html',
  styleUrls: ['./remember-page.component.scss'],
  standalone: true,
  imports: [PagePlaceholderTextComponent, NoteDetailedComponent, CommonModule],
  animations: [
    fadeOutAnimation
  ]
})
export class RememberPageComponent {

  trackById = trackById;
  notesToRemember$ = inject(Store).select(selectNotesToRemember);
}
