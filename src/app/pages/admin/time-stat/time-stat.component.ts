import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-time-stat",
  templateUrl: "./time-stat.component.html",
  styleUrls: ["./time-stat.component.scss"],
})
export class TimeStatComponent implements OnInit {
  public userData: Array<any> = [];
  public floor: any;
  public formStd_code: FormGroup;
  public formSearch: FormGroup;
  public all = new FormControl();
  // term = new FormControl();
  public p: number = 1;
  public keyStd = new FormControl();
  public Faculty = [];
  public branch = [];
  public levels = [];
  public checkConnect = false;
  public term = [1, 2, 3];
  data: any = [];
  monthsList: string[] = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤษจิกายน",
    "ธันวาคม",
  ];

  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  async ngOnInit() {
    this.formStd_code = this.formBuilder.group({
      std_code: ["", Validators.required],
      nameTitle: ["", Validators.required],
      faculty_code: ["", Validators.required],
      branch_code: ["", Validators.required],
      groupStd: ["", Validators.required],
      floor: ["", Validators.required],
      room_number: ["", Validators.required],
      phone: ["", Validators.required],
      noLevel: ["", Validators.required],
    });
    this.formSearch = this.formBuilder.group({
      faculty_code: "",
      branch_code: "",
      groupStd: "",
      floor: "",
      room_number: "",
      noLevel: "",
      date: new Date(),
      male: false,
      female: false,
      typeSelect: "",
      months: null,
      term: null,
    });
    this.all.setValue(false);
    await this.getTimeStat();
  }

  getTimeStat = async () => {
    let formData = new FormData();
    formData.append("all", this.all.value);
    let httpRespon: any = await this.http.post("getTimeStat", formData);
    this.checkConnect = true;
    console.log(httpRespon);
    if (httpRespon.response.success) {
      this.userData = httpRespon.response.data;
    } else {
      this.userData = [];
    }
  };

  async getFloor() {
    let httpRespon: any = await this.http.post("floor");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.floor = httpRespon.response.data;
    } else {
      this.floor = null;
    }
  }

  async searchStd() {
    this.p = 1;
    this.userData = [];
    console.log(this.keyStd.value);
    let formData = new FormData();
    formData.append("keyStd", this.keyStd.value);
    formData.append("all", this.all.value);
    let httpRespon: any = await this.http.post("searchTimeStat", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      console.log("พบ");
    } else {
      this.userData = [];
      console.log("ไม่พบ");
    }
  }

  advancedSearch = () => {
    this.getFloor();
    this.getLevels();
  };
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
  getAdvancedSearchData = async () => {
    let formData = new FormData();

    //วนลูบเก็บค่า key และ value
    if (this.formSearch.value["typeSelect"] == 1) {
      let date = this.getDate();
      this.formSearch.controls["months"].setValue("");
      this.formSearch.controls["term"].setValue("");
      this.formSearch.controls["date"].setValue(date);
    } else if (this.formSearch.value["typeSelect"] == 2) {
      this.formSearch.controls["date"].setValue("");
      this.formSearch.controls["term"].setValue("");
    } else if (this.formSearch.value["typeSelect"] == 3) {
      this.formSearch.controls["months"].setValue("");
      this.formSearch.controls["date"].setValue("");
    } else {
      this.formSearch.controls["months"].setValue("");
      this.formSearch.controls["date"].setValue("");
      this.formSearch.controls["term"].setValue("");
    }
    formData.append("all", this.all.value);
    Object.keys(this.formSearch.value).forEach((key) => {
      formData.append(key, this.formSearch.value[key]);
      console.log(key + " : " + this.formSearch.value[key]);
    });
    let httpRespon: any = await this.http.post("getTimeStatAdvance", formData);

    console.log(httpRespon);
    if (httpRespon.response.success) {
      this.userData = httpRespon.response.data;
    } else {
      this.userData = [];
    }
    this.clearFormSearch();
  };

  getDate() {
    let year = this.formSearch.value.date.getFullYear();
    let month = this.formSearch.value.date.getMonth();
    let day = this.formSearch.value.date.getDate();
    if (month < 10) {
      month = "0" + (month + 1);
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  }

  clearFormSearch() {
    Object.keys(this.formSearch.value).forEach((key) => {
      this.formSearch.controls[key].setValue("");
    });
    this.formSearch.controls["date"].setValue(new Date());
    this.formSearch.controls["male"].setValue(false);
    this.formSearch.controls["female"].setValue(false);
  }
  exportAsXLSX(): void {
    this.userData.forEach((item) => {
      this.data.push({
        วันที่: item.date_stamp,
        เลขห้อง: item.room_number,
        รหัสนักศึกษา: item.std_code,
        "ชื่อ - สกุล": item.nameStd,
        คณะ: item.name,
        สาขา: item.branch,
        กลุ่มเรียน: item.groubStudent,
        ระดับวุฒิการศึกษา: item.level,
        เบอร์โทร: item.phone,
        เวลาเข้าหอ: item.time_stamp,
      });
    });

    this.http.exportAsExcelFile(
      this.data,
      "ผลการเข้าหอพักของนักศึกษา_" + this.getDate()
    );
    this.data = [];
  }
}
