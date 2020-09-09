import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { PrizesComponent } from './prizes.component';

import { PrizesRoutes } from './prizes.routing';

@NgModule({
  imports: [SharedModule, PrizesRoutes],
  declarations: [PrizesComponent]
})
export class PrizesModule {}
