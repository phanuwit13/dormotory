import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-check-time",
  templateUrl: "./check-time.component.html",
  styleUrls: ["./check-time.component.scss"],
})
export class CheckTimeComponent implements OnInit {
  public formLogin: FormGroup;
  public timeStat: any = null;
  public dataStd: any = null;
  p: number = 1;

  constructor(private formBuilder: FormBuilder, private http: HttpService) {}

  ngOnInit() {
    setInterval(() => {
      document.getElementById("inputStd").focus();
    }, 1000);
    this.formLogin = this.formBuilder.group({
      std_code: ["", Validators.required],
    });
  }

  async getStdcode() {
    let formData = new FormData();
    formData.append("std_code", this.formLogin.controls["std_code"].value);
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("getStudent", formData);
    if (httpRespon.response.success) {
      this.dataStd = httpRespon.response.data;
      return true;
    } else {
      this.dataStd = null;
      return false;
    }
  }

  setCursor = () => {
    this.formLogin.controls["std_code"].setValue("");
  };

  async getNameStdLate() {
    if (await this.getStdcode()) {
      this.searchStd();
      document.getElementById("success").click();
    } else {
      Swal.fire({
        showConfirmButton: false,
        icon: "error",
        title: "ไม่พบข้อมูล",
        text: "ไม่พบข้อมูลนักศึกษาหอพัก !",
        timer: 1000,
      });
    }
  }
  async searchStd() {
    let formData = new FormData();
    formData.append("keyStd", this.formLogin.controls["std_code"].value);
    formData.append("all", "false");
    let httpRespon: any = await this.http.post("searchTimeStat", formData);
    if (httpRespon.response.data.length > 0) {
      this.timeStat = httpRespon.response.data;
    } else {
      this.timeStat = null;
    }
  }
}
