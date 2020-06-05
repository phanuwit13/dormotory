import { CheckLoginGuard } from "./guard/check-login.guard";
import { RoomHistoryComponent } from "./components/home/room-history/room-history.component";
import { DataCardComponent } from "./components/home/data-card/data-card.component";
import { AddtimeComponent } from "./components/home/addtime/addtime.component";
import { ImportdataComponent } from "./components/home/importdata/importdata.component";
import { StatRuleComponent } from "./components/home/stat-rule/stat-rule.component";
import { SaveRuleComponent } from "./components/home/save-rule/save-rule.component";
import { StatComponent } from "./components/home/stat/stat.component";
import { ManageTimeComponent } from "./components/home/manage-time/manage-time.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [CheckLoginGuard],
    children: [
      { path: "card", component: DataCardComponent },
      { path: "room-history", component: RoomHistoryComponent },
      { path: "manage-time", component: ManageTimeComponent },
      { path: "stat", component: StatComponent },
      { path: "rule", component: SaveRuleComponent },
      { path: "stat-rule", component: StatRuleComponent },
      { path: "import", component: ImportdataComponent },
    ],
  },
  {
    path: "addtime",
    component: AddtimeComponent,
    canActivate: [CheckLoginGuard],
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
