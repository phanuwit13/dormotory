import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
@Component({
  selector: "app-importdata",
  templateUrl: "./importdata.component.html",
  styleUrls: ["./importdata.component.scss"],
})
export class ImportdataComponent implements OnInit {
  public formStd_code: FormGroup;
  public data = [];
  public Faculty = [];
  public titleName = ["นาย", "นาง", "นางสาว"];
  public branch = [];
  public floor = [];
  public room = [];
  public levels = [];
  public branchAll = [];

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
      floor: ["", Validators.required],
      room_number: ["", Validators.required],
      phone: ["", Validators.required],
      noLevel: ["", Validators.required],
    });
    this.getFaculty();
    this.getLevels();
    this.getFloor();
    this.getBranchAll();
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
    let formData = new FormData();
    //วนลูบเก็บค่า key และ value
    Object.keys(this.formStd_code.value).forEach((key) => {
      formData.append(key, this.formStd_code.value[key]);
    });
    let httpRespon: any = await this.http.post("addStudent", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.room = httpRespon.response.data;
    } else {
      this.room = [];
    }
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
      this.redData();
    };

    reader.readAsBinaryString(target.files[0]);
  }

  redData() {
    this.data.forEach((x, index) => {
      if (index != 0) {
        if (x != "") {
          if (x.length == 9) {
            console.log(x);
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
    let formData = new FormData();
    //วนลูบเก็บค่า key และ value
    formData.append("room_number", room_number);
    formData.append("std_code", std_code);
    formData.append("nameTitle", nameTitle);
    formData.append("fname", fname);
    formData.append("lname", lname);
    let bc = [];
    bc = branch_code.split(".");
    this.branchAll.forEach((x) => {
      if (x.acronym == bc[0]) {
        formData.append("branch_code", x.branch_code);
        formData.append("faculty_code", x.faculty_code);
      }
    });
    formData.append("groupStd", bc[1]);
    formData.append("phone", phone);

    let httpRespon: any = await this.http.post("addStudent", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.room = httpRespon.response.data;
      console.log("ผ่าน");
    } else {
      this.room = null;
      console.log("ไม่ผ่าน");
    }
  }
}
