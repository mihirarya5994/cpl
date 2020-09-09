import { Injectable } from '@angular/core';

import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import { UtilService } from './util.service';

declare let digitalData: any;
declare const _satellite: any;

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  public campaignData = null;

  constructor(
    private logger: LoggerService,
    private appService: AppService,
    private authService: AuthService,
    private utilService: UtilService
  ) {
    const utmSource = this.utilService.getQueryParamByName('utm_source');
    const utmMedium = this.utilService.getQueryParamByName('utm_medium');
    const utmCampaign = this.utilService.getQueryParamByName('utm_campaign');
    const utmContent = this.utilService.getQueryParamByName('utm_content');
    const utmTerm = this.utilService.getQueryParamByName('utm_term');

    if (utmSource || utmMedium || utmCampaign || utmContent || utmTerm) {
      this.campaignData = { utmSource, utmMedium, utmCampaign, utmContent, utmTerm };
    }
  }

  tracePageLoad(pageName, extras?) {
    try {
      digitalData = {
        page: {
          pageName,
          pageInfo: {
            appName: this.appService.getConfigParam('APP_NAME')
          }
        },
        user: {
          bpid: this.authService.getAuthInfo().customerId
        },
        journey: {
          journeyType: this.appService.getConfigParam('APP_NAME')
        }
      };

      if (extras) {
        digitalData = { ...digitalData, ...extras };
      }
      _satellite.track('pageLoad');
    } catch (e) {
      this.logger.error('Error tracing : ', e);
    }
  }

  trackLink(linkName, linkPosition, linkType, extras?) {
    try {
      digitalData = { link: { linkName, linkPosition, linkType } };
      if (extras) {
        digitalData = { ...digitalData, ...extras };
      }
      _satellite.track('linkTracking');
    } catch (e) {
      this.logger.error('Error tracing : ', e);
    }
  }
}
