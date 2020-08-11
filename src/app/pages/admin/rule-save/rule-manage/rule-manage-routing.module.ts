import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuleManageComponent } from './rule-manage.component';

const routes: Routes = [{ path: '', component: RuleManageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleManageRoutingModule { }
