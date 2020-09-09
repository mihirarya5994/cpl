import { Component, Input, Output, EventEmitter } from "@angular/core";

import { IMatch } from "../../../models";

@Component({
  selector: "app-match-list",
  templateUrl: "./match-list.component.html",
  styleUrls: ["./match-list.component.scss"]
})
export class MatchListComponent {
  @Input() matches: IMatch[] = [];
  @Input() type;
  @Input() contextName;
  @Output() selection: EventEmitter<Object> = new EventEmitter();
  @Output() joinRoom: EventEmitter<any> = new EventEmitter();
  @Output() showRoom: EventEmitter<any> = new EventEmitter();

  selectMatch(match: IMatch) {
    this.selection.emit(match);
  }

  joinAnotherRoom(match) {
    this.joinRoom.emit(match);
  }

  showRoomDetails({ match, room }) {
    this.showRoom.emit({ match, room });
  }
}
