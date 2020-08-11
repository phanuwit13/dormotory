import { SharedModules } from "./../../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DefaultStudentRoutingModule } from "./default-student-routing.module";
import { DefaultStudentComponent } from "./default-student.component";

@NgModule({
  declarations: [DefaultStudentComponent],
  imports: [CommonModule, DefaultStudentRoutingModule, SharedModules],
})
export class DefaultStudentModule {}
