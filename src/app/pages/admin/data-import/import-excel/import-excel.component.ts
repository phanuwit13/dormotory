import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http.service";
import { Component, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-import-excel",
  templateUrl: "./import-excel.component.html",
  styleUrls: ["./import-excel.component.scss"],
})
export class ImportExcelComponent implements OnInit {
  public userData: Array<any> = [];
  public formInsert: FormGroup;
  public formLogin: FormGroup;
  public data: Array<any> = [];
  public Faculty = [];
  public roomEmpty = [];
  public titleName = ["นาย", "นาง", "นางสาว", "MR.", "MISS.", "MRS."];
  public branch = [];
  public floor = [];
  public room = [];
  public levels = [];
  public branchAll = [];
  public datafail = [];
  public columnName = [
    "เลขห้อง",
    "รหัสนักศึกษา",
    "คำนำหน้า",
    "ชื่อ",
    "นามสกุล",
    "สาขา",
    "เบอร์โทรศัพท์",
  ];
  public editIndex = null;
  public header: Array<String> = [];
  p: number = 1;
  public selectedFile: File = null;
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.formInsert = this.formBuilder.group({
      std_code: ["", Validators.required],
      nameTitle: ["", Validators.required],
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      faculty_code: ["", Validators.required],
      branch_code: ["", Validators.required],
      groupStd: ["", Validators.required],
      floor: "",
      room_number: "",
      phone: "",
      noLevel: ["", Validators.required],
    });
    this.getStudentAll()
    this.getFaculty();
    this.getLevels();
    this.getFloor();
    this.getBranchAll();
  }

  getStudentAll = async () => {
    let formData = new FormData();
    formData.append("status", "1");
    let httpRespon: any = await this.http.post("getStudentExport", formData);
    if (httpRespon.response.data.length > 0) {
      this.userData = await httpRespon.response.data;
    } else {
      this.userData = null;
    }
  };
  getRoomEmpty = async (nameTitle) => {
    let formData = new FormData();
    formData.append("nameTitle", nameTitle);
    let httpRespon: any = await this.http.post("getRoomEmpty", formData);
    if (httpRespon.response.data.length > 0) {
      this.roomEmpty = await httpRespon.response.data;
    } else {
      this.roomEmpty = null;
    }
  };

  async getLevels() {
    let httpRespon: any = await this.http.post("level");
    if (httpRespon.response.data.length > 0) {
      this.levels = httpRespon.response.data;
    } else {
      this.levels = null;
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
  async getBranchAll() {
    let formData = new FormData();
    let httpRespon: any = await this.http.post("BranchAll");
    if (httpRespon.response.data.length > 0) {
      this.branchAll = httpRespon.response.data;
    } else {
      this.branchAll = null;
    }
  }
  async getFloor() {
    let httpRespon: any = await this.http.post("floor");
    if (httpRespon.response.data.length > 0) {
      this.floor = httpRespon.response.data;
    } else {
      this.floor = null;
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
    if (httpRespon.response.data.length > 0) {
      this.room = httpRespon.response.data;
      return;
    } else {
      this.room = [];
      return;
    }
  }

  async setDataStd() {
    let formData = new FormData();
    Swal.fire({
      title: "",
      text: "ยืนยันการเพิ่มข้อมูลนักศึกษา ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        await Object.keys(this.formInsert.value).forEach(async (key) => {
          formData.append(key, (await this.formInsert.value[key]) + "".trim());
        });
        let httpRespon: any = await this.http.post("addStudent", formData);
        if (httpRespon.response.success) {
          await Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: httpRespon.response.message,
          });
          for (let i = 0; i < this.datafail.length; i++) {
            if (i == this.editIndex) {
              this.datafail[i].error[0] = 1;
            }
          }
          this.formInsert.reset();
          document.getElementById("closebutton").click();
        } else {
          Swal.fire({
            icon: "error",
            title: "ไม่สำเร็จ",
            text: httpRespon.response.message,
          });
        }
      }
    });
  }
  /* <input type="file" (change)="onFileChange($event)" multiple="false" /> */
  /* ... (within the component class definition) ... */
   async onFileChange(evt: any) {
    this.selectedFile = <File>evt.target.files[0];
    if (evt.target.files.length === 0) {
      Swal.fire("", "กรุณาเลือกไฟล์", "error");
      return;
    }
    var mimeType = evt.target.files[0].type;
    if (
      mimeType.match(
        /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/
      ) == null
    ) {
      Swal.fire("", "กรุณาเลือกไฟล์ Excel", "error");
      return;
    }
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      this.checkColumn().then(async (value) => {
        if (value == true) {
          this.spinner.show();
          this.datafail = [];
          this.readDataStd().then((resule)=>{
            if(resule ==true)
            {
              this.spinner.hide();
              Swal.fire("", "เสร็จสิ้น", "success");
              this.data = [];
            }
          });

        } else {
          Swal.fire("", "คอลัมน์ไม่ถูกต้อง", "error");
          return;
        }
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }
  async checkColumn() {
    let i = 0;
    for (let n = 0; n < this.data[0].length; n++) {
      console.log();
      
      if (this.data[0][n] != this.columnName[n]) {
        return false;
      }
    }
    return true;
  }

  async readDataStd() {
    const promises = this.data.map(async (x, index) => {
      if (index != 0) {
        if (x != "") {

          if ((await this.chekNullCullumn(x)) == true) {
            if (!x[6]) {
              x[6] = "";
            }
            await this.importData(
              x[0] + "",
              x[1] + "",
              x[2] + "",
              x[3] + "",
              x[4] + "",
              x[5] + "",
              x[6] + ""
            );
          }
        }
      }
    })
    await Promise.all(promises)
    return true;
  }

  async chekNullCullumn(x: any) {
    let n = 0;
    for (let i = 0; i < 6; i++) {
      if (!x[i]) {
        x[i] = "";
        n = n + 1;
      }
    }

    if (n > 0) {
      if (!x[6]) {
        x[6] = "";
      }
      this.datafail.push({
        std_code: x[1] + "",
        room_number: x[0] + "",
        nameTitle: x[2] + "",
        fname: x[3] + "",
        lname: x[4] + "",
        branch_code: x[5] + "",
        phone: x[6] + "",
        error: [0, "กรุณาตรวจสอบข้อมูลนักศึกษา"],
      });
      return false;
    } 
    else {
      let checkTitle = 0
      for(let i =0 ; i<this.titleName.length ; i++)
      {
        
        if(x[2] == this.titleName[i])
        {
          checkTitle = checkTitle+1
        }
      }
      if(checkTitle == 0)
      { 
        if (!x[6]) {
          x[6] = "";
        }
        this.datafail.push({
          std_code: x[1] + "",
          room_number: x[0] + "",
          nameTitle: x[2] + "",
          fname: x[3] + "",
          lname: x[4] + "",
          branch_code: x[5] + "",
          phone: x[6] + "",
          error: [0, "กรุณาตรวจสอบคำนำหน้า"],
        });
        return false;
      }
      return true;
    }
  }

  async importData(
    room_number: string,
    std_code: string,
    nameTitle: string,
    fname: string,
    lname: string,
    branch_code: string,
    phone: string
  ) {
    let str = "";
    let bc = [];
    let i: number = 0;
    let m = 0;
    let formData = new FormData();
    let groupStd = [];
    //วนลูบเก็บค่า key และ value
    branch_code = await branch_code.trim();
    std_code = await std_code.trim();
    room_number = await room_number.trim();
    nameTitle = await nameTitle.trim();
    fname = await fname.trim();
    lname = await lname.trim();
    phone = await phone.trim();

    formData.append("room_number", room_number);
    formData.append("std_code", std_code);
    formData.append("nameTitle", nameTitle);
    formData.append("fname", fname);
    formData.append("lname", lname);

    for (m = 0; m < branch_code.length; m++) {
      i++;
      if (branch_code.charAt(m) > "0" && branch_code.charAt(m) < "9") {
        break;
      }
    }

    bc = await branch_code.split("", i - 2);

    bc.forEach((item) => {
      str += item;
    });

    this.branchAll.forEach((x) => {
      if (x.acronym == str) {
        formData.append("branch_code", x.branch_code);
        formData.append("faculty_code", x.faculty_code);
      }
    });
    groupStd = await branch_code.split(str + ".");

    formData.append("groupStd", groupStd[1]);
    formData.append("phone", phone);
    let httpRespon: any = await this.http.post("addStudent", formData);
    formData.forEach((value, key) => {
    });
    if (httpRespon.response.success) {
      this.datafail.push({
        std_code: std_code,
        room_number: room_number,
        nameTitle: nameTitle,
        fname: fname,
        lname: lname,
        branch_code: branch_code,
        phone: phone,
        error: [1, httpRespon.response.message],
      });
    } else {
      this.datafail.push({
        std_code: std_code,
        room_number: room_number,
        nameTitle: nameTitle,
        fname: fname,
        lname: lname,
        branch_code: branch_code,
        phone: phone,
        error: [0, httpRespon.response.message],
      });
    }
    return true
  }

  deleteDatabase() {
    Swal.fire({
      title: "ยืนยันการลบข้อมูล?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง !",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        let httpRespone: any = await this.http.post("deleteData");
        if (httpRespone.response.success) {
          Swal.fire(
            httpRespone.response.message,
            "Your file has been deleted.",
            "success"
          );
        } else {
          Swal.fire(
            httpRespone.response.message,
            "Your file has been deleted.",
            "error"
          );
        }
      }
    });
  }
  onloadSweet() {}

  async getStdbeforeInsert(
    std_code,
    nameTitle,
    fname,
    lname,
    branch_code,
    phone,
    room_number,
    index
  ) {
    this.editIndex = index;
    this.getFaculty();
    let str = "";
    let bc = [];
    let i: number = 0;
    let m = 0;
    let groupStd = [];
    this.formInsert.controls["std_code"].setValue(std_code);
    this.formInsert.controls["nameTitle"].setValue(nameTitle);
    this.formInsert.controls["fname"].setValue(fname);
    this.formInsert.controls["lname"].setValue(lname);
    this.formInsert.controls["phone"].setValue(phone);

    for (m = 0; m < branch_code.length; m++) {
      i++;
      if (branch_code.charAt(m) > "0" && branch_code.charAt(m) < "9") {
        break;
      }
    }

    bc = await branch_code.split("", i - 2);

    bc.forEach((item) => {
      str += item;
    });

    this.branchAll.forEach((x) => {
      if (x.acronym == str) {
        this.formInsert.controls["branch_code"].setValue(x.branch_code);
        this.formInsert.controls["faculty_code"].setValue(x.faculty_code);
        this.formInsert.controls["noLevel"].setValue(x.levels);
      }
    });
    this.getBranch(
      this.formInsert.value.faculty_code,
      this.formInsert.value.noLevel
    );
    await this.getRoom(nameTitle, room_number.split("")[1], std_code);
    groupStd = await branch_code.split(str + ".");
    this.formInsert.controls["groupStd"].setValue(groupStd[1]);
    this.formInsert.controls["floor"].setValue(room_number.split("")[1]);
    this.formInsert.controls["room_number"].setValue(room_number);
  }
  clearFormInsert() {
    this.formInsert.reset();
  }
  public onSubmitLogin = async () => {
    let formData = new FormData();
    //วนลูบเก็บค่า key และ value
    Object.keys(this.formLogin.value).forEach((key) => {
      formData.append(key, this.formLogin.value[key]);
    });
    let httpRespon: any = await this.http.post("login", formData);
    if (httpRespon.connect) {
      if (httpRespon.response.success) {
        if (httpRespon.response.data.role == "admin") {
          this.deleteDatabase();
          document.getElementById("closeModal").click()
        } else {
          await Swal.fire("ไม่ใช่ Admin", "", "error");
        }
      } else {
        Swal.fire(httpRespon.response.message, "", "error");
      }
    } else {
      Swal.fire("เชื่อมต่อเซิร์ฟเวอร์ผิดพลาด", "", "warning");
    }
  };

  async exportAsXLSX() {
    await this.spinner.show();          
    this.userData.forEach((item) => {
      this.data.push({
        เลขห้อง: item.room_number,
        รหัสนักศึกษา: item.std_code,
        คำนำหน้า: item.nameTitle,
        ชื่อ: item.fname,
        นามสกุล: item.lname,
        สาขา: item.groubStudent,
        เบอร์โทรศัพท์: item.phone,
      });
    });

    this.http.exportAsExcelFile(
      this.data,
      "ไฟล์ข้อมูลนักศึกษา_" + this.getDate()
    );
    this.data = [];
    this.spinner.hide();
    }

    async exportFormX() {
      await this.spinner.show();          
        this.data.push({
          เลขห้อง: "",
          รหัสนักศึกษา: "",
          คำนำหน้า: "",
          ชื่อ: "",
          นามสกุล: "",
          สาขา: "",
          เบอร์โทรศัพท์: "",
        });

      this.http.exportAsExcelFile(
        this.data,
        "ฟอร์มข้อมูลนักศึกษา_" + this.getDate()
      );
      this.data = [];
      this.spinner.hide();
      }

    getDate() {
      let date = new Date();
      let year = date.getFullYear().toString();
      let month = date.getMonth().toString();
      let day = date.getDate().toString();
      if (parseInt(month)  < 10) {
        month = "0" + (month + 1);
      }
      if (parseInt(day) < 10) {
        day = "0" + day;
      }
      return year + "-" + month + "-" + day;
    }
  
}
