import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSearchService } from '../shared/app-search.service';

export interface PopularFilms {
  episode_id: number
  title: string
  opening_crawl: string
  director: string
  producer: string
  release_date: Date
  results?: []
  favorite?: boolean
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {
  loadingOne: boolean = true
  loading: boolean = true
  page: number = 1
  popularFilms: PopularFilms[] = []

  constructor(private http: HttpClient, private appSearchService: AppSearchService) { }

  ngOnInit() {
    this.loadFilms();
  }

  loadFilms(bool?: boolean) {
    this.loading = true;
    this.appSearchService.resultsAdd = false;
    this.appSearchService.text = '';
    this.http.get<PopularFilms>(`https://swapi.dev/api/films`)
    .subscribe(response => {
      this.pushFilms(response.results, bool);
    }, error => {
      console.log(error.message);
    });
  }

  pushFilms(response: [], bool?: boolean) {
    let filmFavoritesArr = JSON.parse(localStorage.getItem('filmFavorites')) || [];
    response.map((film: any) => {
      if (filmFavoritesArr.length > 0) {
        filmFavoritesArr.forEach((filmFavorite: any )=> {
          if (filmFavorite.id === film.id) {
            film.favorite = true;
          }
        });
      }
    });
    bool ? this.popularFilms = response : this.popularFilms.push(...response);
    this.loading = false;
    if (this.loadingOne) this.loadingOne = false;
  }

  changeFavorites(episode_id: number, context: boolean) {
    let film = this.popularFilms.find(film => film.episode_id === episode_id);
    film.favorite = !film.favorite;
    let filmFavoritesArr = JSON.parse(localStorage.getItem('filmFavorites')) || [];
    if (context) {
      filmFavoritesArr.push(film);
    } else {
      filmFavoritesArr.map((item: any, index: number) => {
        if (item.episode_id === film.episode_id) {
          filmFavoritesArr.splice(index, 1);
        }
      });
    }
    localStorage.setItem('filmFavorites', JSON.stringify(filmFavoritesArr));
  }

  search(eventValue: string) {
    if (eventValue.trim().length === 0) {
      this.page = 1;
      this.popularFilms = [];
      this.loadFilms(true);
    } else if (eventValue.trim().length > 2) {
      this.http.get<PopularFilms>(`https://swapi.dev/api/films/{eventValue}`)
      .subscribe(response => {
        this.loading = true;
        this.page = 1;
        this.popularFilms = [];
        this.pushFilms(response.results);
      }, error => {
        console.log(error.message);
      });
    }
  }

}
