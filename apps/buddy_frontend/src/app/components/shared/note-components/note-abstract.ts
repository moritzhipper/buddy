import { Directive, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Note } from '../../../models';
import { InputResolveTypes, InputService, InputTypes } from '../../../services/input.service';
import { noteActions } from '../../../store/buddy.actions';
import { BuddyState } from '../../../store/buddy.state';
import { vibrateInfo } from '../../../utils';


@Directive()
export abstract class NoteAbstract {

    @Input() set note(note: Note) {
        if (note) {
            const { body, header } = this.splitNoteBody(note.body);
            this.noteHeader = header;
            this.noteBody = body;
            this.noteFromInput = note;
        }
    }

    noteHeader: string;
    noteBody: string;
    noteFromInput: Note

    constructor(private _inputService: InputService, private _store: Store<BuddyState>) { }

    editNote() {
        this._inputService.openInputDialogue(
            { header: 'Notiz bearbeiten', type: InputTypes.TEXT_LONG, preset: this.noteFromInput?.body, canRemove: true }
        ).then(v => {
            if (v.type === InputResolveTypes.CONFIRM) {
                this._store.dispatch(noteActions.update({ props: { body: v.value, id: this.noteFromInput.id } }))
            } else if (v.type === InputResolveTypes.DELETE) {
                this._store.dispatch(noteActions.delete({ id: this.noteFromInput.id }))
            }
        });
    }

    toggleReminder() {

        vibrateInfo();
        this._store.dispatch(noteActions.update({ props: { id: this.noteFromInput.id, isImportant: !this.noteFromInput.isImportant } }))
    }

    splitNoteBody(body: string): { header: string, body: string } {
        const headerEndPosition = body.search(/\n/g);
        const isHeaderShortEnough = headerEndPosition < 30 && headerEndPosition > 0;
        const noteHeader = isHeaderShortEnough ? body.substring(0, headerEndPosition) : '';
        // add 3 to index to skip \n char
        const noteBody = isHeaderShortEnough ? body.substring(headerEndPosition + 1) : body;

        return { header: noteHeader, body: noteBody }
    }
}
