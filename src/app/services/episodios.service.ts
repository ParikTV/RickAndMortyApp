import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Episodio } from '../models/episodio.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodiosService {
  private apiUrl = 'https://rickandmortyapi.com/api/episode';

  constructor(private http: HttpClient) {}

  getEpisodios(page: number, filters: string = ''): Observable<{ info: any, results: Episodio[] }> {
    const url = `${this.apiUrl}/?page=${page}${filters}`;
    return this.http.get<{ info: any, results: Episodio[] }>(url);
  }

  getEpisodio(id: number): Observable<Episodio> {
    return this.http.get<Episodio>(`${this.apiUrl}/${id}`);
  }

  getMultipleEpisodios(ids: number[]): Observable<Episodio[]> {
    const idsParam = ids.join(',');
    return this.http.get<Episodio[]>(`${this.apiUrl}/${idsParam}`);
  }
}
