import { AuthGuard } from "./../core/guards/auth.guard";
import { Routes, RouterModule } from "@angular/router";

import { FantasyComponent } from "./fantasy.component";
import { SettingsComponent } from "./settings/settings.component";
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  {
    path: "",
    component: FantasyComponent,
    children: [
      {
        path: "prizes",
        loadChildren: () =>
          import("./prizes/prizes.module").then(m => m.PrizesModule)
      },
      {
        path: "settings",
        component: SettingsComponent
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: { backTo: "/fantasy/settings", showFooter: true }
      },
      {
        path: "",
        loadChildren: () =>
          import("./sports/sports.module").then(m => m.SportsModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

export const FantasyRoutes = RouterModule.forChild(routes);
