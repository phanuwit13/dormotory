import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RuleStatRoutingModule } from "./rule-stat-routing.module";
import { RuleStatComponent } from "./rule-stat.component";

@NgModule({
  declarations: [RuleStatComponent],
  imports: [CommonModule, RuleStatRoutingModule, SharedModules],
})
export class RuleStatModule {}
