import { Injectable } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  Params,
  ActivatedRouteSnapshot
} from "@angular/router";

import { filter } from "rxjs/operators";
import { Subject } from "rxjs";

export interface RouteInfo {
  url: string;
  queryParams: Params;
  params: Params;
  data: any;
}

@Injectable({
  providedIn: "root"
})
export class RouterService {
  private state$: Subject<RouteInfo> = new Subject();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  listen() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const { url } = event;

        let state: ActivatedRouteSnapshot = this.activatedRoute.snapshot;
        while (state.firstChild) {
          state = state.firstChild;
        }

        const { queryParams, params, data } = state;

        this.state$.next({ url, queryParams, params, data });
      });
  }

  getRouterState() {
    return this.state$;
  }
}
