import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SportsService, AnalyticsService } from 'src/app/core';
import { switchMap, tap } from 'rxjs/operators';

import { TEAMS } from '../../../../constants/teams';
import { PLAYER_TYPES } from '../../../../constants/player-types';
import { TeamCreationService } from '../../services';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {
  playersMap: any = {};
  totalPoints = 0;
  allPlayers = [];
  params;
  team;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sportsService: SportsService,
    private router: Router,
    private teamCreationService: TeamCreationService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, 'SS | Team Preview Page');
    this.activatedRoute.paramMap
      .pipe(
        tap((params: ParamMap) => {
          this.params = {
            sportId: params.get('sportId'),
            eventId: params.get('eventId'),
            roomId: params.get('roomId')
          };
        }),
        switchMap((params: ParamMap) =>
          this.sportsService.getMyTeam(
            params.get('sportId'),
            params.get('eventId'),
            params.get('roomId')
          )
        )
      )
      .subscribe((team: any) => {
        this.team = team;
        team.players.forEach((player) => {
          player['selected'] = true;
          player['teamIcon'] = TEAMS[player.teamId].icon;
          player['captain'] = player.playerId === team.captain;
          player['viceCaptain'] = player.playerId === team.viceCaptain;
          this.playersMap[player.skill] = this.playersMap[player.skill] || [];
          this.playersMap[player.skill].push(player);
        });
        this.allPlayers = [
          ...this.playersMap['wKeeper'],
          ...this.playersMap['batsman'],
          ...this.playersMap['allRounder'],
          ...this.playersMap['bowler']
        ];
        this.totalPoints = team.players.map((p) => p.points).reduce((p1, p2) => p1 + p2, 0);
      });
  }

  editPlayer(skill) {
    this.analyticsService.clickTrack('Change', 'SS | Team Preview Page');
    for (let i = 0; i < PLAYER_TYPES.length; i++) {
      if (PLAYER_TYPES[i].id === skill) {
        this.teamCreationService.setTeam(this.team);
        this.router.navigate([
          `/fantasy/${this.params.sportId}/${this.params.eventId}/createTeam/1/${i}`
        ]);
      }
    }
  }
}
