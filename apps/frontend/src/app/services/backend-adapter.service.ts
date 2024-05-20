import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { environment } from '../../environments/environment'
import { Settings, Therapist, UniqueItem, UserLogin } from '../models'

@Injectable({
   providedIn: 'root',
})
export class BackendAdapterService {
   private readonly SERVICE_URL: string
   readonly ROUTE_THERAPIST = '/therapists'
   readonly ROUTE_APPOINTMENT = '/appointments'
   readonly ROUTE_NOTES = '/notes'
   readonly ROUTE_GOALS = '/goals'
   readonly ROUTE_SETTINGS = '/settings'
   readonly ROUTE_USER_PROFILE = '/user'
   readonly ROUTE_AUTH = '/auth'

   constructor(private _httpClient: HttpClient) {
      this.SERVICE_URL = environment.backendUrl
   }

   postUniqueItem<T>(resource: T, route: string): Observable<T & UniqueItem> {
      return this._httpClient.post<T & UniqueItem>(this.SERVICE_URL + route, resource)
   }

   patchUniqueItem<T extends UniqueItem>(resource: T, route: string): Observable<T> {
      // remove id from resource to append it to request url
      const id = resource.id
      const resourceClone = { ...resource }
      delete resourceClone.id

      return this._httpClient.patch<T>(this.SERVICE_URL + route + '/' + id, resourceClone).pipe(map(() => resource))
   }

   deleteUniqueItem(id: string, route: string): Observable<string> {
      return this._httpClient.delete(this.SERVICE_URL + route + '/' + id).pipe(map(() => id))
   }

   get<T>(route: string): Observable<T> {
      return this._httpClient.get<T>(this.SERVICE_URL + route)
   }

   post<T>(route: string, resource: T): Observable<T> {
      return this._httpClient.post<T>(this.SERVICE_URL + route, resource)
   }

   patch<T>(resource: T, route: string): Observable<T> {
      return this._httpClient.patch(this.SERVICE_URL + route, resource).pipe(map(() => resource))
   }

   updateSettings(settings: Settings): Observable<Settings> {
      return this._httpClient.patch(this.SERVICE_URL + this.ROUTE_SETTINGS, settings)
   }

   createPassword(password: string): Observable<any> {
      return this._httpClient.post(this.SERVICE_URL + this.ROUTE_USER_PROFILE, password)
   }

   resetUserData(): Observable<any> {
      return this._httpClient.delete(this.SERVICE_URL + this.ROUTE_USER_PROFILE)
   }

   rotateQRkey(): Observable<{ secret: string }> {
      return this._httpClient.patch<{ secret: string }>(this.SERVICE_URL + this.ROUTE_AUTH + '/key', null)
   }

   createSession(login: UserLogin): Observable<{ session: string }> {
      return this._httpClient.post<{ session: string }>(this.SERVICE_URL + this.ROUTE_AUTH + '/sessions', login)
   }

   getSuggestions(filter: any): Observable<Therapist[]> {
      return this._httpClient.post<Therapist[]>(this.SERVICE_URL + this.ROUTE_THERAPIST + '/find', filter)
   }

   logout() {
      return this._httpClient.delete(this.SERVICE_URL + this.ROUTE_AUTH + '/sessions')
   }

   logoutEverywhere() {
      return this._httpClient.delete(this.SERVICE_URL + this.ROUTE_AUTH + '/sessions/all')
   }
}
