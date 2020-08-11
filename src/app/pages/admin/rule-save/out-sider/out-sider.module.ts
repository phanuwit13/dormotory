import { SharedModules } from "./../../../../Shared-Modules";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OutSiderRoutingModule } from "./out-sider-routing.module";
import { OutSiderComponent } from "./out-sider.component";

@NgModule({
  declarations: [OutSiderComponent],
  imports: [CommonModule, OutSiderRoutingModule, SharedModules],
})
export class OutSiderModule {}
