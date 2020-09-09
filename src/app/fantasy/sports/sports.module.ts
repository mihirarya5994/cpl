import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared.module";

import * as fromComponents from "./components";
import * as fromPipes from "./pipes";
import * as fromServies from "./services";

import { SportsComponent } from "./sports.component";
import { SportsRoutes } from "./sports.routing";
import { JoinWithExistingTeamComponent } from "./components/join-with-existing-team/join-with-existing-team.component";

@NgModule({
  imports: [SharedModule, SportsRoutes],
  declarations: [
    SportsComponent,
    ...fromComponents.components,
    ...fromPipes.pipes,
    JoinWithExistingTeamComponent
  ],
  providers: [...fromServies.services]
})
export class SportsModule {}
