import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-caps',
  templateUrl: './caps.component.html',
  styleUrls: ['./caps.component.scss']
})
export class CapsComponent {
  @Input() team: any = {};
}
