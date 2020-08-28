import { SharedModules } from "./../../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ImportStudentRoutingModule } from "./import-student-routing.module";
import { ImportStudentComponent } from "./import-student.component";

@NgModule({
  declarations: [ImportStudentComponent],
  imports: [CommonModule, ImportStudentRoutingModule, SharedModules],
})
export class ImportStudentModule {}
