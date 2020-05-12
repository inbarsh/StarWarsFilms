import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface SeacrhFilms {
  title: string
  opening_crawl: string
  director: string
  producer: string
  release_date: Date
  // genre_ids: []
  results?: []
  favorite?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AppSearchService {

  seacrhFilms: SeacrhFilms[] = []
  resultsAdd: boolean = false
  text: string = ''

  constructor(private http: HttpClient) { }

  searchAdd(value: string) {
    if (value.trim().length > 1) {
      this.resultsAdd = true;
      this.http.get<SeacrhFilms>(`https://swapi.dev/api/films`)
      .subscribe(response => {
        this.seacrhFilms = response.results;
      }, error => {
        console.log(error.message);
      });
    } else {
      this.resultsAdd = false;
    }
  }

}
