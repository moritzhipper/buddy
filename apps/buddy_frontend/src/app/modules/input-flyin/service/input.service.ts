import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import deepEqual from 'deep-equal';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export class InputServiceConfig {
  header: string;
  type: InputTypes;
  canRemove?: boolean;
  description?: string;
  preset?: any;
  label?: string;
}

export enum InputTypes {
  'PASSWORD',
  'TEXT_SHORT',
  'TEXT_LONG',
  'THERAPYTYPE',
  'PHONE',
  'MAIL',
  'DATE',
  'CALL_TIMES',
  'ADDRESS',
  'APPOINTMENT',
  'CONFIRM',
  'NUMBER',
  'THERAPIST'
}

export enum InputResolveTypes {
  'CONFIRM',
  'DELETE',
  'DISCARD'
}

export class InputResolver {
  type: InputResolveTypes;
  value?: any;
}

@Injectable({
  providedIn: 'root'
})
export class InputService {

  configSubject = new BehaviorSubject<InputServiceConfig>(null);
  resolveValuePromise;


  constructor(private _router: Router, @Inject(DOCUMENT) private document: Document) {
    this.document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.discardValueChanges();
      }
    });
    // close inout on routechange
    this._router.events.pipe(
      filter(event => event instanceof NavigationStart),
    ).subscribe(v => {
      this.discardValueChanges();
    });
  }

  // return new value
  confirmValue(value?: any) {
    // if value is set, check if it changed or is same as before
    // if no value is set, it means confirm dialogue was selected
    if (value) {
      const valueEqualsPreset = deepEqual(this.configSubject.getValue()?.preset, value);
      if (!valueEqualsPreset) {
        console.log('resolve with new value');

        this.resolveValuePromise({
          type: InputResolveTypes.CONFIRM,
          value
        });
        this.closeInputDialogue()
      } else {
        console.log('resolve with unchanged value => disgard');
        this.discardValueChanges();
      }
    } else {
      console.log('resolve without value')
      this.resolveValuePromise({
        type: InputResolveTypes.CONFIRM
      });
      this.closeInputDialogue();
    }
  }

  //communicate deletion of saved value 
  deleteValue() {
    this.resolveValuePromise({
      type: InputResolveTypes.DELETE
    })
    this.closeInputDialogue();
  }

  //communicate discard of changes made in input
  discardValueChanges() {

    this.resolveValuePromise && this.resolveValuePromise({
      type: InputResolveTypes.DISCARD
    })

    this.closeInputDialogue();
  }

  //input config-object
  openInputDialogue(config: InputServiceConfig): Promise<InputResolver> {
    if (!config.preset) {
      config.preset = "";
    }
    this.configSubject.next(config);
    return new Promise<InputResolver>(resolve => this.resolveValuePromise = resolve);
  }

  closeInputDialogue() {
    this.configSubject.next(null);
  }
}
