import { Routes, RouterModule } from "@angular/router";

import { SportsComponent } from "./sports.component";

import {
  SportsViewComponent,
  CreateTeamStep1Component,
  CreateTeamStep2Component,
  JoinRoomsComponent,
  MyMatchesComponent,
  TeamViewComponent,
  EditTeamComponent,
  RoomDetailsComponent
} from "./components";
import { JoinWithExistingTeamComponent } from "./components/join-with-existing-team/join-with-existing-team.component";

const routes: Routes = [
  {
    path: "",
    component: SportsComponent,
    children: [
      { path: "my-matches", component: MyMatchesComponent },
      {
        path: "my-matches/:sportId/:eventId/rooms/:roomId",
        component: RoomDetailsComponent
      },
      {
        path: "my-matches/:sportId/:eventId/:roomId/viewTeam",
        component: TeamViewComponent,
        data: { backTo: "/fantasy/my-matches", showFooter: false }
      },
      {
        path: "my-matches/:sportId/:eventId/:roomId/editTeam",
        component: EditTeamComponent,
        data: { backTo: "/fantasy", showFooter: false }
      },

      {
        path: "my-matches/:sportId/:eventId/:roomId/editTeam/:teamId",
        component: EditTeamComponent,
        data: { backTo: "/fantasy", showFooter: false }
      },
      { path: ":sportId/:eventId/rooms", component: JoinRoomsComponent },
      {
        path: ":sportId/:eventId/team",
        component: TeamViewComponent,
        data: { showFooter: false }
      },

      {
        path: ":sportId/:eventId/team/:userTeamId",
        component: TeamViewComponent,
        data: { showFooter: false }
      },

      { path: ":sportId", component: SportsViewComponent },
      {
        path: ":sportId/:eventId/createTeam/1/:activeType",
        component: CreateTeamStep1Component,
        data: { backTo: "/fantasy", showFooter: false }
      },
      {
        path: ":sportId/:eventId/createTeam/1",
        component: CreateTeamStep1Component,
        data: { backTo: "/fantasy", showFooter: false }
      },
      {
        path: ":sportId/:eventId/createTeam/2",
        component: CreateTeamStep2Component,
        data: { backTo: "/fantasy", showFooter: false }
      },
      { path: "", component: SportsViewComponent },
      {
        path: ":sportId/:eventId/join-with-existing",
        component: JoinWithExistingTeamComponent,
        data: { backTo: "/fantasy", showFooter: false }
      }
    ]
  }
];

export const SportsRoutes = RouterModule.forChild(routes);
