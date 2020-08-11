import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-out-sider",
  templateUrl: "./out-sider.component.html",
  styleUrls: ["./out-sider.component.scss"],
})
export class OutSiderComponent implements OnInit {
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
    this.formSearch = this.formBuilder.group({
      date: new Date(),
      typeSelect: "",
      months: null,
      term: null,
      rules_number: "",
    });
    this.getStdRule();
    this.getRule();
  }

  getStdRule = async () => {
    let httpRespon: any = await this.http.post("getOutsiderRule");
    this.checkConnect = true;
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
    } else {
      this.userData = null;
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
    Object.keys(this.formSearch.value).forEach((key) => {
      formData.append(key, this.formSearch.value[key]);
      console.log(key + " : " + this.formSearch.controls[key].value);
    });
    let httpRespon: any = await this.http.post(
      "advancedSearchRuleOut",
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
  }
  exportAsXLSX(): void {
    this.userData.forEach((item) => {
      let str = "";
      if (item.house_no != "") {
        str += item.house_no;
      }
      if (item.moo != "") {
        str += " หมู่ " + item.moo;
      }
      if (item.sub_district != "") {
        str += " ตำบล " + item.sub_district;
      }
      if (item.district != "") {
        str += " อำเภอ " + item.district;
      }
      if (item.province != "") {
        str += " จังหวัด " + item.province;
      }
      if (item.other != "") {
        this.data.push({
          วันที่: item.date_rule,
          เวลา: item.time_rule,
          บัตรประชาชน: item.id_card_code,
          "ชื่อ - สกุล": item.nameOutsider,
          ที่อยู่: str,
          ชื่อบิดา: item.father,
          เบอร์บิดา: item.f_phone,
          ชื่อมารดา: item.mother,
          เบอร์มารดา: item.m_phone,
          นักศึกษาที่เกี่ยวข้อง: item.nameStd,
          เกี่ยวข้องเป็น: item.student_relation,
          กระทำผิดกฏ: item.other,
          รายละเอียด: item.details,
        });
      } else {
        this.data.push({
          วันที่: item.date_rule,
          เวลา: item.time_rule,
          บัตรประชาชน: item.id_card_code,
          "ชื่อ - สกุล": item.nameOutsider,
          ที่อยู่: str,
          ชื่อบิดา: item.father,
          เบอร์บิดา: item.f_phone,
          ชื่อมารดา: item.mother,
          เบอร์มารดา: item.m_phone,
          นักศึกษาที่เกี่ยวข้อง: item.nameStd,
          เกี่ยวข้องเป็น: item.student_relation,
          กระทำผิดกฏ: item.rules_name,
          รายละเอียด: item.details,
        });
      }
    });

    this.http.exportAsExcelFile(
      this.data,
      "ผลการกระทำผิดกฎของบุคคลภายนอก_" + this.getDate()
    );
    this.data = [];
  }
}
