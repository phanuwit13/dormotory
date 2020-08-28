import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DataImportComponent } from "./data-import.component";

const routes: Routes = [
  {
    path: "",
    component: DataImportComponent,
    children: [
      {
        path: "importExcel",
        loadChildren: () =>
          import("./import-excel/import-excel.module").then(
            (m) => m.ImportExcelModule
          ),
      },
      {
        path: "importStudent",
        loadChildren: () =>
          import("./import-student/import-student.module").then(
            (m) => m.ImportStudentModule
          ),
      },
      {
        path: "importBranch",
        loadChildren: () =>
          import("./import-branch/import-branch.module").then(
            (m) => m.ImportBranchModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataImportRoutingModule {}
