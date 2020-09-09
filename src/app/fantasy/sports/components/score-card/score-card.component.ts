import { Component, Input } from '@angular/core';

import { AppService, AnalyticsService } from 'src/app/core';

import { TEAMS } from '../../../../constants/teams';
import { TeamCreationService } from '../../services';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss']
})
export class ScoreCardComponent {
  data: any = {};
  @Input() roomID;
  showFullScoreCard = false;
  match;
  constructor(
    private appService: AppService,
    private analyticsService: AnalyticsService,
    private teamCreationService: TeamCreationService
    ) {
      this.match = this.teamCreationService.getCurrentMatch();
    }

  @Input('gameState')
  set gameState(state) {
    if (state && state.feed && state.feed.participants) {
      state.feed.participants.forEach((t) => {
        t.name = t.name || TEAMS[t.id].name;
        t.icon = t.icon || TEAMS[t.id].icon;
        t.code = t.code || TEAMS[t.id].code;
      });

      this.data.gameId = state.feed.game_id;
      this.data.battingTeam = state.feed.participants.filter((f) => f.now === 'true')[0];
      this.data.bowlingTeam = state.feed.participants.filter((f) => f.now !== 'true')[0];

      const currentBowler = (this.data.bowlingTeam.players_involved || []).filter(
        (p) => p.name.indexOf('*') > -1
      );
      if (currentBowler.length) {
        this.data.bowlingTeam.players_involved = currentBowler;
      }
    }
  }

  toggleFullScoreCard() {
    this.showFullScoreCard = !this.showFullScoreCard;
    if (this.showFullScoreCard) {
      this.analyticsService.clickTrack('Full Score Card', "SS | RoomsPage", {
        match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}`,
        room: this.roomID
      });
    }
  }
}
