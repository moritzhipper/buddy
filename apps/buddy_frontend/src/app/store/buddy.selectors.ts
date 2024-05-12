import { createSelector } from '@ngrx/store';
import {
   Appointment,
   Auth,
   Goal,
   Note,
   Settings,
   Therapist,
   UserProfile,
} from '../models';
import { BuddyState } from './buddy.state';

export const selectTherapists = createSelector(
   (state: BuddyState) => state.therapists,
   (therapists: Therapist[]) =>
      therapists.slice().sort((a, b) => a.name.localeCompare(b.name))
);

export const selectNotes = createSelector(
   (state: BuddyState) => state.notes,
   (notes: Array<Goal>) => notes
);

export const selectNotesToRemember = createSelector(
   (state: BuddyState) => state.notes,
   (notes: Array<Note>) => notes.filter((note) => note.isImportant)
);

export const selectGoals = createSelector(
   (state: BuddyState) => state.goals,
   (goals: Array<Goal>) => goals
);

export const selectAppointments = createSelector(
   (state: BuddyState) => state.appointments,
   (appointments: Array<Appointment>) => appointments
);

export const selectSettings = createSelector(
   (state: BuddyState) => state.settings,
   (settings: Settings) => settings
);

export const selectUserProfile = createSelector(
   (state: BuddyState) => state.profile,
   (profile: UserProfile) => profile
);

export const selectAuth = createSelector(
   (state: BuddyState) => state.auth,
   (auth: Auth) => auth
);
