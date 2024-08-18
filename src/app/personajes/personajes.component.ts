import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PersonajesService } from '../services/personajes.service';
import { Personaje } from '../models/personaje.model';

@Component({
  selector: 'app-personajes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginator,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './personajes.component.html',
  styleUrls: ['./personajes.component.css'],
})
export class PersonajesComponent implements OnInit {
  personajes: Personaje[] = [];
  totalResults: number = 0;
  pageSize: number = 20;
  currentPage: number = 0;
  searchId: string = '';
  filter = {
    name: '',
    status: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private personajesSrv: PersonajesService) {}

  ngOnInit() {
    this.loadPersonajes(this.currentPage + 1);
  }

  loadPersonajes(page: number) {
    const filters = this.buildFilters();
    this.personajesSrv.getPersonajes(page, filters).subscribe((datos: { info: any, results: Personaje[] }) => {
      this.personajes = datos.results;
      this.totalResults = datos.info.count;
    });
  }

  buildFilters(): string {
    const nameFilter = this.filter.name ? `&name=${this.filter.name}` : '';
    const statusFilter = this.filter.status ? `&status=${this.filter.status}` : '';
    return `${nameFilter}${statusFilter}`;
  }

  searchById() {
    if (this.searchId.includes(',')) {
      const ids = this.searchId.split(',').map(id => parseInt(id.trim(), 10));
      this.personajesSrv.getMultiplePersonajes(ids).subscribe((personajes: Personaje[]) => {
        this.personajes = personajes;
        this.totalResults = personajes.length;
      });
    } else {
      const id = parseInt(this.searchId.trim(), 10);
      this.personajesSrv.getPersonaje(id).subscribe((personaje: Personaje) => {
        this.personajes = [personaje];
        this.totalResults = 1;
      });
    }
  }

  applyFilter() {
    this.currentPage = 0;
    this.loadPersonajes(this.currentPage + 1);
  }

  handlePageEvent(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPersonajes(this.currentPage + 1);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive':
        return '#00FF00'; 
      case 'dead':
        return '#FF0000'; 
      case 'unknown':
        return '#FFFF00'; 
      default:
        return '#FFFFFF'; 
    }
  }
}
