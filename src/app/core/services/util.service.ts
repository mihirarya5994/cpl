import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private specialCharacters = /([`~!@#$%^&*()_+=\[\]{}\\|'";:\/?.>,<])/g;
  private queryParams = new URLSearchParams(window.location.search);

  getParameterByName(name, url?) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  getQueryParamByName(name) {
    return this.queryParams.get(name);
  }

  sanitize(input: string) {
    return input.replace(this.specialCharacters, '');
  }

  clone(val) {
    return JSON.parse(JSON.stringify(val));
  }

  parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
