import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataCardComponent } from './data-card.component';

const routes: Routes = [{ path: '', component: DataCardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataCardRoutingModule { }
