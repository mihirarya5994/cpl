import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./core/guards/auth.guard";

import { SplashComponent } from "./components/splash/splash.component";

const routes: Routes = [
  {
    path: "splash",
    pathMatch: "full",
    component: SplashComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fantasy",
    loadChildren: () =>
      import("./fantasy/fantasy.module").then(m => m.FantasyModule),
    canActivate: [AuthGuard]
  },
  {
    path: "index.html",
    redirectTo: "splash",
    pathMatch: "full"
  },
  {
    path: "",
    redirectTo: "splash",
    pathMatch: "full"
  }
];

export const AppRoutes = RouterModule.forRoot(routes);
