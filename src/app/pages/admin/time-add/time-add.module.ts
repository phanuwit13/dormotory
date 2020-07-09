import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TimeAddRoutingModule } from "./time-add-routing.module";
import { TimeAddComponent } from "./time-add.component";

@NgModule({
  declarations: [TimeAddComponent],
  imports: [CommonModule, TimeAddRoutingModule, SharedModules],
})
export class TimeAddModule {}
