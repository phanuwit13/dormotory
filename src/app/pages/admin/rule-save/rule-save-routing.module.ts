import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuleSaveComponent } from './rule-save.component';

const routes: Routes = [{ path: '', component: RuleSaveComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RuleSaveRoutingModule { }
