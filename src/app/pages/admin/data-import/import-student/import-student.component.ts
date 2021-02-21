import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-import-student",
  templateUrl: "./import-student.component.html",
  styleUrls: ["./import-student.component.scss"],
})
export class ImportStudentComponent implements OnInit {
  public formInsert: FormGroup;
  public data: Array<any> = [];
  public Faculty = [];
  public titleName = ["นาย", "นาง", "นางสาว", "MR.", "MISS.", "MRS."];
  public branch = [];
  public floor = [];
  public room = [];
  public levels = [];
  public branchAll = [];
  public datafail = [];
  public columnName = [
    "เลขห้อง",
    "รหัสนักศึกษา",
    "คำนำหน้า",
    "ชื่อ",
    "นามสกุล",
    "คณะ",
    "สาขา",
    "ระดับ",
    "เบอร์โทรศัพท์",
  ];
  public header: Array<String> = [];
  p: number = 1;
  public selectedFile: File = null;
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.formInsert = this.formBuilder.group({
      std_code: ["", Validators.required],
      nameTitle: ["", Validators.required],
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      faculty_code: ["", Validators.required],
      branch_code: ["", Validators.required],
      groupStd: ["", Validators.required],
      floor: "",
      room_number: "",
      phone: "",
      noLevel: ["", Validators.required],
    });
    this.getFaculty();
    this.getLevels();
    this.getFloor();
    this.getBranchAll();
  }

  async getLevels() {
    let httpRespon: any = await this.http.post("level");
    if (httpRespon.response.data.length > 0) {
      this.levels = httpRespon.response.data;
    } else {
      this.levels = null;
    }
  }

  async getFaculty() {
    let httpRespon: any = await this.http.post("Faculty");
    if (httpRespon.response.data.length > 0) {
      this.Faculty = httpRespon.response.data;
    } else {
      this.Faculty = null;
    }
  }
  async getBranch(fcl, lev) {
    let formData = new FormData();
    formData.append("faculty_code", fcl);
    formData.append("noLevel", lev);
    let httpRespon: any = await this.http.post("Branch", formData);
    if (httpRespon.response.data.length > 0) {
      this.branch = httpRespon.response.data;
    } else {
      this.branch = null;
    }
  }
  async getBranchAll() {
    let formData = new FormData();
    let httpRespon: any = await this.http.post("BranchAll");
    if (httpRespon.response.data.length > 0) {
      this.branchAll = httpRespon.response.data;
    } else {
      this.branchAll = null;
    }
  }
  async getFloor() {
    let httpRespon: any = await this.http.post("floor");
    if (httpRespon.response.data.length > 0) {
      this.floor = httpRespon.response.data;
    } else {
      this.floor = null;
    }
  }
  async getRoom(title, flr, std_code) {
    let formData = new FormData();
    formData.append("nameTitle", title);
    formData.append("std_code", std_code);
    if (flr != "") {
      formData.append("floor", flr);
    } else {
      formData.append("floor", "2");
    }
    let httpRespon: any = await this.http.post("room", formData);
    if (httpRespon.response.data.length > 0) {
      this.room = httpRespon.response.data;
      return;
    } else {
      this.room = [];
      return;
    }
  }

  async setDataStd() {
    let formData = new FormData();
    Swal.fire({
      title: "",
      text: "ยืนยันการเพิ่มข้อมูลนักศึกษา ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        await Object.keys(this.formInsert.value).forEach(async (key) => {
          formData.append(key, (await this.formInsert.value[key]) + "".trim());
        });
        let httpRespon: any = await this.http.post("addStudent", formData);
        if (httpRespon.response.success) {
          await Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: httpRespon.response.message,
          });
          this.formInsert.reset();
        } else {
          Swal.fire({
            icon: "error",
            title: "ไม่สำเร็จ",
            text: httpRespon.response.message,
          });
        }
      }
    });
  }
  clearFormInsert() {
    Object.keys(this.formInsert.value).forEach((key) => {
      this.formInsert.controls[key].setValue("");
    });
  }

  checkType(st, value) {
    let str = this.formInsert.value[st].split("");
    if ((value == "num")) {
      for (let i = 0; i < str.length; i++) {
        if ((str[i] >= "0" && str[i] <= "9") || str[i] == "-") {
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: "ป้อนค่าได้แค่ตัวเลข",
          });
          this.formInsert.controls[st].setValue("");
        }
      }
    } else {
      for (let i = 0; i < str.length; i++) {
        if ((str[i] >= "0" && str[i] <= "9")) {
          Swal.fire({
            icon: "error",
            title: "",
            text: "ห้ามใส่ตัวเลข",
          });
          this.formInsert.controls[st].setValue("");
        } else {
        }
      }
    }
  }
}
