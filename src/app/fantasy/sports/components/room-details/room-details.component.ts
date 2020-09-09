import {
  Component,
  OnInit,
  NgZone,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { Subscription } from "rxjs";

import {
  AppService,
  UtilService,
  GameService,
  GameState,
  AuthService,
  AnalyticsService
} from "src/app/core";

import { TeamCreationService } from "../../services";

@Component({
  selector: "app-room-details",
  templateUrl: "./room-details.component.html",
  styleUrls: ["./room-details.component.scss"]
})
export class RoomDetailsComponent implements OnInit, OnDestroy {
  private match;
  private roomID;
  private params: ParamMap;
  private subscription: Subscription = new Subscription();
  @ViewChild("ROOMDETAILS", { static: true }) VIDEOAD: ElementRef;
  @ViewChild("LEADERBOARD", { static: true }) STATICAD: ElementRef;
  gameState: GameState;
  selectedType = "ROOMDETAILS";
  tabs = [
    {
      index: 1,
      id: "ROOMDETAILS",
      name: "Room Details"
    },
    {
      index: 1,
      id: "LEADERBOARD",
      name: "Leaderboard"
    }
  ];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private authService: AuthService,
    private teamCreationService: TeamCreationService,
    private gameService: GameService,
    private zone: NgZone,
    private utilService: UtilService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | Room Details Page");
    this.activatedRoute.paramMap.subscribe(params => {
      this.params = params;
      this.roomID = this.params.get("roomId");
      this.gameState = new GameState();
      this.match = this.teamCreationService.getCurrentMatch();
      this.gameService.initialize(this.match);
      this.subscription.add(
        this.gameService
          .getGameEventsStream()
          .subscribe(this.handleGameUpdates.bind(this))
      );
    });
  }

  handleGameUpdates(state: GameState) {
    this.zone.run(() => {
      this.gameState = this.utilService.clone(state);
    });
  }

  showMyTeam(tracekey) {
    this.analyticsService.clickTrack(tracekey, "SS | RoomsPage", {
      match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}`,
      room: this.params.get("roomId")
    });
    this.router.navigate(
      [
        "/fantasy/my-matches/cricket",
        this.match.eventId,
        this.params.get("roomId"),
        "viewTeam"
      ],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  showPlayerStats() {}

  playIpl(tracekey) {
    this.analyticsService.clickTrack(tracekey, "SS | RoomsPage", {
      match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}`,
      room: this.params.get("roomId")
    });
    location.href = `${this.appService.getConfigParam("JCPA_URL")}`;
  }

  setTab(tabID, tracekey) {
    this.analyticsService.clickTrack(tracekey, "SS | RoomsPage", {
      match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}`,
      room: this.params.get("roomId")
    });
    this.selectedType = tabID;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.gameService.dispose();
  }
}
