import { Routes, RouterModule } from '@angular/router';

import { PrizesComponent } from './prizes.component';

const routes: Routes = [
  {
    path: '',
    component: PrizesComponent
  }
];

export const PrizesRoutes = RouterModule.forChild(routes);
