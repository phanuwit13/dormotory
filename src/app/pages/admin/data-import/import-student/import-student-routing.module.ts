import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportStudentComponent } from './import-student.component';

const routes: Routes = [{ path: '', component: ImportStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportStudentRoutingModule { }
