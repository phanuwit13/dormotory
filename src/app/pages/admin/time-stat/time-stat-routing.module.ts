import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeStatComponent } from './time-stat.component';

const routes: Routes = [{ path: '', component: TimeStatComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeStatRoutingModule { }
