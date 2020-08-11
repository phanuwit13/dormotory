import { SharedModules } from "./../../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DormitoryStudentRoutingModule } from "./dormitory-student-routing.module";
import { DormitoryStudentComponent } from "./dormitory-student.component";

@NgModule({
  declarations: [DormitoryStudentComponent],
  imports: [CommonModule, DormitoryStudentRoutingModule, SharedModules],
})
export class DormitoryStudentModule {}
