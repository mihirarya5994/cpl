import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";

import { FantasyComponent } from "./fantasy.component";
import { ProfileComponent } from "./profile/profile.component";
import { SettingsComponent } from "./settings/settings.component";
import { AvatarSelectionComponent } from "./profile/avatar-selection/avatar-selection.component";

import { FantasyRoutes } from "./fantasy.routing";

@NgModule({
  imports: [SharedModule, FantasyRoutes],
  declarations: [
    FantasyComponent,
    ProfileComponent,
    SettingsComponent,
    AvatarSelectionComponent
  ]
})
export class FantasyModule {}
