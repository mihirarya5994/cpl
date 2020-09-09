import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Component, OnInit, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

import {
  SportsService,
  LoggerService,
  TrackerService,
  AnalyticsService
} from "../../../../core";
import { PLAYER_TYPES } from "src/app/constants";

import { TeamCreationService } from "../../services/team-creation.service";

@Component({
  selector: "app-create-team",
  templateUrl: "./create-team-step-1.component.html",
  styleUrls: ["./create-team-step-1.component.scss"]
})
export class CreateTeamStep1Component implements OnInit, OnDestroy {
  playerTypes: any[] = PLAYER_TYPES;
  activeType;
  match;
  team;
  pointsBurned = 0;
  showPopup = false;
  popup = {
    text: ""
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sportsService: SportsService,
    private teamCreationService: TeamCreationService,
    private logger: LoggerService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | Team Select Page");
    this.team = this.teamCreationService.getTeam();
    this.activeType = this.playerTypes[0];
    this.activatedRoute.paramMap
      .pipe(
        tap((params: ParamMap) => {
          if (params.get("activeType")) {
            this.activeType = this.playerTypes[params.get("activeType")];
          }
        }),
        switchMap(params =>
          this.sportsService.getMatchDetails(
            params.get("sportId"),
            params.get("eventId")
          )
        )
      )
      .subscribe(match => {
        this.match = match;
        this.teamCreationService.setCurrentMatch(match);
        setTimeout(() => {
          this.team.players.forEach(teamPlayer => {
            this.match.players.forEach(mPlayer => {
              if (
                mPlayer.playerId === teamPlayer.playerId &&
                teamPlayer.selected
              ) {
                this.pointsBurned += mPlayer.points;
              }
            });
          });
        });
      });

    this.subscription = this.teamCreationService
      .getTeamUpdates()
      .subscribe(team => {
        this.team = team;
        this.pointsBurned = 0;
        this.team.players.forEach(
          member => (this.pointsBurned += member.points)
        );
      });
  }

  selectType(type) {
    this.activeType = type;
    this.analyticsService.clickTrack(type.traceKey, "SS | Team Select Page");
  }

  addPlayer(player) {
    if (
      this.pointsBurned + player.points <=
        this.match.validations.createTeamPoints &&
      this.teamCreationService.getTeamPlayersBySkill(player.skill).length <
        this.match.validations.skill[player.skill] &&
      this.teamCreationService.getTeamPlayersByCountry(player.teamId).length <
        this.match.validations.teamPlayer
    ) {
      this.teamCreationService.addPlayer(player);
      this.analyticsService.clickTrack("Add", "SS | Team Select Page");
    } else {
      if (
        this.pointsBurned + player.points >
        this.match.validations.createTeamPoints
      ) {
        this.popup.text = "Sorry, you ran out of your team budget";
      } else if (
        this.teamCreationService.getTeamPlayersBySkill(player.skill).length >=
        this.match.validations.skill[player.skill]
      ) {
        this.popup.text =
          "Sorry, you have selected maximum players for this skill";
      } else if (
        this.teamCreationService.getTeamPlayersByCountry(player.teamId)
          .length >= this.match.validations.teamPlayer
      ) {
        this.popup.text =
          "Sorry, you have selected the maximum number of players allowed from one playing team";
      }
      this.logger.warn(
        "points overflow | max players from team overflow | players by skill overflow"
      );
      this.showPopup = true;
    }
  }

  removePlayer(player) {
    this.teamCreationService.removePlayer(player);
    this.analyticsService.clickTrack("Remove", "SS | Team Select Page");
  }

  confirmTeam() {
    this.router.navigate(
      ["/fantasy", this.match.gameType, this.match.eventId, "createTeam", "2"],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  getFilteredTeamPlayersBySkill(skill) {
    return this.team.players.filter(player => player.skill === skill);
  }

  getFilteredTeamPlayersByCountry(teamId) {
    return this.team.players.filter(player => player.teamId === teamId);
  }

  getFilteredMatchPlayersBySkill(skill) {
    // add selected for selected team players
    this.team.players.forEach(teamPlayer => {
      this.match.players.forEach(mPlayer => {
        if (mPlayer.playerId === teamPlayer.playerId && teamPlayer.selected) {
          mPlayer["selected"] = true;
        }
      });
    });
    return this.match.players.filter(player => player.skill === skill);
  }

  togglePopup() {
    this.showPopup = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
