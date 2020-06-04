import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-save-rule",
  templateUrl: "./save-rule.component.html",
  styleUrls: ["./save-rule.component.scss"],
})
export class SaveRuleComponent implements OnInit {
  public formStd_code: FormGroup;
  public userData: any = null;
  public titleName = ["นาย", "นาง", "นางสาว"];
  public levels = [];
  public branch = [];
  public branchAll = [];
  public Faculty = [];
  //public rule = new FormControl();
  public ruleChoice: Array<any> = null;
  public nameStudent: Array<any> = null;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}
  async ngOnInit() {
    this.formStd_code = this.formBuilder.group({
      std_code: ["", Validators.required],
      rulesBreak: ["", Validators.required],
      date_rule: [new Date("2020-11-12"), Validators.required],
      time_rule: ["", Validators.required],
      other: ["", Validators.required],
      details: ["", Validators.required],
      nameTitle: ["", Validators.required],
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      faculty_code: ["", Validators.required],
      branch_code: ["", Validators.required],
      groupStd: ["", Validators.required],
      phone: ["", Validators.required],
      noLevel: ["", Validators.required],
    });
    this.getFaculty();
    this.getLevels();
    this.getBranchAll();
    let httpRespon: any = await this.http.post("Rule");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.ruleChoice = httpRespon.response.data;
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
  async getBranchAll() {
    let formData = new FormData();
    let httpRespon: any = await this.http.post("BranchAll");
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.branchAll = httpRespon.response.data;
    } else {
      this.branchAll = null;
    }
  }
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
    let httpRespon: any = await this.http.post("getStudent", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.nameStudent = httpRespon.response.data;
    } else {
      this.nameStudent = null;
    }
  };
  public setStd_rule = async () => {
    this.userData = null;
    let formData = new FormData();
    this.formStd_code.value.date_rule =
      this.formStd_code.value.date_rule.getFullYear() +
      "-" +
      (this.formStd_code.value.date_rule.getMonth() + 1) +
      "-" +
      this.formStd_code.value.date_rule.getDate();
    //วนลูบเก็บค่า key และ value
    Object.keys(this.formStd_code.value).forEach((key) => {
      formData.append(key, this.formStd_code.value[key]);
    });

    console.log(this.formStd_code.value);
    let httpRespon: any = await this.http.post("setStudentRule", formData);
    console.log(httpRespon);
    if (httpRespon.response.data > 0) {
      alert("บันทึกข้อมูลสำเร็จ");
    } else {
      alert("บันทึกข้อมูลไม่สำเร็จ ตรวจดีๆ");
    }
  };
  public clearData = async () => {
    this.nameStudent = null;

    // this.formStd_code.controls["std_code"].setValue("");
    // this.formStd_code.controls["rulesBreak"].setValue("");
    // this.formStd_code.controls["date_rule"].setValue("");
    // this.formStd_code.controls["time_rule"].setValue("");
    // this.formStd_code.controls["other"].setValue("");
    // this.formStd_code.controls["details"].setValue("");
    this.formStd_code.reset();
  };
}
