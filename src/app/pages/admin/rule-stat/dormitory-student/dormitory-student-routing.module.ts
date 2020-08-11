import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DormitoryStudentComponent } from './dormitory-student.component';

const routes: Routes = [{ path: '', component: DormitoryStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DormitoryStudentRoutingModule { }
