import { NgxSpinnerService } from "ngx-spinner";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { Sort } from "@angular/material/sort";

@Component({
  selector: "app-dormitory-student",
  templateUrl: "./dormitory-student.component.html",
  styleUrls: ["./dormitory-student.component.scss"],
})
export class DormitoryStudentComponent implements OnInit {
  public userData: Array<any> = null;
  public dataOld: Array<any> = null;
  public ruleHistory: Array<any> = [];
  allComplete: boolean = false;
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
      this.userData.forEach((x) => {
        x.state = false;
      });
      this.dataOld = this.userData
      return true;
    } else {
      this.userData = null;
      this.dataOld = this.userData
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
    this.dataOld = this.userData
    console.log(this.keyStd.value);
    let formData = new FormData();
    formData.append("keyStd", this.keyStd.value);
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("searchRuleStatStd", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      this.dataOld = this.userData
      console.log("พบ");
    } else {
      this.userData = [];
      this.dataOld = this.userData
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
      this.dataOld = this.userData
    } else {
      this.userData = null;
      this.dataOld = this.userData
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
    if (this.ruleHistory.length == 0) {
      Swal.fire("", "กรุณาเลือกข้อมูล", "error");
    } else {
    this.ruleHistory.forEach((item) => {
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
  async deleteHis() {
    if (this.ruleHistory.length == 0) {
      Swal.fire("", "กรุณาเลือกข้อมูล", "error");
    } else {
      Swal.fire({
        title: "",
        text: "ยืนยันการลบข้อมูล!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง !",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        let formData = new FormData();
        var noHistory: any = this.ruleHistory.map((x) => {
          return x.rules_no;
        });
        console.log(noHistory);
        formData.append("noHistory", noHistory);
        let httpRespon: any = await this.http.post("deleteRuleHis", formData);
        console.log(httpRespon);
        if (httpRespon.response.success) {
          await this.spinner.show();
          this.getStdRule().then(async (value) => {
            if (value == true) {
              this.spinner.hide();
            }
          });
          console.log(httpRespon);
          this.ruleHistory = [];
          this.allComplete = false;
        } else {
          Swal.fire("", httpRespon.response.message, "error");
        }
      });
    }
  }
  checkAll(ev) {
    if (ev.checked) {
      this.userData.forEach((x) => {
        if (x.state != ev.checked) {
          this.ruleHistory.push(x);
          x.state = ev.checked;
          console.log("หมด");
        }
      });
    } else {
      this.userData.forEach((x) => {
        x.state = ev.checked;
        console.log("ไม่หมด");
      });
      this.ruleHistory = [];
    }
  }

  addStdCard = async (value, check) => {
    console.log(check);

    if (check == true) {
      this.ruleHistory.push(value);
    } else {
      this.ruleHistory = this.ruleHistory.filter((item) => {
        if (item != value) {
          return item;
        }
      });
    }
    if (this.ruleHistory.length == this.userData.length) {
      this.allComplete = true;
      console.log("userData");
      console.log(this.userData);
      console.log("his");
      console.log(this.ruleHistory);
    } else {
      this.allComplete = false;
    }
    console.log(this.ruleHistory);
  };

  sortData(sort: Sort) {
    if (this.userData == null) {
      return;
    }
    const data = this.userData.slice();
    if (!sort.active || sort.direction === "") {
      this.userData = this.dataOld.slice();
      return;
    }
    this.userData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "date_rule":
          return compare(a.date_rule, b.date_rule, isAsc);
        case "time_rule":
          return compare(a.time_rule, b.time_rule, isAsc);
        case "room_number":
          return compare(a.room_number, b.room_number, isAsc);
        case "std_code":
          return compare(a.std_code, b.std_code, isAsc);
        case "nameStd":
          return compare(a.nameStd, b.nameStd, isAsc);
        case "faculty":
          return compare(a.faculty, b.faculty, isAsc);
        case "branch":
          return compare(a.branch, b.branch, isAsc);
        case "groubStudent":
          return compare(a.groubStudent, b.groubStudent, isAsc);
        case "level":
          return compare(a.level, b.level, isAsc);
        case "rules_name":
          return compare(a.rules_name, b.rules_name, isAsc);
          case "details":
            return compare(a.details, b.details, isAsc);
        default:
          return 0;
        
      }
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
