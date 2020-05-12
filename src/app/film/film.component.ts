import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppSearchService } from '../shared/app-search.service';

export interface Film {
  episode_id?: number
  favorite?: boolean
}

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.styl']
})
export class FilmComponent implements OnInit {

  film: Film = {}
  loadingFilm: boolean = true

  constructor(private route: ActivatedRoute, private http: HttpClient,
    private sanitizer: DomSanitizer, private appSearchService: AppSearchService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.loadFilm(params.id);
    });
  }

  loadFilm(id: number) {
    this.loadingFilm = true;
    this.appSearchService.resultsAdd = false;
    this.appSearchService.text = '';
    this.http.get<Film>(`https://swapi.dev/api/films/${id}`)
      .subscribe(response => {
        let arr = [];
        let filmFavoritesArr = JSON.parse(localStorage.getItem('filmFavorites')) || [];

        if (filmFavoritesArr.length > 0) {
          filmFavoritesArr.forEach((filmFavorite: any )=> {
            if (filmFavorite.id === response.episode_id) {
              response.favorite = true;
            }
          });
        }

        this.film = response;
        this.loadingFilm = false;
    }, error => {
      console.log(error.message);
    });
  }

  changeFavorites(context: boolean) {
    this.film.favorite = !this.film.favorite;
    let filmFavoritesArr = JSON.parse(localStorage.getItem('filmFavorites')) || [];
    if (context) {
      filmFavoritesArr.push(this.film);
    } else {
      filmFavoritesArr.map((item: any, index: number) => {
        if (item.episode_id === this.film.episode_id) {
          filmFavoritesArr.splice(index, 1);
        }
      });
    }
    localStorage.setItem('filmFavorites', JSON.stringify(filmFavoritesArr));
  }

}
