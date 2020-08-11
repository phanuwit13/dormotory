import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DataCardComponent } from "./data-card.component";

const routes: Routes = [
  {
    path: "",
    component: DataCardComponent,
    children: [
      {
        path: "dormitoryStudent",
        loadChildren: () =>
          import("./dormitory-student/dormitory-student.module").then(
            (m) => m.DormitoryStudentModule
          ),
      },
      {
        path: "defaultStudent",
        loadChildren: () =>
          import("./default-student/default-student.module").then(
            (m) => m.DefaultStudentModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataCardRoutingModule {}
