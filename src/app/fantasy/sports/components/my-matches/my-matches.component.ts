import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import {
  SportsService,
  EventEmitterService,
  TrackerService,
  AnalyticsService
} from "src/app/core";

import { IMatch } from "src/app/models";

import { TeamCreationService } from "../../services";

@Component({
  selector: "app-my-matches",
  templateUrl: "./my-matches.component.html",
  styleUrls: ["./my-matches.component.scss"]
})
export class MyMatchesComponent implements OnInit {
  matches$: Observable<any>;
  selectedType: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sportsService: SportsService,
    private teamCreationService: TeamCreationService,
    private eventEmitterService: EventEmitterService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | My Match Page");
  }

  viewTeam(match: IMatch) {
    if (!match.userTeamId) {
      this.router.navigate(
        ["/fantasy/my-matches/cricket", match.eventId, "createTeam", "1"],
        {
          relativeTo: this.activatedRoute
        }
      );
    } else {
      if (this.selectedType === "upcoming") {
        this.router.navigate(
          ["/fantasy/my-matches/cricket", match.eventId, "editTeam"],
          {
            relativeTo: this.activatedRoute
          }
        );
      } else {
        this.router.navigate(
          ["/fantasy/my-matches/cricket", match.eventId, "viewTeam"],
          {
            relativeTo: this.activatedRoute
          }
        );
      }
    }
  }

  filter($event) {
    this.selectedType = $event;
    this.matches$ = this.sportsService
      .getMyMatches("cricket", $event)
      .pipe(catchError(() => of([])));
  }

  joinAnotherRoom(match) {
    this.teamCreationService.setCurrentMatch(match);
    this.router.navigate(["/fantasy/", match.gameType, match.eventId, "rooms"]);
  }

  showRoomDetails({ match, room }) {
    this.eventEmitterService.emit({
      type: "SHOW_FULL_AD",
      data: { contextName: "USER_ROOMS_SELECTION" }
    });
    this.teamCreationService.setCurrentMatch(match);
    this.router.navigate([
      "/fantasy/my-matches/",
      match.gameType,
      match.eventId,
      "rooms",
      room._id
    ]);
  }
}
