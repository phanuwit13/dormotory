import { SharedModules } from "./../../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ImportBranchRoutingModule } from "./import-branch-routing.module";
import { ImportBranchComponent } from "./import-branch.component";

@NgModule({
  declarations: [ImportBranchComponent],
  imports: [CommonModule, ImportBranchRoutingModule, SharedModules],
})
export class ImportBranchModule {}
