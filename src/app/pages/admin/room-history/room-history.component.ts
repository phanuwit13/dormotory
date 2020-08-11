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
  public formSearch: FormGroup;

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
  data: any = [];

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
      faculty_code: "",
      branch_code: "",
      groupStd: "",
      floor: "",
      room_number: "",
      noLevel: "",
      male: false,
      female: false,
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

  async searchStd() {
    this.p = 1;
    this.userData = null;
    console.log(this.keyStd.value);
    let formData = new FormData();
    formData.append("keyStd", this.keyStd.value);
    let httpRespon: any = await this.http.post("SearchRoomHistory", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      this.userData.forEach((x) => {
        x.room_number_old == "null" ? (x.room_number_old = "") : 1;
      });
      console.log("พบ");
    } else {
      this.userData = null;
      console.log("ไม่พบ");
    }
  }
  exportAsXLSX(): void {
    this.userData.forEach((item) => {
      this.data.push({
        วันที่: item.date_room,
        รหัสนักศึกษา: item.std_code,
        "ชื่อ - สกุล": item.nameStd,
        คณะ: item.faculty,
        สาขา: item.branch,
        กลุ่มเรียน: item.groubStudent,
        ระดับวุฒิการศึกษา: item.level,
        ห้องเก่า: item.room_number_old,
        ห้องใหม่: item.room_number_new,
        สถานะ: item.status_name,
      });
    });

    this.http.exportAsExcelFile(
      this.data,
      "ผลการย้ายห้องพักของนักศึกษา_" + this.getDate()
    );
    this.data = [];
  }
  getDate() {
    let year: any = new Date().getFullYear();
    let month: any = new Date().getMonth();
    let day: any = new Date().getDate();
    if (month < 10) {
      month = "0" + (month + 1);
    } else {
      month = month + 1;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  }
}
