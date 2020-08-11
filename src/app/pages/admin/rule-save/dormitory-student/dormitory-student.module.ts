import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModules } from "../../../../Shared-Modules";
import { DormitoryStudentRoutingModule } from "./dormitory-student-routing.module";
import { DormitoryStudentComponent } from "./dormitory-student.component";

@NgModule({
  declarations: [DormitoryStudentComponent],
  imports: [CommonModule, DormitoryStudentRoutingModule, SharedModules],
})
export class DormitoryStudentModule {}
