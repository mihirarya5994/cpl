import { HttpClient } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import {
  CoreModule,
  AppService,
  RestService,
  TokenInterceptor,
  ErrorInterceptor
} from "./core";

import { SharedModule } from "./shared/shared.module";

import { AppRoutes } from "./app.routing";

import { environment } from "./../environments/environment";

import { AppComponent } from "./app.component";
import * as fromComponents from "./components";

import { forkJoin } from "rxjs";

export function loadConfig(appService: AppService, restService: RestService) {
  return () =>
    forkJoin(
      restService.get(environment.configUrl),
      restService.get(environment.contentUrl)
    )
      .toPromise()
      .then(res => {
        appService.setConfig(res[0]);
        appService.setContentConfig(res[1]);
      });
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/");
}

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AppRoutes,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      multi: true,
      deps: [AppService, RestService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  declarations: [AppComponent, ...fromComponents.components],
  bootstrap: [AppComponent]
})
export class AppModule {}
