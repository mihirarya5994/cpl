import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { interval, Subscription } from "rxjs";

import { AppService, PlayersService } from "src/app/core";
import { TeamCreationService } from "../../services";

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.scss"]
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  private params: ParamMap;
  private subscription: Subscription = new Subscription();
  leaderboard = [];
  myLeaderboard;
  joinedParticipants = 0;
  match;
  loading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private playersService: PlayersService,
    private teamCreationService: TeamCreationService
  ) {}

  ngOnInit() {
    this.match = this.teamCreationService.getCurrentMatch();
    this.activatedRoute.paramMap.subscribe(params => {
      this.params = params;
      this.updateLeaderboard();
    });
    this.subscription.add(
      interval(
        this.appService.getConfigParam("LEADERBOARD_REFRESH_INTERVAL")
      ).subscribe(() => this.updateLeaderboard())
    );
  }

  updateLeaderboard() {
    this.getLeaderboardStats().subscribe((res: any) => {
      this.joinedParticipants = res.joinedParticipants || [];
      this.leaderboard = res.topRecords || [];
      this.leaderboard.forEach(row => {
        if (row.img) {
          const avatar = this.appService
            .getContentConfig()
            .avatars.filter(a => a.id === row.img);
          if (avatar[0]) {
            row["avatarImg"] = avatar[0].imgUrl;
          }
        }
      });
      this.getUserRank();
      this.loading = false;
    });
  }

  getLeaderboardStats() {
    return this.playersService.getLeaderboardStats(
      this.params.get("roomId"),
      this.match.eventId
    );
  }

  getUserRank() {
    this.playersService
      .getUserRank(this.params.get("roomId"), this.match.eventId)
      .subscribe(res => {
        this.myLeaderboard = res;
        if (res.img) {
          this.myLeaderboard[
            "avatarImg"
          ] = this.appService
            .getContentConfig()
            .avatars.filter(a => a.id === res.img)[0].imgUrl;
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
