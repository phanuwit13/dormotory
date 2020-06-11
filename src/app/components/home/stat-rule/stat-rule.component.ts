import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
@Component({
  selector: "app-stat-rule",
  templateUrl: "./stat-rule.component.html",
  styleUrls: ["./stat-rule.component.scss"],
})
export class StatRuleComponent implements OnInit {
  public userData: Array<any> = null;
  months = new FormControl();
  term = new FormControl();
  ruleChoice = [];
  public formStd_code: FormGroup;
  public floor = [];
  public keyStd = new FormControl();
  p: number = 1;
  public Faculty = [];
  public titleName = ["นาย", "นาง", "นางสาว"];
  public branch = [];
  public room = [];
  public levels = [];
  public checkConnect: any = false;

  t = new Date();
  favoriteSeason: string;

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
  floorList: string[] = ["2", "3", "4", "5", "6", "7", "8"];

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
    this.getStdRule();
    this.getRule();
  }

  getStdRule = async () => {
    let httpRespon: any = await this.http.post("getStdRule");
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
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.room = httpRespon.response.data;
    } else {
      this.room = null;
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
    //วนลูบเก็บค่า key และ value
    Object.keys(this.formStd_code.value).forEach((key) => {
      formData.append(key, this.formStd_code.value[key]);
      console.log(key + " : " + this.formStd_code.value[key]);
    });
  };
  getTerm = () => {
    let time = new Date();
    let data = {
      term:
        time.getMonth() >= 5 && time.getMonth() <= 9
          ? 1
          : (time.getMonth() >= 10 && time.getMonth() <= 11) ||
            (time.getMonth() >= 0 && time.getMonth() <= 2)
          ? 2
          : time.getMonth() > 2 && time.getMonth() < 5
          ? 3
          : "",
      yearThai: time.getFullYear() + 543,
    };

    return data;
  };
}
