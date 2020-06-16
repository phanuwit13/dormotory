import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-data-card",
  templateUrl: "./data-card.component.html",
  styleUrls: ["./data-card.component.scss"],
})
export class DataCardComponent implements OnInit {
  public formStd_code: FormGroup;
  public nameStudent: Array<any> = null;
  public floor = [];
  public userData: Array<any> = null;
  public keyStd = new FormControl();
  p: number = 1;

  public Faculty = [];
  public titleName = ["นาย", "นาง", "นางสาว", "MR.", "MISS.", "MRS."];

  public branch = [];
  public room = [];
  public levels = [];
  public branchAll = [];
  public room_number_old: any = "";
  checkConnect = false;

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
      outRoom: false,
    });
    await this.getStudentAll();
  }

  showdata() {
    console.log(this.titleName);
  }

  getStudentAll = async () => {
    let httpRespon: any = await this.http.post("getStudentAll");
    this.checkConnect = true;
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = await httpRespon.response.data;
    } else {
      this.userData = null;
    }
  };
  async getStdcodeEdit(std) {
    //// สร้างฟังก์ชั่นมาใหม่ ดึงค่าตรงตัวมาเลย เพื่อมาเเก้ไข
    this.nameStudent = null;
    let formData = new FormData();
    formData.append("std_code", std);
    let httpRespon: any = await this.http.post("getStudentEdit", formData);
    await this.editData();
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.nameStudent = httpRespon.response.data;

      this.formStd_code.controls["std_code"].setValue(
        this.nameStudent[0].std_code
      );
      this.formStd_code.controls["nameTitle"].setValue(
        this.nameStudent[0].nameTitle
      );
      this.formStd_code.controls["fname"].setValue(this.nameStudent[0].fname);
      this.formStd_code.controls["lname"].setValue(this.nameStudent[0].lname);
      this.formStd_code.controls["groupStd"].setValue(
        this.nameStudent[0].groupStd
      );
      this.formStd_code.controls["phone"].setValue(this.nameStudent[0].phone);
      this.formStd_code.controls["noLevel"].setValue(
        this.nameStudent[0].noLevel
      );
      this.formStd_code.controls["faculty_code"].setValue(
        this.nameStudent[0].faculty_code
      );

      await this.getBranch(
        this.nameStudent[0].faculty_code,
        this.nameStudent[0].noLevel
      );
      this.formStd_code.controls["branch_code"].setValue(
        this.nameStudent[0].branch_code
      );
      this.formStd_code.controls["floor"].setValue(this.nameStudent[0].floor);
      await this.getRoom(
        this.nameStudent[0].nameTitle,
        this.nameStudent[0].floor,
        this.nameStudent[0].std_code
      );
      this.formStd_code.controls["room_number"].setValue(
        this.nameStudent[0].room_number
      );
      this.room_number_old = this.nameStudent[0].room_number;
    } else {
      this.nameStudent = null;
      alert("ไม่พบข้อมูล");
    }
  }
  async getStdcode(std) {
    //// สร้างฟังก์ชั่นมาใหม่ ดึงค่าตรงตัวมาเลย เพื่อมาเเก้ไข
    this.nameStudent = null;
    let formData = new FormData();
    formData.append("std_code", std);
    let httpRespon: any = await this.http.post("getStudent", formData);

    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.nameStudent = httpRespon.response.data;
    } else {
      this.nameStudent = null;
      alert("ไม่พบข้อมูล");
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

  editData() {
    this.getLevels();
    this.getFaculty();
    this.getFloor();
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
  async editDataStd() {
    await Swal.fire({
      title: "คุณมั่นใจที่จะแก้ไขข้อมูล?",
      text: "คุณจะไม่สามารถยกเลิกสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit it!",
    }).then(async (result) => {
      if (result.value) {
        let formData = new FormData();
        let date = new Date();
        //วนลูบเก็บค่า key และ value
        Object.keys(this.formStd_code.value).forEach((key) => {
          formData.append(key, this.formStd_code.value[key]);
        });
        formData.append("room_number_old", this.room_number_old);
        formData.append(
          "date_room",
          date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
        );
        let httpRespon: any = await this.http.post("editStd", formData);
        console.log(httpRespon);
        if (httpRespon.response.success) {
          await Swal.fire(httpRespon.response.message, "", "success");
          this.formStd_code.controls["outRoom"].setValue(false);
          this.getStudentAll();
          document.getElementById("closebutton").click();
        } else {
          Swal.fire(httpRespon.response.message, "", "error");
          this.formStd_code.controls["outRoom"].setValue(false);
          document.getElementById("closebutton").click();
        }
      } else {
      }
    });
  }
  sortTable = (value: any) => {
    console.log(this.userData);
    console.log(value);
    this.userData.sort((a, b) =>
      a[value] > b[value] ? 1 : a[value] < b[value] ? -1 : 0
    );
  };
  advancedSearch = () => {
    this.getFloor();
    this.getLevels();
  };
  getAdvancedSearchData = async () => {
    let formData = new FormData();
    let date = new Date();
    //วนลูบเก็บค่า key และ value
    Object.keys(this.formStd_code.value).forEach((key) => {
      formData.append(key, this.formStd_code.value[key]);
      console.log(key + " : " + this.formStd_code.value[key]);
    });

    let httpRespon: any = await this.http.post("advancedSearch", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      console.log(httpRespon.response.message);
      this.userData = httpRespon.response.data;
    } else {
      console.log(httpRespon.response.message);
      this.userData = null;
    }
    this.formStd_code.controls["faculty_code"].setValue("");
    this.formStd_code.controls["branch_code"].setValue("");
    this.formStd_code.controls["groupStd"].setValue("");
    this.formStd_code.controls["floor"].setValue("");
    this.formStd_code.controls["noLevel"].setValue("");
  };

  gennarateCard = () => {
    window.localStorage.setItem("userData", JSON.stringify(this.userData));
    console.log(JSON.parse(window.localStorage.getItem("userData")));
  };

  gennarateCardSigle = (value: any) => {
    window.localStorage.setItem("userData", JSON.stringify([value]));
    console.log(JSON.parse(window.localStorage.getItem("userData")));
  };
  deleteStudent = async (value) => {
    let formData = new FormData();
    formData.append("std_code", value);
    let httpRespone = this.http.post("/deleteStudent", formData);
  };
}
