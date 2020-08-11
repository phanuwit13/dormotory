import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutSiderComponent } from './out-sider.component';

const routes: Routes = [{ path: '', component: OutSiderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutSiderRoutingModule { }
