import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeManageComponent } from './time-manage.component';

const routes: Routes = [{ path: '', component: TimeManageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeManageRoutingModule { }
