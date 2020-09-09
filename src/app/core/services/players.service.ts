import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { AppService } from './app.service';
import { RestService } from './rest.service';
import { PLAYERS } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private allPlayers: any;

  constructor(private appService: AppService, private restService: RestService) {}

  resolvePlayerById(id) {
    if (this.allPlayers) {
      return of(this.allPlayers[id]);
    }
    this.allPlayers = PLAYERS;
    // return this.restService.get('assets/config/players.json').pipe(
    //   tap((res) => {
    //     this.allPlayers = res;
    //   }),
    //   switchMap(() => {
    //     return of(this.allPlayers[id]);
    //   })
    // );
    return of(this.allPlayers[id]);
  }

  getUserRank(roomId, eventId) {
    return this.restService.get(
      `${this.appService.getConfigParam('API_HOST')}/user/room/${roomId}/events/${eventId}/rank`
    );
  }

  getLeaderboardStats(roomId, eventId) {
    return this.restService.get(
      `${this.appService.getConfigParam('API_HOST')}/leaderboard/room/${roomId}/events/${eventId}`
    );
  }
}
