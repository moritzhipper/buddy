import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Toast } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _toasts$: Subject<Toast> = new Subject();
  toasts$: Observable<Toast> = this._toasts$;

  private _toastActive = false;
  private _pendingToasts: Toast[] = [];

  sendToast(toast: Toast) {
    //wenn toastInQueue, dann adde mit delay, wenn nicht, adde ohne delay

    if (this._toastActive) {
      this._pendingToasts.push(toast);
    } else {

      this._toastActive = true;
      this._toasts$.next(toast);

      setTimeout(() => {
        this._toastActive = false;
        this._toasts$.next(null);

        this._pendingToasts.length > 0 && this._sendPendingToasts();

      }, 4000)
    }
  }

  private _sendPendingToasts() {
    setTimeout(() => {
      this.sendToast(this._pendingToasts[0]);
      this._pendingToasts.shift();
    }, 600)
  }
}
