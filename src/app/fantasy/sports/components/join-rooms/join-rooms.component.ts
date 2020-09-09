import {
  EventEmitterService,
  EventData
} from "./../../../../core/services/event-emitter.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { switchMap, tap } from "rxjs/operators";

import { SportsService, TrackerService, AnalyticsService } from "src/app/core";

import { TeamCreationService } from "../../services";

import { TossComponent } from "../toss/toss.component";

@Component({
  selector: "app-join-rooms",
  templateUrl: "./join-rooms.component.html",
  styleUrls: ["./join-rooms.component.scss"]
})
export class JoinRoomsComponent implements OnInit {
  @ViewChild("toss", { static: false }) tossComponent: TossComponent;
  params: ParamMap;
  rooms: any[];
  match;
  team: any = {};
  joinedRooms = 0;
  showRoomsLimitReachedPopup = false;
  showNoMorePointsPopup = false;
  showNoTossSelectionPopup = false;

  showRoomJoinConfirmationDialog = false;
  loading = true;
  showJoinRoomptionspopup = false;
  selctedRoom;
  confirming = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sportsService: SportsService,
    private teamCreationService: TeamCreationService,
    private trackerService: TrackerService,
    private analyticsService: AnalyticsService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.analyticsService.pageLoad(null, "SS | Rooms Page");
    this.teamCreationService.clear();
    this.team = this.teamCreationService.getTeam();

    this.getCurrentMatch();

    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === "AD_CLOSED") {
        this.match = this.teamCreationService.getCurrentMatch();
        this.createTeam();
      }
    });

    this.teamCreationService.getTeamUpdates().subscribe(team => {
      this.team = team;
    });
  }

  getCurrentMatch() {
    this.activatedRoute.paramMap
      .pipe(
        tap(params => (this.params = params)),
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
        this.getRooms();
      });
  }

  getRooms() {
    this.sportsService.getAllRooms(this.match.eventId).subscribe(rooms => {
      this.rooms = rooms;
      this.sportsService.getUserRooms(this.match.eventId).subscribe(res => {
        if (res && res.length) {
          this.joinedRooms = res.length;
          const joinedRoomIds = res.map(room => room._id);
          rooms.forEach(
            room => (room.joined = joinedRoomIds.includes(room._id))
          );
        }
        this.loading = false;
      });
    });
  }

  initiateJoin(room) {
    if (this.joinedRooms >= 5) {
      this.showRoomsLimitReachedPopup = true;
    } else {
      this.teamCreationService.setCurrentRoom(room);
    }
  }

  predictToss(team) {
    this.teamCreationService.predictToss(team);
  }

  toggleNotificationDialog() {
    this.showRoomsLimitReachedPopup = !this.showRoomsLimitReachedPopup;
  }

  toggleShowNoMorePointsPopup(trackOKClick = false) {
    this.showNoMorePointsPopup = !this.showNoMorePointsPopup;
    if (this.showNoMorePointsPopup) {
      this.analyticsService.clickTrack(
        "Low Points Pop-up",
        "SS | Low Points Pop-up"
      );
    }
    if (trackOKClick) {
      this.analyticsService.clickTrack("OK", "SS | Low Points Pop-up");
    }
  }

  toggleShowNoTossSelectionPopup() {
    this.showNoTossSelectionPopup = !this.showNoTossSelectionPopup;
  }

  toggleConfirmationDialog() {
    this.showRoomJoinConfirmationDialog = !this.showRoomJoinConfirmationDialog;
    if (this.showRoomJoinConfirmationDialog) {
      this.analyticsService.clickTrack(
        "Join Room Confirmation Pop-up",
        "SS | Rooms Page"
      );
    }
  }

  toggleOpenRoomOptionPopup() {
    this.showJoinRoomptionspopup = !this.showJoinRoomptionspopup;
    if (this.showJoinRoomptionspopup) {
      this.analyticsService.clickTrack(
        "Room Join Pop-up",
        "SS | Room Join Pop-up"
      );
    }
  }

  cancelJoining() {
    this.toggleConfirmationDialog();
  }

  joinRoom(room) {
    this.selctedRoom = room;
    this.teamCreationService.setCurrentRoom(this.selctedRoom);
    this.analyticsService.clickTrack("Join Room", "SS | RoomsPage", {
      match: `${this.match.teams[0].name} vs ${this.match.teams[1].name}`,
      room: this.teamCreationService.getCurrentRoom()._id
    });
    this.eventEmitterService.emit({
      type: "SHOW_FULL_AD",
      data: {
        contextName: "INSTREAM_ROOM_JOIN",
        value: "CREATE_TEAM_PATH",
        adType: "instreamVideo"
      }
    });
  }

  createTeam() {
    if (this.match.userTeamId) {
      this.toggleOpenRoomOptionPopup();
    } else {
      this.createTeamManually();
    }
  }

  createTeamManually( trace = false) {
    if (this.showJoinRoomptionspopup) {
      this.toggleOpenRoomOptionPopup();
    }
    if (trace) {
      this.analyticsService.clickTrack("Create New", "SS | Room Join Pop-up");
    }
    this.createTeamAndJoinRoom();
  }

  joinWithExistingTeam() {
    this.analyticsService.clickTrack(
      "Join With Existing",
      "SS | Room Join Pop-up"
    );
    this.router.navigate(
      ["/fantasy/cricket", this.match.id, "join-with-existing"],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  createTeamAndJoinRoom() {
    this.router.navigate(
      ["/fantasy/cricket", this.match.eventId, "createTeam", "1"],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  joinAnotherRoom(room) {
    if (this.joinedRooms >= 5) {
      this.showRoomsLimitReachedPopup = true;
    } else {
      this.teamCreationService.joinRoom(room).subscribe(
        res => {
          this.joinedRooms++;
          this.router.navigate(["/fantasy/my-matches"]);
        },
        err => {
          if (err) {
            this.toggleShowNoMorePointsPopup();
          }
        }
      );
    }
  }
}
