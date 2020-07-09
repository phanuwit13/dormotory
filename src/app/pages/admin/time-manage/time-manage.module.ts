import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TimeManageRoutingModule } from "./time-manage-routing.module";
import { TimeManageComponent } from "./time-manage.component";

@NgModule({
  declarations: [TimeManageComponent],
  imports: [CommonModule, TimeManageRoutingModule, SharedModules],
})
export class TimeManageModule {}
