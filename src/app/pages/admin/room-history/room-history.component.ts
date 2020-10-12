import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { HttpService } from "src/app/services/http.service";
import { Sort } from "@angular/material/sort";
import { NgxSpinnerService } from "ngx-spinner";

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
  public roomHistory: Array<any> = [];
  public showColumn = new FormControl();
  allComplete: boolean = false;
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

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
    await this.spinner.show();
    this.getRoomHistory().then(async (value) => {
      if (value == true) {
        this.spinner.hide();
      }
    });
  }
  getRoomHistory = async () => {
    let httpRespon: any = await this.http.post("getRoomHistory");
    this.checkConnect = true;
    //console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = httpRespon.response.data;
      this.userData.forEach((x) => {
        x.room_number_old == "null" ? (x.room_number_old = "") : 1;
        x.state = false;
      });
      console.log(this.userData);

      return true;
    } else {
      this.userData = null;
      return true;
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
    if (this.roomHistory.length == 0) {
      Swal.fire("กรุณาเลือกข้อมูล", "", "error");
    } else {
      this.roomHistory.forEach((item) => {
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
        "ประวัติการย้ายห้องพัก_" + this.getDate()
      );
      this.data = [];
    }
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

  checkAll(ev) {
    if (ev.checked) {
      this.userData.forEach((x) => {
        if (x.state != ev.checked) {
          this.roomHistory.push(x);
          x.state = ev.checked;
          console.log("หมด");
        }
      });
    } else {
      this.userData.forEach((x) => {
        x.state = ev.checked;
        console.log("ไม่หมด");
      });
      this.roomHistory = [];
    }
  }

  addStdCard = async (value, check) => {
    console.log(check);

    if (check == true) {
      this.roomHistory.push(value);
    } else {
      this.roomHistory = this.roomHistory.filter((item) => {
        if (item != value) {
          return item;
        }
      });
    }
    if (this.roomHistory.length == this.userData.length) {
      this.allComplete = true;
      console.log("userData");
      console.log(this.userData);
      console.log("his");
      console.log(this.roomHistory);
    } else {
      this.allComplete = false;
    }
    console.log(this.roomHistory);
  };

  async deleteHis() {
    if (this.roomHistory.length == 0) {
      Swal.fire("กรุณาเลือกข้อมูล", "", "error");
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
        var noHistory: any = this.roomHistory.map((x) => {
          return x.no_room_history;
        });
        console.log(noHistory);
        formData.append("noHistory", noHistory);
        let httpRespon: any = await this.http.post("deleteRoomHis", formData);
        console.log(httpRespon);
        if (httpRespon.response.success) {
          await this.spinner.show();
          this.getRoomHistory().then(async (value) => {
            if (value == true) {
              this.spinner.hide();
            }
          });
          console.log(httpRespon);
          this.roomHistory = [];
          this.allComplete = false;
        } else {
          Swal.fire(httpRespon.response.message, "", "error");
        }
      });
    }
  }

  sortData(sort: Sort) {
    if (this.userData == null) {
      return;
    }
    const data = this.userData.slice();
    if (!sort.active || sort.direction === "") {
      this.userData = data;
      return;
    }
    this.userData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "date_room":
          return compare(a.date_room, b.date_room, isAsc);
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
        case "room_number_old":
          return compare(a.room_number_old, b.room_number_old, isAsc);
        case "room_number_new":
          return compare(a.room_number_new, b.room_number_new, isAsc);
        case "status_name":
          return compare(a.status_name, b.status_name, isAsc);
        default:
          return 0;
      }
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
