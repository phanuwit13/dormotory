import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-import-branch",
  templateUrl: "./import-branch.component.html",
  styleUrls: ["./import-branch.component.scss"],
})
export class ImportBranchComponent implements OnInit {
  public formLevel: FormGroup;
  public formFaculty: FormGroup;
  public formBranch: FormGroup;
  public Faculty = [];
  public levels = [];

  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formLevel = this.formBuilder.group({
      levelName: ["", Validators.required],
      levelAcronym: ["", Validators.required],
    });
    this.formFaculty = this.formBuilder.group({
      facultyName: ["", Validators.required],
      facultyName_en: ["", Validators.required],
    });
    this.formBranch = this.formBuilder.group({
      branchName: ["", Validators.required],
      branchName_en: ["", Validators.required],
      faculty_code: ["", Validators.required],
      acronym: ["", Validators.required],
      levels: ["", Validators.required],
    });
    this.getLevels();
  }

  async getFaculty() {
    let httpRespon: any = await this.http.post("Faculty");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.Faculty = httpRespon.response.data;
    } else {
      this.Faculty = null;
    }
  }
  async getLevels() {
    let httpRespon: any = await this.http.post("level");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.levels = httpRespon.response.data;
    } else {
      this.levels = null;
    }
  }

  setLevel = async () => {
    let formData = new FormData();

    Swal.fire({
      title: "",
      text: "ยืนยันการเพิ่มข้อมูลระดับวุฒิการศึกษา ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        Object.keys(this.formLevel.value).forEach((key) => {
          formData.append(key, this.formLevel.controls[key].value);
        });
        let httpResponse: any = await this.http.post("setLevel", formData);
        if (httpResponse.response.success) {
          await Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: httpResponse.response.message,
          });
          this.formLevel.reset();
        } else {
          Swal.fire({
            icon: "error",
            title: "ไม่สำเร็จ",
            text: httpResponse.response.message,
          });
        }
      }
    });
  };

  setFaculty = async () => {
    let formData = new FormData();

    Swal.fire({
      title: "",
      text: "ยืนยันการเพิ่มข้อมูลคณะ ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        Object.keys(this.formFaculty.value).forEach((key) => {
          formData.append(key, this.formFaculty.controls[key].value);
        });
        let httpResponse: any = await this.http.post("setFaculty", formData);
        if (httpResponse.response.success) {
          await Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: httpResponse.response.message,
          });
          this.formFaculty.reset();
        } else {
          Swal.fire({
            icon: "error",
            title: "ไม่สำเร็จ",
            text: httpResponse.response.message,
          });
        }
      }
    });
  };

  setBranch = async () => {
    let formData = new FormData();

    Swal.fire({
      title: "",
      text: "ยืนยันการเพิ่มข้อมูลสาขา ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        Object.keys(this.formBranch.value).forEach((key) => {
          formData.append(key, this.formBranch.controls[key].value);
        });
        let httpResponse: any = await this.http.post("setBranch", formData);
        if (httpResponse.response.success) {
          await Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: httpResponse.response.message,
          });
          this.formBranch.reset();
        } else {
          Swal.fire({
            icon: "error",
            title: "ไม่สำเร็จ",
            text: httpResponse.response.message,
          });
        }
      }
    });
  };
}
