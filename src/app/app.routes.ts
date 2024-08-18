import { Routes } from '@angular/router';
import { PersonajesComponent } from './personajes/personajes.component';
import { EpisodiosComponent } from './episodios/episodios.component';

export const routes: Routes = [
  { path: 'personajes', component: PersonajesComponent },
  { path: 'episodios', component: EpisodiosComponent },
  { path: '', redirectTo: '/personajes', pathMatch: 'full' }, 
];
