import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomHistoryComponent } from './room-history.component';

const routes: Routes = [{ path: '', component: RoomHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomHistoryRoutingModule { }
