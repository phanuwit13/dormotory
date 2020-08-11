import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CheckTimeRoutingModule } from "./check-time-routing.module";
import { CheckTimeComponent } from "./check-time.component";

@NgModule({
  declarations: [CheckTimeComponent],
  imports: [CommonModule, CheckTimeRoutingModule, SharedModules],
})
export class CheckTimeModule {}
