import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

@Component({
  selector: "app-data-import",
  templateUrl: "./data-import.component.html",
  styleUrls: ["./data-import.component.scss"],
})
export class DataImportComponent implements OnInit {
  public formStd_code: FormGroup;
  public data = [];
  public Faculty = [];
  public titleName = ["นาย", "นาง", "นางสาว", "MR.", "MISS.", "MRS."];
  public branch = [];
  public floor = [];
  public room = [];
  public levels = [];
  public branchAll = [];
  public datafail = [];
  p: number = 1;

  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formStd_code = this.formBuilder.group({
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
    console.log("60214 (ม.ปลาย)");
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

  async getFaculty() {
    let httpRespon: any = await this.http.post("Faculty");
    console.log(httpRespon);
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
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.branch = httpRespon.response.data;
    } else {
      this.branch = null;
    }
  }
  async getBranchAll() {
    let formData = new FormData();
    let httpRespon: any = await this.http.post("BranchAll");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.branchAll = httpRespon.response.data;
    } else {
      this.branchAll = null;
    }
  }
  async getFloor() {
    let httpRespon: any = await this.http.post("floor");
    console.log(httpRespon);
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
    console.log(title);
    let httpRespon: any = await this.http.post("room", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.room = httpRespon.response.data;
    } else {
      this.room = [];
    }
  }

  async setDataStd() {
    // let checkData: boolean;
    // Object.keys(this.formStd_code.value).forEach((key) => {
    //   if (this.formStd_code.value[key] == "") {
    //     if (key == "room_number" || key == "floor" || key == "phone") {
    //       checkData = true;
    //     } else {
    //       checkData = false;
    //     }
    //   } else {
    //     checkData = true;
    //   }
    // });

    let formData = new FormData();
    // วนลูบเก็บค่า key และ value

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.value) {
        Object.keys(this.formStd_code.value).forEach((key) => {
          formData.append(key, this.formStd_code.value[key]);
        });
        let httpRespon: any = await this.http.post("addStudent", formData);
        console.log(httpRespon);
        if (httpRespon.response.success) {
          await Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: httpRespon.response.message,
          });
          this.formStd_code.reset();
          document.getElementById("closebutton").click();
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

  /* <input type="file" (change)="onFileChange($event)" multiple="false" /> */
  /* ... (within the component class definition) ... */
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.readDataStd();
      this.data = [];
    };

    reader.readAsBinaryString(target.files[0]);
  }

  async readDataStd() {
    this.data.forEach(async (x, index) => {
      if (index != 0) {
        if (x != "") {
          if (x.length == 9) {
            //console.log(x);
            this.importData(x[0], x[1], x[2], x[3], x[4], x[6], x[8]);
          } else if (x.length == 8) {
            this.importData(x[0], x[1], x[2], x[3], x[4], x[6], "");
          }
        }
      }
    });
  }

  async importData(
    room_number,
    std_code,
    nameTitle,
    fname,
    lname,
    branch_code,
    phone
  ) {
    let str = "";
    let bc = [];
    let i: number = 0;
    let m = 0;
    let formData = new FormData();
    let groupStd = [];
    //วนลูบเก็บค่า key และ value
    formData.append("room_number", room_number);
    formData.append("std_code", std_code);
    formData.append("nameTitle", nameTitle);
    formData.append("fname", fname);
    formData.append("lname", lname);

    for (m = 0; m < branch_code.length; m++) {
      i++;
      if (branch_code.charAt(m) > "0" && branch_code.charAt(m) < "9") {
        break;
      }
    }

    bc = await branch_code.split("", i - 2);

    bc.forEach((item) => {
      str += item;
    });

    this.branchAll.forEach((x) => {
      if (x.acronym == str) {
        formData.append("branch_code", x.branch_code);
        formData.append("faculty_code", x.faculty_code);
      }
    });
    groupStd = await branch_code.split(str + ".");

    formData.append("groupStd", groupStd[1]);
    formData.append("phone", phone);

    let httpRespon: any = await this.http.post("addStudent", formData);
    //console.log(httpRespon);
    if (httpRespon.response.success) {
      console.log(httpRespon.response.message);
    } else {
      this.datafail.push({
        std_code: std_code,
        room_number: room_number,
        nameTitle: nameTitle,
        fname: fname,
        lname: lname,
        branch_code: branch_code,
        phone: phone,
      });

      console.log(httpRespon.response.message);
    }
  }
  deleteDatabase() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.value) {
        let httpRespone: any = await this.http.post("deleteData");
        if (httpRespone.response.success) {
          Swal.fire(
            httpRespone.response.message,
            "Your file has been deleted.",
            "success"
          );
        } else {
          Swal.fire(
            httpRespone.response.message,
            "Your file has been deleted.",
            "error"
          );
        }
      }
    });
  }
  onloadSweet() {}
}
