import { SharedModules } from "./../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RoomHistoryRoutingModule } from "./room-history-routing.module";
import { RoomHistoryComponent } from "./room-history.component";

@NgModule({
  declarations: [RoomHistoryComponent],
  imports: [CommonModule, RoomHistoryRoutingModule, SharedModules],
})
export class RoomHistoryModule {}
