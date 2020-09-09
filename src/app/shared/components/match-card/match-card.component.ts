import { SportsService } from "./../../../core/services/sports.service";
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ProfileService, TrackerService, AnalyticsService } from "src/app/core";

import { IMatch } from "../../../models";

@Component({
  selector: "app-match-card",
  templateUrl: "./match-card.component.html",
  styleUrls: ["./match-card.component.scss"]
})
export class MatchCardComponent implements OnInit {
  @Input() match: IMatch;
  @Input() type;
  @Output() selection: EventEmitter<Object> = new EventEmitter();
  @Output() joinRoom: EventEmitter<any> = new EventEmitter();
  @Output() showRoom: EventEmitter<any> = new EventEmitter();
  rooms;
  toss = { winningTeam: null, userWon: false, points: 0 };
  isMatchStarted = false;
  joinedRooms;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService,
    private sportsService: SportsService
  ) {}

  ngOnInit() {
    this.getUserRooms();
    if (this.type === "live") {
      this.checkToss();
    }
  }

  getUserRooms() {
    this.sportsService.getAllRooms(this.match.eventId).subscribe(rooms => {
      this.rooms = rooms;
      this.sportsService.getUserRooms(this.match.eventId).subscribe(res => {
        this.joinedRooms = res;
      });
    });
  }

  checkToss() {
    const tossEvent = this.match.eventQuestions[0];
    this.toss.points = tossEvent.points;
    if (tossEvent.userAnswer && tossEvent.userAnswer[0]) {
      this.toss.userWon = tossEvent.userAnswer[0] === tossEvent.answer[0];
    }
    if (!tossEvent.answer && !tossEvent.answer.length) {
      return;
    }
    this.toss.winningTeam = tossEvent[
      `opt_${this.profileService.getProfileSync().language}`
    ].filter(o => o.id === tossEvent.answer[0])[0].desc;
  }

  select() {
    this.analyticsService.clickTrack("Join Room | Upcoming", "SS | Home Page", {
      match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}`
    });
    if (this.match["active"] === false) {
      return;
    }
    this.selection.emit(this.match);
  }

  coutdownfinished() {
    this.isMatchStarted = true;
  }

  joinAnotherRoom() {
    if (this.match.rooms.length >= 5) {
      return;
    } else {
      this.analyticsService.clickTrack(
        "Join Another Room",
        "SS | My Match Page | Upcoming",
        { match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}` }
      );
      this.joinRoom.emit(this.match);
    }
  }

  showRoomDetails(room) {
    if (this.type === "live" || this.type === "past") {
      this.showRoom.emit({ match: this.match, room });
    } else {
      // route to edit team for this room
      this.router.navigate(
        [
          "/fantasy/my-matches/cricket",
          this.match.eventId,
          room._id,
          "editTeam"
        ],
        {
          relativeTo: this.activatedRoute
        }
      );
    }
  }
}
