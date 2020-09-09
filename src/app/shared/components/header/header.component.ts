import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
import { Subscription } from "rxjs";

import {
  AppService,
  ExternalInterfaceService,
  EventEmitterService,
  GameService,
  ProfileService,
  RestService,
  GameState,
  EventData,
  AuthService
} from "src/app/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  data = {
    score: 0,
    participantsCount: 0,
    level: 0,
    avatarImg: "default_male.jpg"
  };
  cProfileScore = 0;
  shouldExit = true;
  backToHome = false;
  subscriptions: Subscription[] = [];
  isTeampreview = false;
  isMatchLive = false;

  showExitpopup = false;
  constructor(
    private router: Router,
    private location: Location,
    private appService: AppService,
    private restService: RestService,
    private externalInterfaceService: ExternalInterfaceService,
    private gameService: GameService,
    private profileService: ProfileService,
    private eventEmitterService: EventEmitterService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.shouldExit = event.url === "/fantasy";
          this.backToHome = event.url === "/fantasy/my-matches";
          this.getParticipantsCount();
          this.getScore();
        }
      })
    );

    this.subscriptions.push(
      this.eventEmitterService.subscribe((event: EventData) => {
        if (event.type === "UPDATE_POINTS_WITH_CENTRAL_SERVER") {
          // this.syncPointsWithCentralProfile();
          this.getScore();
        } else if (event.type === "TEAM_PREVIEW") {
          this.isTeampreview = true;
          if (event.data === "live") {
            this.isMatchLive = true;
          }
        } else if (event.type === "NOT_TEAM_PREVIEW") {
          this.isTeampreview = false;
          this.isMatchLive = false;
        } else if (event.type === "NATIVE_BACK_CLICKED") {
          this.back();
        }
      })
    );

    // this.syncPointsWithCentralProfile();
    this.getScore();
    this.getParticipantsCount();
    this.setProfileImg();
  }

  syncPointsWithCentralProfile() {
    this.profileService.getProfile().subscribe(cProfile => {
      this.cProfileScore = cProfile.totalPoints;
      this.getScore();
    });
  }

  calculateTotalPoints() {}

  handleGameUpdates(state: GameState) {
    this.data.score = state.userScore;
    this.data.participantsCount = state.participantsCount;
    this.data.level = state.userLevel;
  }

  refreshPlayerPoints() {
    this.eventEmitterService.emit({
      type: "REFRESH_PLAYER_POIMTS",
      data: null
    });
  }

  setProfileImg() {
    const profile = this.profileService.getProfileSync();
    if (profile.avatar) {
      this.data.avatarImg = this.appService
        .getContentConfig()
        .avatars.filter(a => a.id === profile.avatar)[0].imgUrl;
    }
  }

  getScore() {
    return this.profileService.getServerProfile().subscribe(res => {
      this.data.score = this.cProfileScore + res.score;
    });
  }

  getParticipantsCount() {
    this.restService
      .get(
        this.appService.getConfigParam("PARTICIPANT_API_HOST") +
          "/stats/seasonalplayers"
      )
      .subscribe(res => {
        this.data.participantsCount = res.user_count;
      });
  }

  playIpl() {
    location.href = `${this.appService.getConfigParam("JCPA_URL")}`;
  }

  back() {
    if (this.shouldExit) {
      this.showExitpopup = true;
      // this.externalInterfaceService.close();
    } else if (this.backToHome) {
      this.router.navigate(["/fantasy"]);
    } else {
      this.location.back();
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  handleExitPopupAction(action) {
    switch (action) {
      case "cancel":
        this.showExitpopup = false;
        break;

      case "confirm":
        this.externalInterfaceService.close();
        break;
    }
  }
}
