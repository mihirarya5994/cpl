import { PLAYERS } from "src/app/constants";
import { TeamCreationService } from "./../../services/team-creation.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";

import { switchMap, tap, isEmpty } from "rxjs/operators";
import { Subscription, interval } from "rxjs";

import {
  SportsService,
  AnalyticsService,
  EventEmitterService,
  EventData
} from "./../../../../core";

@Component({
  selector: "app-team-view",
  templateUrl: "./team-view.component.html",
  styleUrls: ["./team-view.component.scss"]
})
export class TeamViewComponent implements OnInit, OnDestroy {
  playersMap: any = {};
  totalPoints = 0;
  loading = true;
  players = PLAYERS;
  params: ParamMap;
  match;
  status;
  subscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private sportsService: SportsService,
    private eventEmitterService: EventEmitterService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.params = params;
      this.getMatchDetails();
      this.getTeam();
    });
    this.analyticsService.pageLoad(null, "SS | Team Score Page");

    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === "REFRESH_PLAYER_POIMTS") {
        this.getTeam();
      }
    });
  }

  getMatchDetails() {
    this.sportsService
      .getMatchDetails(this.params.get("sportId"), this.params.get("eventId"))
      .subscribe(res => {
        this.match = res;
        this.eventEmitterService.emit({
          type: "TEAM_PREVIEW",
          data: "null"
        });
        if (this.match.status === "started") {
          this.eventEmitterService.emit({
            type: "TEAM_PREVIEW",
            data: "live"
          });
        }
      });

    if (!this.match) {
      this.eventEmitterService.emit({
        type: "TEAM_PREVIEW",
        data: null
      });
    }
  }

  getTeam() {
    if (this.params.get("roomId")) {
      this.sportsService
        .getMyTeam(
          this.params.get("sportId"),
          this.params.get("eventId"),
          this.params.get("roomId")
        )
        .subscribe(team => {
          this.playersMap = {};
          team.players.forEach(player => {
            player.captain = team.captain === player.playerId;
            player.viceCaptain = team.viceCaptain === player.playerId;
            this.playersMap[player.skill] = this.playersMap[player.skill] || [];
            this.playersMap[player.skill].push(player);
          });
          this.totalPoints = team.players
            .map(p => p.eventPoints)
            .reduce((p1, p2) => p1 + p2, 0);
          this.loading = false;
        });
    } else {
      this.playersMap = {};
      var team = this.sportsService.getUserTeamByID(
        this.params.get("userTeamId")
      )[0];

      team.players.forEach(player => {
        player.captain = team.captain === player.playerId;
        player.viceCaptain = team.viceCaptain === player.playerId;
        this.playersMap[player.skill] = this.playersMap[player.skill] || [];
        this.playersMap[player.skill].push(player);
      });

      this.totalPoints = team.players
        .map(p => p.points)
        .reduce((p1, p2) => p1 + p2, 0);
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventEmitterService.emit({ data: null, type: "NOT_TEAM_PREVIEW" });
  }
}
