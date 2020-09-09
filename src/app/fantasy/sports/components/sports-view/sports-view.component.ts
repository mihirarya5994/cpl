import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { map } from "rxjs/operators";

import { Observable } from "rxjs";

import {
  SportsService,
  TrackerService,
  AnalyticsService,
  EventEmitterService,
  EventData
} from "../../../../core";

import { IMatch, ISport } from "../../../../models";

@Component({
  selector: "app-sports-view",
  templateUrl: "./sports-view.component.html",
  styleUrls: ["./sports-view.component.scss"]
})
export class SportsViewComponent implements OnInit {
  sports$: Observable<ISport[]>;
  matches: any[] = [];
  selectedSport;
  jcpaLauncherGame: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sportsService: SportsService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.sports$ = this.sportsService.getSportsTypes();
    this.selectSport({ id: "cricket" });
  }

  selectSport(sport) {
    this.selectedSport = sport;
    this.getMatchesForSport(sport)
      .pipe(
        map(matches =>
          matches.sort((m1, m2) => {
            const d1 = new Date(m1.startTime);
            const d2 = new Date(m2.startTime);
            if (d1 < d2) {
              return -1;
            }
            if (d1 === d2) {
              return 0;
            }
            return 1;
          })
        )
      )
      .subscribe(matches => {
        this.matches = matches.filter(m => m.status === "scheduled");
        this.jcpaLauncherGame = [
          ...matches.filter(m => m.status === "started"),
          ...matches.filter(m => m.status === "scheduled")
        ];
      });
  }

  getMatchesForSport(sport) {
    return this.sportsService.getScheduledMatchesForType(sport.id);
  }

  navigate(match) {
    if (!match.userTeamId) {
      this.router.navigate(
        ["/fantasy", this.selectedSport.id, match.eventId, "rooms"],
        {
          relativeTo: this.activatedRoute
        }
      );
    } else {
      this.router.navigate(["/fantasy/my-matches"], {
        relativeTo: this.activatedRoute
      });
    }
  }
}
