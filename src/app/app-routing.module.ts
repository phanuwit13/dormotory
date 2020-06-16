import { DataImportComponent } from "./components/home/data-import/data-import.component";
import { CheckLoginGuard } from "./guard/check-login.guard";
import { RoomHistoryComponent } from "./components/home/room-history/room-history.component";
import { DataCardComponent } from "./components/home/data-card/data-card.component";
import { AddtimeComponent } from "./components/home/addtime/addtime.component";
import { StatRuleComponent } from "./components/home/stat-rule/stat-rule.component";
import { SaveRuleComponent } from "./components/home/save-rule/save-rule.component";
import { StatComponent } from "./components/home/stat/stat.component";
import { ManageTimeComponent } from "./components/home/manage-time/manage-time.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CardGenComponent } from "./components/home/card-gen/card-gen.component";

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
      { path: "", component: DataCardComponent },
      { path: "card_data", component: DataCardComponent },
      { path: "room_history", component: RoomHistoryComponent },
      { path: "manage_time", component: ManageTimeComponent },
      { path: "stat_time", component: StatComponent },
      { path: "save_rule", component: SaveRuleComponent },
      { path: "stat_rule", component: StatRuleComponent },
      { path: "import_data", component: DataImportComponent },
    ],
  },
  {
    path: "addtime",
    component: AddtimeComponent,
    canActivate: [CheckLoginGuard],
  },
  {
    path: "gencard",
    component: CardGenComponent,
    canActivate: [CheckLoginGuard],
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/home/card_data",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
