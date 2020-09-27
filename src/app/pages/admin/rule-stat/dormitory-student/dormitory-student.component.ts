import { NgxSpinnerService } from "ngx-spinner";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-dormitory-student",
  templateUrl: "./dormitory-student.component.html",
  styleUrls: ["./dormitory-student.component.scss"],
})
export class DormitoryStudentComponent implements OnInit {
  public userData: Array<any> = null;
  //term = new FormControl();
  public ruleChoice = [];
  public formStd_code: FormGroup;
  public formSearch: FormGroup;
  public floor = [];
  public keyStd = new FormControl();
  public p: number = 1;
  public Faculty = [];
  public branch = [];
  public levels = [];
  public checkConnect: any = false;
  public term = [1, 2, 3];
  public showColumn = new FormControl();

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
  data: any = [];
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
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
      rules_number: "",
    });
    this.getRule();
    await this.spinner.show();
    this.getStdRule().then(async (value) => {
      if (value == true) {
        this.spinner.hide();
      }
    });
  }

  getStdRule = async () => {
    let formData = new FormData();
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("getStdRule", formData);
    this.checkConnect = true;
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      return true;
    } else {
      this.userData = null;
      return true;
    }
  };

  async getRule() {
    let httpRespon: any = await this.http.post("Rule");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.ruleChoice = httpRespon.response.data;
    } else {
      this.ruleChoice = null;
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
  async getFloor() {
    let httpRespon: any = await this.http.post("floor");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.floor = httpRespon.response.data;
    } else {
      this.floor = null;
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
  async searchStd() {
    this.userData = [];
    console.log(this.keyStd.value);
    let formData = new FormData();
    formData.append("keyStd", this.keyStd.value);
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("searchRuleStatStd", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      console.log("พบ");
    } else {
      this.userData = [];
      console.log("ไม่พบ");
    }
  }
  getAdvancedSearchData = async () => {
    let formData = new FormData();
    let date = new Date();
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
    //วนลูบเก็บค่า key และ value
    formData.append("status", "1");
    Object.keys(this.formSearch.value).forEach((key) => {
      formData.append(key, this.formSearch.value[key]);
      console.log(key + " : " + this.formSearch.controls[key].value);
    });
    let httpRespon: any = await this.http.post(
      "advancedSearchRuleStd",
      formData
    );
    console.log(httpRespon);
    if (httpRespon.response.success) {
      this.userData = httpRespon.response.data;
    } else {
      this.userData = null;
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
      if (item.other != "") {
        this.data.push({
          วันที่: item.date_rule,
          เวลา: item.time_rule,
          เลขห้อง: item.room_number,
          รหัสนักศึกษา: item.std_code,
          "ชื่อ - สกุล": item.nameStd,
          คณะ: item.faculty,
          สาขา: item.branch,
          กลุ่มเรียน: item.groubStudent,
          ระดับวุฒิการศึกษา: item.level,
          กระทำผิดกฏ: item.other,
          รายละเอียด: item.details,
        });
      } else {
        this.data.push({
          วันที่: item.date_rule,
          เวลา: item.time_rule,
          เลขห้อง: item.room_number,
          รหัสนักศึกษา: item.std_code,
          "ชื่อ - สกุล": item.nameStd,
          คณะ: item.faculty,
          สาขา: item.branch,
          กลุ่มเรียน: item.groubStudent,
          ระดับวุฒิการศึกษา: item.level,
          กระทำผิดกฏ: item.rules_name,
          รายละเอียด: item.details,
        });
      }
    });

    this.http.exportAsExcelFile(
      this.data,
      "ผลการกระทำผิดกฎของนักศึกษาหอพัก_" + this.getDate()
    );
    this.data = [];
  }
}
