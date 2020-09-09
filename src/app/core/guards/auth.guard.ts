import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";

import { of } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";

import {
  AuthService,
  UtilService,
  ExternalInterfaceService
} from "./../services";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private externalInterfaceService: ExternalInterfaceService,
    private authService: AuthService,
    private utilService: UtilService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, snapshot: RouterStateSnapshot) {
    if (this.authService.getIsAuthenticated()) {
      return true;
    }
    return this.authService.login().pipe(
      switchMap(() => {
        if (this.utilService.getQueryParamByName("redirectFrom") === "jcpa") {
          this.router.navigate(["/fantasy"]);
        }
        return of(true);
      }),
      catchError(() => {
        this.externalInterfaceService.requestJWT();
        return of(false);
      })
    );
  }
}
