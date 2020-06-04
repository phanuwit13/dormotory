import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-stat",
  templateUrl: "./stat.component.html",
  styleUrls: ["./stat.component.scss"],
})
export class StatComponent implements OnInit {
  public userData: Array<any> = null;
  public floor: any;
  public formStd_code: FormGroup;
  months = new FormControl();
  term = new FormControl();
  p: number = 1;
  t = new Date();
  public keyStd = new FormControl();
  public Faculty = [];
  public titleName = ["นาย", "นาง", "นางสาว"];
  public branch = [];
  public room = [];
  public levels = [];
  favoriteSeason: string;
  checkConnect = false;

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
    await this.getTimeStat();
  }

  getTimeStat = async () => {
    let httpRespon: any = await this.http.post("getTimeStat");
    this.checkConnect = true;
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
    } else {
      this.userData = null;
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
  async searchStd() {
    this.userData = null;
    console.log(this.keyStd.value);
    let formData = new FormData();
    formData.append("keyStd", this.keyStd.value);
    let httpRespon: any = await this.http.post("search", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      console.log("พบ");
    } else {
      this.userData = null;
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
}
