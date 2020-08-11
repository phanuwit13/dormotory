import { CheckLoginGuard } from "./guard/check-login.guard";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CardGenComponent } from "./components/home/card-gen/card-gen.component";
import { NavComponent } from "./components/nav/nav.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "nav",
    component: NavComponent,
    canActivate: [CheckLoginGuard],
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./pages/admin/data-card/data-card.module").then(
            (m) => m.DataCardModule
          ),
      },
      {
        path: "card_data",
        loadChildren: () =>
          import("./pages/admin/data-card/data-card.module").then(
            (m) => m.DataCardModule
          ),
      },
      {
        path: "room_history",
        loadChildren: () =>
          import("./pages/admin/room-history/room-history.module").then(
            (m) => m.RoomHistoryModule
          ),
      },
      {
        path: "rule_save",
        loadChildren: () =>
          import("./pages/admin/rule-save/rule-save.module").then(
            (m) => m.RuleSaveModule
          ),
      },
      {
        path: "rule_stat",
        loadChildren: () =>
          import("./pages/admin/rule-stat/rule-stat.module").then(
            (m) => m.RuleStatModule
          ),
      },

      {
        path: "time_stat",
        loadChildren: () =>
          import("./pages/admin/time-stat/time-stat.module").then(
            (m) => m.TimeStatModule
          ),
      },
      {
        path: "time_manage",
        loadChildren: () =>
          import("./pages/admin/time-manage/time-manage.module").then(
            (m) => m.TimeManageModule
          ),
      },
      {
        path: "data_import",
        loadChildren: () =>
          import("./pages/admin/data-import/data-import.module").then(
            (m) => m.DataImportModule
          ),
      },
    ],
  },
  {
    path: "time_add",
    canActivate: [CheckLoginGuard],
    loadChildren: () =>
      import("./pages/admin/time-add/time-add.module").then(
        (m) => m.TimeAddModule
      ),
  },
  {
    path: "check_time",
    loadChildren: () =>
      import("./pages/student/check-time/check-time.module").then(
        (m) => m.CheckTimeModule
      ),
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
    redirectTo: "/nav/card_data",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
