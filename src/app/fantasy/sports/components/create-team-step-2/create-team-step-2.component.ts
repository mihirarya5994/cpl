import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { TeamCreationService } from "../../services";
import {
  LoggerService,
  EventEmitterService,
  TrackerService,
  AnalyticsService
} from "src/app/core";

@Component({
  selector: "app-create-team-step-2",
  templateUrl: "./create-team-step-2.component.html",
  styleUrls: ["./create-team-step-2.component.scss"]
})
export class CreateTeamStep2Component implements OnInit {
  match: any = {};
  team: any = {};
  room: any = {};
  showConfirmationDialog = false;
  confirming = false;
  showPointsInsufficientPopup = false;
  constructor(
    private router: Router,
    private teamCreationService: TeamCreationService,
    private logger: LoggerService,
    private eventEmitterService: EventEmitterService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.match = this.teamCreationService.getCurrentMatch();
    this.team = this.teamCreationService.getTeam();
    this.room = this.teamCreationService.getCurrentRoom();

    this.teamCreationService.getTeamUpdates().subscribe(team => {
      this.team = team;
    });
  }

  appointCaptains(event) {
    this.teamCreationService.appointCaptains(event);
  }

  toggleConfirmationDialog() {
    if (this.team.eventId) {
      this.confirm();
      return;
    }
    this.showConfirmationDialog = !this.showConfirmationDialog;
  }

  createTeamAndJoinRoom(room) {
    if (!this.confirming) {
      this.confirming = true;
      this.teamCreationService.createTeam(room).subscribe(
        (res: any) => {
          if (res.customCode === 407) {
            this.toogleROmmPointsPopup();
          } else {
            this.analyticsService.clickTrack(
              "Join Room",
              "SS | Join Room Confirmation Pop-up",
              {
                match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}`,
                room: this.teamCreationService.getCurrentRoom()._id
              }
            );
            this.teamCreationService.clear();
            this.eventEmitterService.emit({
              type: "SHOW_FULL_AD",
              data: { contextName: "JOIN_ROOM_CONFIRMATION" }
            });
            this.eventEmitterService.emit({
              type: "UPDATE_POINTS_WITH_CENTRAL_SERVER",
              data: null
            });
            this.confirming = false;
            this.router.navigate(["/fantasy/my-matches"]);
          }
        },
        err => {
          this.confirming = false;
          this.logger.log(err.error.message);
        }
      );
    }
  }

  cancelJoining() {
    this.toggleConfirmationDialog();
    this.analyticsService.clickTrack(
      "Cancel",
      "SS | Join Room Confirmation Pop-up",
      {
        match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}`,
        room: this.teamCreationService.getCurrentRoom()._id
      }
    );
  }

  toogleROmmPointsPopup() {
    this.showPointsInsufficientPopup = !this.showPointsInsufficientPopup;
  }

  close() {
    this.toogleROmmPointsPopup();
    this.router.navigate(["/fantasy"]);
  }

  confirm() {
    this.analyticsService.clickTrack("Done", "SS | Captain Selection Page");
    // if (this.match.userTeamId) {
    this.teamCreationService.editTeam().subscribe(() => {
      this.teamCreationService.clear();
      this.router.navigate(["/fantasy/my-matches"]);
    });
    // }
    //  else {
    //   this.router.navigate(['/fantasy/', this.match.gameType, this.match.eventId, 'rooms']);
    // }
  }
}
