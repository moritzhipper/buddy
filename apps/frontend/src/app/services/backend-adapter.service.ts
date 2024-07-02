import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BuddyRoutes, Therapist, TherapistSearch, UniqueItem, UserProfile } from '@buddy/base-utils'
import { Observable, map } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
   providedIn: 'root',
})
export class BackendAdapterService {
   private readonly SERVICE_URL: string

   constructor(private _httpClient: HttpClient) {
      this.SERVICE_URL = environment.backendUrl
   }

   get<T>(route: string): Observable<T> {
      return this._httpClient.get<T>(this.SERVICE_URL + route)
   }

   addTherapist<T>(resource: T, route: string): Observable<T & UniqueItem> {
      return this._httpClient.post<T & UniqueItem>(this.SERVICE_URL + route, resource)
   }

   patchTherapist(therapist: Therapist, route: string): Observable<Therapist> {
      // remove id from resource to append it to request url
      const id = therapist.id
      const resourceClone = { ...therapist }
      delete resourceClone.id

      return this._httpClient.patch<Therapist>(this.SERVICE_URL + route + '/' + id, resourceClone).pipe(map(() => therapist))
   }

   deleteTherapist(id: string, route: string): Observable<string> {
      return this._httpClient.delete(this.SERVICE_URL + route + '/' + id).pipe(map(() => id))
   }

   searchTherapists(search: TherapistSearch): Observable<Therapist[]> {
      return this._httpClient.post<Therapist[]>(this.SERVICE_URL + BuddyRoutes.THERAPISTS + '/search', search)
   }

   createProfile(): Observable<UserProfile> {
      return this._httpClient.post<UserProfile>(this.SERVICE_URL + BuddyRoutes.PROFILE, null)
   }

   updateProfile(profile: UserProfile): Observable<UserProfile> {
      return this._httpClient.patch(this.SERVICE_URL + BuddyRoutes.PROFILE, profile).pipe(map(() => profile))
   }

   rotateQRkey(): Observable<{ secret: string }> {
      return this._httpClient.patch<{ secret: string }>(this.SERVICE_URL + BuddyRoutes.PROFILE + '/key', null)
   }

   deleteProfile(): Observable<any> {
      return this._httpClient.delete(this.SERVICE_URL + BuddyRoutes.PROFILE)
   }

   addSubscription(pushSubscription: any): Observable<any> {
      debugger
      return this._httpClient.post(this.SERVICE_URL + BuddyRoutes.SUBSCRIPTIONS, pushSubscription)
   }
}
