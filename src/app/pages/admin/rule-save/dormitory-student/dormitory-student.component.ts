import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
@Component({
  selector: "app-dormitory-student",
  templateUrl: "./dormitory-student.component.html",
  styleUrls: ["./dormitory-student.component.scss"],
})
export class DormitoryStudentComponent implements OnInit {
  public formStd_code: FormGroup;
  public userData: any = null;
  public titleName = ["นาย", "นาง", "นางสาว", "MR.", "MISS.", "MRS."];
  public levels = [];
  public branch = [];
  public Faculty = [];
  public other = { rules_number: 16, rules_name: "อื่นๆ" };
  //public rule = new FormControl();
  public ruleChoice: Array<any> = null;
  public nameStudent: Array<any> = null;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  async ngOnInit() {
    this.formStd_code = this.formBuilder.group({
      std_code: ["", Validators.required],
      rulesBreak: ["", Validators.required],
      date_rule: [new Date(), Validators.required],
      time_rule: [this.setTime(), Validators.required],
      id_card_code: null,
      other: "",
      details: "",
    });
    this.getFaculty();
    this.getLevels();
    this.getRule();
  }
  async getRule() {
    let httpRespon: any = await this.http.post("Rule");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.ruleChoice = httpRespon.response.data;
      this.ruleChoice = this.ruleChoice.filter((item) => {
        return item.rules_number != 16;
      });
      this.ruleChoice.push(this.other);
    } else {
      this.ruleChoice = null;
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
  ฃ;
  async getLevels() {
    let httpRespon: any = await this.http.post("level");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.levels = httpRespon.response.data;
    } else {
      this.levels = null;
    }
  }
  public getStdcode = async () => {
    this.userData = null;
    let formData = new FormData();
    formData.append("std_code", this.formStd_code.value.std_code);
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("getStudent", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.nameStudent = httpRespon.response.data;
    } else {
      this.nameStudent = null;
    }
  };

  public setStd_rule = async () => {
    Swal.fire({
      title: "",
      text: "ยืนยันการบันทึกการกระทำผิดกฎ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        this.userData = null;
        let formData = new FormData();
        let date_rule = this.getDate();
        Object.keys(this.formStd_code.value).forEach((key) => {
          formData.append(key, this.formStd_code.value[key]);
        });
        formData.append("date_rule", date_rule);

        let httpRespon: any = await this.http.post("setStudentRule", formData);
        console.log(httpRespon);
        if (httpRespon.response.data > 0) {
          Swal.fire("สำเร็จ", httpRespon.response.message, "success");
          this.clearFormSearch();
        } else {
          Swal.fire("ไม่สำเร็จ", httpRespon.response.message, "error");
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    });
  };
  clearFormSearch() {
    this.nameStudent = null;
    Object.keys(this.formStd_code.value).forEach((key) => {
      this.formStd_code.controls[key].setValue("");
    });
    this.formStd_code.controls["date_rule"].setValue(new Date());
    this.formStd_code.controls["id_card_code"].setValue(null);
    this.formStd_code.controls["time_rule"].setValue(
      new Date().getHours() + ":" + new Date().getMinutes()
    );
  }
  getDate() {
    let year: any = this.formStd_code.value.date_rule.getFullYear();
    let month: any = this.formStd_code.value.date_rule.getMonth() + 1;
    let day: any = this.formStd_code.value.date_rule.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  }
  setTime = () => {
    let dateZone = new Date();
    let hours = "";
    let minutes = "";
    if (dateZone.getHours() < 10) {
      hours = "0" + dateZone.getHours();
    } else {
      hours = dateZone.getHours() + "";
    }
    if (dateZone.getMinutes() < 10) {
      minutes = "0" + dateZone.getMinutes();
    } else {
      minutes = dateZone.getMinutes() + "";
    }
    return hours + ":" + minutes;
  };
}
