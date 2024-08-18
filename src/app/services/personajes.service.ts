import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personaje } from '../models/personaje.model';

@Injectable({
  providedIn: 'root',
})
export class PersonajesService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getPersonajes(page: number, filters?: string): Observable<{ info: any, results: Personaje[] }> {
    const url = `${this.apiUrl}/?page=${page}${filters || ''}`;
    return this.http.get<{ info: any, results: Personaje[] }>(url);
  }

  getPersonaje(id: number): Observable<Personaje> {
    return this.http.get<Personaje>(`${this.apiUrl}/${id}`);
  }

  getMultiplePersonajes(ids: number[]): Observable<Personaje[]> {
    const idsParam = ids.join(',');
    return this.http.get<Personaje[]>(`${this.apiUrl}/${idsParam}`);
  }

  getEpisode(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}
