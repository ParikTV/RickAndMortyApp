import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EpisodiosService } from '../services/episodios.service';
import { Episodio } from '../models/episodio.model';

@Component({
  selector: 'app-episodios',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatPaginator, 
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './episodios.component.html',
  styleUrls: ['./episodios.component.css'],
  providers: [DatePipe],
})
export class EpisodiosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'air_date', 'episode', 'created'];
  episodios: Episodio[] = [];
  totalResults: number = 0;
  pageSize: number = 20;
  currentPage: number = 0;
  searchId: string = '';
  filter = {
    name: '',
    episode: '',
    order: 'desc' 
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private episodiosSrv: EpisodiosService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.loadEpisodios(this.currentPage + 1);
  }

  loadEpisodios(page: number) {
    this.episodiosSrv.getEpisodios(page).subscribe((datos: { info: any, results: Episodio[] }) => {
      this.episodios = datos.results
        .map((episode: Episodio) => ({
          ...episode,
          air_date: this.datePipe.transform(episode.air_date, 'medium')!,
          created: this.datePipe.transform(episode.created, 'medium')!,
        }))
        .sort((a, b) => this.filter.order === 'desc'
          ? new Date(b.air_date).getTime() - new Date(a.air_date).getTime()
          : new Date(a.air_date).getTime() - new Date(b.air_date).getTime());
      this.totalResults = datos.info.count;
    });
  }

  applyFilter() {
    this.currentPage = 0;
    this.loadEpisodios(this.currentPage + 1);
  }

  searchById() {
    if (this.searchId.includes(',')) {
      const ids = this.searchId.split(',').map(id => parseInt(id.trim(), 10));
      this.episodiosSrv.getMultipleEpisodios(ids).subscribe((episodios: Episodio[]) => {
        this.episodios = episodios
          .map((episode: Episodio) => ({
            ...episode,
            air_date: this.datePipe.transform(episode.air_date, 'medium')!,
            created: this.datePipe.transform(episode.created, 'medium')!,
          }))
          .sort((a, b) => this.filter.order === 'desc'
            ? new Date(b.air_date).getTime() - new Date(a.air_date).getTime()
            : new Date(a.air_date).getTime() - new Date(b.air_date).getTime());
        this.totalResults = episodios.length;
      });
    } else {
      const id = parseInt(this.searchId.trim(), 10);
      this.episodiosSrv.getEpisodio(id).subscribe((episodio: Episodio) => {
        this.episodios = [{
          ...episodio,
          air_date: this.datePipe.transform(episodio.air_date, 'medium')!,
          created: this.datePipe.transform(episodio.created, 'medium')!,
        }];
        this.totalResults = 1;
      });
    }
  }

  handlePageEvent(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEpisodios(this.currentPage + 1);
  }
}
