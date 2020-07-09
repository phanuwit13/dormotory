import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataCardRoutingModule } from "./data-card-routing.module";
import { DataCardComponent } from "./data-card.component";

@NgModule({
  declarations: [DataCardComponent],
  imports: [CommonModule, DataCardRoutingModule, SharedModules],
})
export class DataCardModule {}
