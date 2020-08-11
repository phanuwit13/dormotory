import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckTimeComponent } from './check-time.component';

const routes: Routes = [{ path: '', component: CheckTimeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckTimeRoutingModule { }
