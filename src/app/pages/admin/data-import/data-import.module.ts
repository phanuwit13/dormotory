import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataImportRoutingModule } from "./data-import-routing.module";
import { DataImportComponent } from "./data-import.component";

@NgModule({
  declarations: [DataImportComponent],
  imports: [CommonModule, DataImportRoutingModule, SharedModules],
})
export class DataImportModule {}
