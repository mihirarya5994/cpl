import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import * as fromComponents from './components';
import * as fromPipes from './pipes';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  declarations: [...fromComponents.components, ...fromPipes.pipes],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ...fromComponents.components,
    ...fromPipes.pipes
  ]
})
export class SharedModule {}
