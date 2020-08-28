import { SharedModules } from "./../../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ImportExcelRoutingModule } from "./import-excel-routing.module";
import { ImportExcelComponent } from "./import-excel.component";

@NgModule({
  declarations: [ImportExcelComponent],
  imports: [CommonModule, ImportExcelRoutingModule, SharedModules],
})
export class ImportExcelModule {}
