import { concatMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { PlayersService } from 'src/app/core';

@Component({
  selector: 'app-match-status',
  templateUrl: './match-status.component.html',
  styleUrls: ['./match-status.component.scss']
})
export class MatchStatusComponent implements OnInit {
  players = { batsmen: [], bowlers: [] };
  feed;

  constructor(private playersService: PlayersService) {}

  ngOnInit() {}

  @Input('gameState')
  set gameState(state) {
    this.feed = state.feed;
    if (state && state.feed && state.feed.participants) {
      const playersMap = {};
      this.feed.participants
        .reduce((a, b) => a.players_involved.concat(b.players_involved))
        .forEach((player) => {
          player.onStrike = player.name.includes('*');
          playersMap[player.id] = player;
        });

      from(Object.keys(playersMap))
        .pipe(concatMap((key) => this.playersService.resolvePlayerById(key)))
        .subscribe((player) => {
          console.log(player);
          if (player) {
            if (
              playersMap[player.playerId].skill === 'batsman' ||
              playersMap[player.playerId].type === 'batsman'
            ) {
              this.players.batsmen.push(Object.assign(playersMap[player.playerId], player));
            } else {
              if (playersMap[player.playerId].onStrike) {
                this.players.bowlers.push(Object.assign(playersMap[player.playerId], player));
              }
            }
          }
        });
    }
  }
}
