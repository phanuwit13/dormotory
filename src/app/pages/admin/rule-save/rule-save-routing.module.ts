import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RuleSaveComponent } from "./rule-save.component";

const routes: Routes = [
  {
    path: "",
    component: RuleSaveComponent,
    children: [
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
      {
        path: "outSider",
        loadChildren: () =>
          import("./out-sider/out-sider.module").then((m) => m.OutSiderModule),
      },
      {
        path: "ruleManage",
        loadChildren: () =>
          import("./rule-manage/rule-manage.module").then(
            (m) => m.RuleManageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuleSaveRoutingModule {}
