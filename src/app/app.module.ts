import { HttpService } from "./services/http.service";
import { SharedModules } from "./Shared-Modules";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ManageTimeComponent } from "./components/home/manage-time/manage-time.component";
import { StatComponent } from "./components/home/stat/stat.component";
import { SaveRuleComponent } from "./components/home/save-rule/save-rule.component";
import { StatRuleComponent } from "./components/home/stat-rule/stat-rule.component";
import { ManageDataComponent } from "./components/home/manage-data/manage-data.component";
import { AddtimeComponent } from "./components/home/addtime/addtime.component";
import { NgxPaginationModule } from "ngx-pagination";
import { DataCardComponent } from "./components/home/data-card/data-card.component";
import { DataImportComponent } from "./components/home/data-import/data-import.component";
import { RoomHistoryComponent } from "./components/home/room-history/room-history.component";
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ManageTimeComponent,
    StatComponent,
    SaveRuleComponent,
    StatRuleComponent,
    ManageDataComponent,
    AddtimeComponent,
    DataCardComponent,
    DataImportComponent,
    RoomHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModules,
    BrowserAnimationsModule,
    NgxPaginationModule,
  ],
  providers: [HttpService],
  bootstrap: [AppComponent],
})
export class AppModule {}
