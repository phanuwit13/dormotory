import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeAddComponent } from './time-add.component';

const routes: Routes = [{ path: '', component: TimeAddComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeAddRoutingModule { }
