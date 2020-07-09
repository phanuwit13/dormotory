import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TimeStatRoutingModule } from "./time-stat-routing.module";
import { TimeStatComponent } from "./time-stat.component";

@NgModule({
  declarations: [TimeStatComponent],
  imports: [CommonModule, TimeStatRoutingModule, SharedModules],
})
export class TimeStatModule {}
