import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private prefix = 'jfl';

  addItem(key, value) {
    localStorage.setItem(`${this.prefix}.${key}`, JSON.stringify(value));
  }

  removeItem(key) {
    localStorage.removeItem(`${this.prefix}.${key}`);
  }

  getItem(key) {
    const item = localStorage.getItem(`${this.prefix}.${key}`);
    return item ? JSON.parse(item) : null;
  }

  clear() {
    localStorage.clear();
  }
}
