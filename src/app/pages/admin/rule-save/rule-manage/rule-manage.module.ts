import { SharedModules } from "./../../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RuleManageRoutingModule } from "./rule-manage-routing.module";
import { RuleManageComponent } from "./rule-manage.component";

@NgModule({
  declarations: [RuleManageComponent],
  imports: [CommonModule, RuleManageRoutingModule, SharedModules],
})
export class RuleManageModule {}
