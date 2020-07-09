import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RuleSaveRoutingModule } from "./rule-save-routing.module";
import { RuleSaveComponent } from "./rule-save.component";

@NgModule({
  declarations: [RuleSaveComponent],
  imports: [CommonModule, RuleSaveRoutingModule, SharedModules],
})
export class RuleSaveModule {}
