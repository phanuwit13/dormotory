import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/app/services/http.service";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
import { Sort } from "@angular/material/sort";

@Component({
  selector: "app-default-student",
  templateUrl: "./default-student.component.html",
  styleUrls: ["./default-student.component.scss"],
})
export class DefaultStudentComponent implements OnInit {
  public formStd_code: FormGroup;

  public formSearch: FormGroup;
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
  public fileName = null;
  public selectedFile: File = null;
  public lastNameFile: Array<any> = [];
  imagePath: any;
  imgURL: any;
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
      img: "",
      outRoom: false,
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
    this.getStudentAll().then(async (value) => {
      if (value == true) {
        this.spinner.hide();
      }
    });
  }

  showdata() {
    console.log(this.titleName);
  }

  getStudentAll = async () => {
    let formData = new FormData();
    formData.append("status", "2");
    let httpRespon: any = await this.http.post("getStudentAll", formData);
    this.checkConnect = true;
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      this.userData = await httpRespon.response.data;
      return true;
    } else {
      this.userData = null;
      return true;
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
      this.formStd_code.controls["img"].setValue(this.nameStudent[0].img);
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
    this.p = 1;
    this.userData = null;
    let formData = new FormData();
    formData.append("keyStd", this.keyStd.value);
    formData.append("status", "2");
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
    console.log(fcl + " " + lev);

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
      this.branch = httpRespon.response.data;
    } else {
      this.branch = null;
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

  async checkDataNull() {
    let i = 0;
    Object.keys(this.formStd_code.value).forEach((key) => {
      if (this.formStd_code.get(key).hasError("required")) {
        if (key == "floor" || key == "room_number" || key == "phone") {
        } else {
          i++;
        }
      }
    });
    if (i > 0) {
      return false;
    } else {
      return true;
    }
  }

  async editDataStd() {
    if (await this.checkDataNull()) {
      await Swal.fire({
        title: "คุณมั่นใจที่จะแก้ไขข้อมูล?",
        text: "คุณจะไม่สามารถยกเลิกสิ่งนี้ได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง !",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.value) {
          let formData = new FormData();
          let date = new Date();
          //วนลูบเก็บค่า key และ value
          Object.keys(this.formStd_code.value).forEach((key) => {
            formData.append(key, this.formStd_code.value[key]);
          });
          formData.append("status", "2");
          formData.append("room_number_old", this.room_number_old);
          formData.append("date_room", this.getDate());
          if (this.fileName != null) {
            formData.append("image", this.selectedFile, this.fileName);
            formData.append("img", this.fileName);
          }
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
    } else {
      Swal.fire("กรอกข้อมูลให้ครบ", "", "error");
    }
  }
  sortTable = (value: any) => {
    console.log(this.userData);
    console.log(value);
    this.userData.sort((a, b) =>
      a[value] > b[value] ? 1 : a[value] < b[value] ? -1 : 0
    );
  };
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
  advancedSearch = () => {
    this.branch = null;
    this.Faculty = null;
    this.levels = null;
    this.getLevels();
  };
  getAdvancedSearchData = async () => {
    this.p = 1;
    let formData = new FormData();
    //วนลูบเก็บค่า key และ value
    Object.keys(this.formSearch.value).forEach((key) => {
      formData.append(key, this.formSearch.value[key]);
      console.log(key + " : " + this.formSearch.value[key]);
    });
    formData.append("status", "2");
    let httpRespon: any = await this.http.post("advancedSearch", formData);
    console.log(httpRespon);
    if (httpRespon.response.data.length > 0) {
      console.log(httpRespon.response.success);
      this.userData = httpRespon.response.data;
      this.clearFormSearch();
    } else {
      this.userData = null;
      console.log(httpRespon.response.message);
      this.clearFormSearch();
    }
  };
  clearFormSearch() {
    Object.keys(this.formSearch.value).forEach((key) => {
      this.formSearch.controls[key].setValue("");
    });

    this.formSearch.controls["male"].setValue(false);
    this.formSearch.controls["female"].setValue(false);
  }
  gennarateCard = () => {
    window.localStorage.setItem("userData", JSON.stringify(this.userData));
    console.log(JSON.parse(window.localStorage.getItem("userData")));
  };

  gennarateCardSigle = (value: any) => {
    window.localStorage.setItem("userData", JSON.stringify([value]));
    console.log(JSON.parse(window.localStorage.getItem("userData")));
  };
  deleteStudent = async (value) => {
    await Swal.fire({
      title: "คุณมั่นใจที่จะลบข้อมูล?",
      text: "คุณจะไม่สามารถยกเลิกสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        let formData = new FormData();
        formData.append("std_code", value);
        let httpRespon: any = await this.http.post("deleteStudent", formData);
        console.log(httpRespon);
        if (httpRespon.response.success) {
          await Swal.fire(httpRespon.response.message, "", "success");
          this.getStudentAll();
        } else {
          Swal.fire(httpRespon.response.message, "", "error");
        }
      } else {
      }
    });
  };
  async onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    //console.log(event.target.files);
    //console.log(this.selectedFile);
    if (event.target.files.length === 0) {
      Swal.fire("กรุณาเลือกไฟล์รูปภาพ", "", "error");
      return;
    }
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      Swal.fire("กรุณาเลือกไฟล์รูปภาพ", "", "error");
      return;
    }
    this.lastNameFile = this.selectedFile.name.split(".");
    this.fileName =
      new Date().getTime() +
      "." +
      this.lastNameFile[this.lastNameFile.length - 1];
    //console.log(this.selectedFile.name);

    var reader = new FileReader();
    this.imagePath = event.target.files;
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }
  sortData(sort: Sort) {
    if(this.userData ==null){
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
        case "room_number":
          return compare(a.room_number, b.room_number, isAsc);
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
        default:
          return 0;
      }
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}