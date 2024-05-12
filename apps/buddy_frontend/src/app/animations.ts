import { animate, style, transition, trigger } from "@angular/animations";


export const expandAnimation = trigger('expanded', [
  transition(':enter', [
    style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }),
    animate('300ms ease', style({ height: '*', opacity: 1, transform: 'translateX(0px)' }))
  ]),
  transition(':leave', [
    animate('300ms ease', style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }))
  ])
])

export const fadeOutAnimation = trigger('fadeOut', [
  transition(':leave', [
    animate('200ms ease', style({ opacity: 0 })),
    animate('300ms ease-in', style({ height: 0 })),
  ])
]);

export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms', style({ opacity: 1 })),
  ])
]);

export const fadeInFromZeroHeight = trigger('fadeInFromZero', [
  transition(':enter', [
    style({ opacity: 0, height: 0 }),
    animate('200ms ease', style({ opacity: 1, height: '*' })),
  ]),
  transition(':leave', [
    animate('200ms ease', style({ opacity: 0, height: 0, padding: 0 })),
  ])
]);
