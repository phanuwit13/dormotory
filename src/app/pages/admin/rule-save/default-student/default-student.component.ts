import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";

@Component({
  selector: "app-default-student",
  templateUrl: "./default-student.component.html",
  styleUrls: ["./default-student.component.scss"],
})
export class DefaultStudentComponent implements OnInit {
  public formStd_code: FormGroup;

  public titleName = ["นาย", "นาง", "นางสาว", "MR.", "MISS.", "MRS."];
  public other = { rules_number: 16, rules_name: "อื่นๆ" };
  public levels = [];
  public branch = [];
  public Faculty = [];
  public ruleChoice: Array<any> = null;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  async ngOnInit() {
    this.formStd_code = this.formBuilder.group({
      std_code: ["", Validators.required],
      rulesBreak: ["", Validators.required],
      date_rule: [new Date(), Validators.required],
      time_rule: [this.setTime(), Validators.required],
      other: "",
      id_card_code: null,
      details: "",
      nameTitle: ["", Validators.required],
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      faculty_code: ["", Validators.required],
      branch_code: ["", Validators.required],
      groupStd: ["", Validators.required],
      phone: "",
      noLevel: ["", Validators.required],
    });
    this.getFaculty();
    this.getLevels();
    this.getRule();
  }

  async getRule() {
    let httpRespon: any = await this.http.post("Rule");
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
    if (httpRespon.response.data.length > 0) {
      this.branch = httpRespon.response.data;
    } else {
      this.branch = null;
    }
  }

  async getLevels() {
    let httpRespon: any = await this.http.post("level");
    if (httpRespon.response.data.length > 0) {
      this.levels = httpRespon.response.data;
    } else {
      this.levels = null;
    }
  }

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
        let formData = new FormData();
        let date_rule = this.getDate();
        Object.keys(this.formStd_code.value).forEach((key) => {
          formData.append(key, this.formStd_code.value[key]);
          console.log(key+" : "+this.formStd_code.value[key]);
                 
        });
        formData.append("date_rule", date_rule);

        let httpRespon: any = await this.http.post(
          "setStdDataNormal",
          formData
        );
        if (httpRespon.response.success) {
          let httpRespon: any = await this.http.post(
            "setStudentRule",
            formData
          );
          if (httpRespon.response.success) {
            Swal.fire("สำเร็จ", httpRespon.response.message, "success");
            this.clearFormSearch();
          } else {
            Swal.fire("ไม่สำเร็จ", httpRespon.response.message, "error");
          }
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
    Object.keys(this.formStd_code.value).forEach((key) => {
      this.formStd_code.controls[key].setValue("");
    });
    this.formStd_code.controls["date_rule"].setValue(new Date());
    this.formStd_code.controls["id_card_code"].setValue(null);
    this.formStd_code.controls["time_rule"].setValue(this.setTime());
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

  checkType(st, value) {
    let str = this.formStd_code.value[st].split("");
    if ((value == "num")) {
      for (let i = 0; i < str.length; i++) {
        if ((str[i] >= "0" && str[i] <= "9") || str[i] == "-") {
        } else {
          Swal.fire({
            icon: "error",
            title: "",
            text: "ป้อนค่าได้แค่ตัวเลข",
          });
          this.formStd_code.controls[st].setValue("");
        }
      }
    } else {
      for (let i = 0; i < str.length; i++) {
        if ((str[i] >= "0" && str[i] <= "9")) {
          Swal.fire({
            icon: "error",
            title: "",
            text: "ห้ามใส่ตัวเลข",
          });
          this.formStd_code.controls[st].setValue("");
        } else {
        }
      }
    }
  }
}
