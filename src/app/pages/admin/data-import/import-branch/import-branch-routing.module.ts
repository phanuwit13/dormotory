import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportBranchComponent } from './import-branch.component';

const routes: Routes = [{ path: '', component: ImportBranchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportBranchRoutingModule { }
