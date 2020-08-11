import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultStudentComponent } from './default-student.component';

const routes: Routes = [{ path: '', component: DefaultStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultStudentRoutingModule { }
