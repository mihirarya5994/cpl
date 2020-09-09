import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {
  SportsService,
  EventEmitterService,
  AnalyticsService
} from "src/app/core";
import { switchMap, tap } from "rxjs/operators";
import { PLAYERS } from "src/app/constants";
import { TeamCreationService } from "../../services";

@Component({
  selector: "app-join-with-existing-team",
  templateUrl: "./join-with-existing-team.component.html",
  styleUrls: ["./join-with-existing-team.component.scss"]
})
export class JoinWithExistingTeamComponent implements OnInit {
  teams;
  params;
  confirming = false;

  players = PLAYERS;
  isTeamSelected = false;
  selectedTeam;
  selectedRoom;
  showRoomJoinConfirmationDialog = false;
  showPointsInsufficientPopup = false;
  constructor(
    private sportsService: SportsService,
    private activatedRoute: ActivatedRoute,
    private teamCrezationService: TeamCreationService,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | Existing Teams Page");
    this.params = this.activatedRoute.snapshot.params;
    this.selectedRoom = this.teamCrezationService.getCurrentRoom();
    this.activatedRoute.paramMap
      .pipe(
        tap(params => (this.params = params)),
        switchMap(params =>
          this.sportsService.getUserTeams(
            params.get("sportId"),
            params.get("eventId")
          )
        )
      )
      .subscribe(teams => {
        this.teams = teams;
      });
  }

  selectTeam(team) {
    this.isTeamSelected = true;
    this.selectedTeam = team;
    this.teams.forEach(team => {
      team.selected = false;
    });
    team.selected = true;
  }

  joinRoom() {
    if (!this.confirming) {
      this.confirming = true;
      this.sportsService
        .joinRoomWithExisting(
          this.params.params.sportId,
          this.params.params.eventId,
          this.selectedRoom._id,
          this.selectedTeam._id
        )
        .subscribe((res: any) => {
          if (res.customCode === 407) {
            this.toogleROmmPointsPopup();
          } else {
            this.teamCrezationService.clear();
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
        });
    }
  }

  teamPreview(team) {
    this.analyticsService.clickTrack("Preview", "SS | Existing Teams Page");
    this.router.navigate([
      "/fantasy/cricket",
      this.params.params.eventId,
      "team",
      team._id
    ]);
  }

  toogleROmmPointsPopup() {
    this.showPointsInsufficientPopup = !this.showPointsInsufficientPopup;
  }

  close() {
    this.toogleROmmPointsPopup();
    this.router.navigate(["/fantasy"]);
  }

  toggleConfirmationDialog() {
    this.showRoomJoinConfirmationDialog = !this.showRoomJoinConfirmationDialog;
    if (this.showRoomJoinConfirmationDialog) {
      this.analyticsService.clickTrack("Join Room", "SS | Existing Teams Page");
    }
  }

  cancelJoining() {
    this.toggleConfirmationDialog();
  }

  createTeamAndJoinRoom() {
    this.joinRoom();
  }
}
