import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RuleStatComponent } from "./rule-stat.component";

const routes: Routes = [
  {
    path: "",
    component: RuleStatComponent,
    children: [
      {
        path: "outSider",
        loadChildren: () =>
          import("./out-sider/out-sider.module").then((m) => m.OutSiderModule),
      },
      {
        path: "defaultStudent",
        loadChildren: () =>
          import("./default-student/default-student.module").then(
            (m) => m.DefaultStudentModule
          ),
      },
      {
        path: "dormitoryStudent",
        loadChildren: () =>
          import("./dormitory-student/dormitory-student.module").then(
            (m) => m.DormitoryStudentModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuleStatRoutingModule {}
