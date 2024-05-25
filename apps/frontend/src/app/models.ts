export enum ToastType {
   ERROR,
   SUCCESS,
}

export interface Toast {
   text: string
   type?: ToastType
}

export enum weekdays {
   SO = 'so',
   MO = 'mo',
   DI = 'di',
   MI = 'mi',
   DO = 'do',
   FR = 'fr',
   SA = 'sa',
}

export const WeekdaysMap: { [key in weekdays]: string } = {
   [weekdays.SO]: 'Sonntag',
   [weekdays.MO]: 'Montag',
   [weekdays.DI]: 'Dienstag',
   [weekdays.MI]: 'Mittwoch',
   [weekdays.DO]: 'Donnerstag',
   [weekdays.FR]: 'Freitag',
   [weekdays.SA]: 'Samstag',
}
