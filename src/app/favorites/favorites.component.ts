import { Component, OnInit } from '@angular/core';
import { AppSearchService } from '../shared/app-search.service';

export interface FavoriteFilms {
  results?: []
  episode_id: number
  favorite?: boolean
  title: string
  opening_crawl: string
  director: string
  producer: string
  release_date: Date
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.styl']
})
export class FavoritesComponent implements OnInit {

  favoriteFilms: FavoriteFilms[] = []
  loadingFavorite: boolean = true

  constructor(private appSearchService: AppSearchService) { }

  ngOnInit() {
    this.loadFavoriteFilms();
  }

  loadFavoriteFilms() {
    this.loadingFavorite = true
    this.appSearchService.resultsAdd = false;
    this.appSearchService.text = '';
    let filmFavoritesArr: FavoriteFilms[] = JSON.parse(localStorage.getItem('filmFavorites')) || [];
    this.favoriteFilms = filmFavoritesArr;
    this.loadingFavorite = false;
  }

  changeFavorites(episode_id: number, context: boolean) {
    this.loadingFavorite = true
    let film = this.favoriteFilms.find(film => film.episode_id === episode_id);
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
    this.favoriteFilms = filmFavoritesArr;
    this.loadingFavorite = false;
  }

  search(eventValue: string) {
    this.appSearchService.searchAdd(eventValue);
  }

}
