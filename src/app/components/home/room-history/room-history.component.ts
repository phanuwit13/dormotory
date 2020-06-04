import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
@Component({
  selector: "app-room-history",
  templateUrl: "./room-history.component.html",
  styleUrls: ["./room-history.component.scss"],
})
export class RoomHistoryComponent implements OnInit {
  public formStd_code: FormGroup;
  public userData: Array<any> = null;
  public floor = [];
  public keyStd = new FormControl();
  p: number = 1;

  public Faculty = [];
  public titleName = ["นาย", "นาง", "นางสาว"];
  public branch = [];
  public room = [];
  public levels = [];
  public checkConnect: any = false;
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
    await this.getRoomHistory();
  }
  getRoomHistory = async () => {
    let httpRespon: any = await this.http.post("getRoomHistory");
    this.checkConnect = true;
    //console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      this.userData.forEach((x) => {
        x.room_number_old == "null" ? (x.room_number_old = "") : 1;
      });
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
