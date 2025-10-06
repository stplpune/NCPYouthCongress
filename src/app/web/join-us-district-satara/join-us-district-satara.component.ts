import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/services/validator.service';
import { ConfigService } from 'src/app/services/config.service';
import { CallAPIService } from 'src/app/services/call-api.service';
import { OtpVerificationComponent } from 'src/app/partial/dialogs/otp-verification/otp-verification.component';
import { ConfirmationComponent } from 'src/app/partial/dialogs/confirmation/confirmation.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';


@Component({
  selector: 'app-join-us-district-satara',
  templateUrl: './join-us-district-satara.component.html',
  styleUrls: ['./join-us-district-satara.component.css']
})
export class JoinUsDistrictSataraComponent implements OnInit {

joinUsForm: FormGroup | any;
  stateArray: any;
  districtArray: any;

  talukaArray: any = [{ "id": 3996, "name": "Man","mName": "माण", "code": 4259},{"id": 3272, "name": "Khatav","mName": "खटाव","code": 4260}];
  villageArray: any;
  nagarPalikaArray: any;
  submitted: boolean = false;
  language: any;
  genderArray = [{ id: 1, name: "Male" }, { id: 2, name: "Female" }, { id: 3, name: "Other" }];
  languageChange = new FormControl('');
  languageArray = ["English", "Marathi", "Hindi"];

  constructor(
    private fb: FormBuilder,
    private apiService: CallAPIService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public validation: ValidatorService,
    private translate: TranslateService,
    private config: ConfigService
  ) { }

  ngOnInit(): void {
    this.changeLanguage(localStorage.getItem('language') ? localStorage.getItem('language') : 'Marathi');
    this.joinUs_Form();
    this.getState();
    this.getOtherAddressList();
  }

  changeLanguage(lang?: any) {
    this.languageChange.setValue(lang);
    this.language = lang ? lang : 'Marathi';
    this.config.setLanguage.next(this.language);
    localStorage.setItem('language', lang);
    this.translate.use(this.language);
    this.genderArray = [{ id: 1, name: (this.language == 'English' ? "Male" : 'पुरुष') }, { id: 2, name: (this.language == 'English' ? "Female" : 'महिला') }, { id: 3, name: (this.language == 'English' ? "Other" : this.language == 'Hindi' ? 'अन्य' : 'इतर') }];
  }

  get f() { return this.joinUsForm.controls }
  joinUs_Form() {
    this.joinUsForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\u0900-\u097F\uA8E0-\uA8FF\s]+$/)]],
      gender: [1, [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
      address: ['', [Validators.pattern(/^[\u0900-\u097F\u0900-\u09FF\u0041-\u005A\u0061-\u007A\u0030-\u0039\s.,\-#'"/()]*$/)]],
      feedback: ['', [Validators.pattern('^[^[ ]+|[ ][gm]+$')]],
      stateId: [this.config.stateId, [Validators.required]],
      districtId: [this.config.districtId, [Validators.required]],
      talukaId: [4259],
      villageId: [''],
      nagarPalikaId: [''],
      ruralUrbanId: [1, [Validators.required]],
      isOTPVerified: [true],
      otp: [''],
      otherAddress: ['',[Validators.pattern(/^[\u0900-\u097F\u0900-\u09FF\u0041-\u005A\u0061-\u007A\u0030-\u0039\s.,\-#'"/()]*$/)]]
    })
    this.setClearValidation();
  }

  selRuralUrban(flag: any) {
    if (flag == 1) {
      // this.f["districtId"].value ? this.getTaluka() : '';
     this.getVillage();
    } else {
      this.f["districtId"].value ? this.getUrbanCity() : '';
    }
    // this.f["talukaId"].setValue('');
    this.f["villageId"].setValue('');
    this.f["nagarPalikaId"].setValue('');
    this.setClearValidation();
  }

  getState() {// 106 india
    this.apiService.setHttp('get', 'api/CommonDropdown/GetState?CountryId=' + this.config.countryId, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.responseData != null && res.statusCode == "200") {
        this.stateArray = res.responseData;
        this.getDistrict();
      } else { this.stateArray = []; }
    }, (error: any) => {
      this.router.navigate(['../500'], { relativeTo: this.route });
    })
  }

  getDistrict() {
    this.apiService.setHttp('get', 'api/CommonDropdown/GetDistrict?StateCode=' + this.f['stateId'].value, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.responseData != null && res.statusCode == "200") {
        this.districtArray = res.responseData;
        // this.getTaluka();
        this.getVillage();
      } else { this.districtArray = []; }
    }, (error: any) => {
      this.router.navigate(['../500'], { relativeTo: this.route });
    })
  }

  // getTaluka() {
  //   this.apiService.setHttp('get', 'api/CommonDropdown/GetTaluka?DistrictCode=' + this.f['districtId'].value, false, false, false, 'shisankalpOrg'); //old API Web_GetTaluka_1_0
  //   this.apiService.getHttp().subscribe((res: any) => {
  //     if (res.responseData != null && res.statusCode == "200") {
  //       this.talukaArray = res.responseData; 
  //       const allowedTalukaCodes = [4259, 4260]; // filter only satara district man & khatav talukas
  //       this.talukaArray = this.talukaArray
  //         .filter((item: any) => allowedTalukaCodes.includes(item.code)).sort((a: any, b: any) => {
  //           if (a.code === 4259) return -1; // Man first
  //           if (b.code === 4259) return 1;
  //           return 0; // keep Khatav next
  //         });
  //     } else { this.talukaArray = []; }
  //   }, (error: any) => {
  //     this.router.navigate(['../500'], { relativeTo: this.route });
  //   })
  // }

  getVillage() {
    let url = 'api/CommonDropdown/GetVillage?TalukaCode=' + this.f['talukaId'].value
    this.apiService.setHttp('get', url, false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.responseData != null && res.statusCode == "200") {
        this.villageArray = res.responseData;
      } else { this.villageArray = []; }
    }, (error: any) => {
      this.router.navigate(['../500'], { relativeTo: this.route });
    })
  }

  getUrbanCity() {
    this.apiService.setHttp('get', 'api/CommonDropdown/GetUrbanBody?DistrictCode=' + this.f['districtId'].value, false, false, false, 'shisankalpOrg'); //old API Web_GetTaluka_1_0
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.responseData != null && res.statusCode == "200") {
        this.nagarPalikaArray = res.responseData;
         this.nagarPalikaArray = this.nagarPalikaArray.filter((item: any) => item.code == 276417 || item.code == 276416 || item.code == 251589); // filter only satara district Cities man & khatav =>  Dahiwadi, vaduj, mhaswad
      } else { this.nagarPalikaArray = []; }
    }, (error: any) => {
      this.router.navigate(['../500'], { relativeTo: this.route });
    })
  }

  clearSelect(flag: any, sf?: any) {
    if (flag == 'state') {
      this.f["districtId"].setValue('');
      this.f["talukaId"].setValue('');
      this.f["villageId"].setValue('');
      this.f["nagarPalikaId"].setValue('');
      // this.f["ruralUrbanId"].setValue('');
      sf == 'select' ? this.getDistrict() : '';
    } else if (flag == 'district') {
      this.f["talukaId"].setValue('');
      this.f["villageId"].setValue('');
      this.f["nagarPalikaId"].setValue('');
      // sf == 'select' ? this.f['ruralUrbanId'].value == 1 ? this.getTaluka() : this.getUrbanCity() : '';
        sf == 'select' ? this.f['ruralUrbanId'].value == 1 ? '' : this.getUrbanCity() : '';
    } else if (flag == 'taluka') {
      this.f["villageId"].setValue('');
      sf == 'select' ? this.getVillage() : '';
    }
  }

  setClearValidation() {
    if (this.f['ruralUrbanId'].value == 1) {
      this.f["talukaId"].setValidators([Validators.required]); this.f["talukaId"].updateValueAndValidity();
      this.f["villageId"].setValidators([Validators.required]); this.f["villageId"].updateValueAndValidity();
      this.f['nagarPalikaId'].clearValidators(); this.f['nagarPalikaId'].updateValueAndValidity();
    } else {
      this.f["nagarPalikaId"].setValidators([Validators.required]); this.f["nagarPalikaId"].updateValueAndValidity();
      this.f['villageId'].clearValidators(); this.f['villageId'].updateValueAndValidity();
      this.f['talukaId'].clearValidators(); this.f['talukaId'].updateValueAndValidity();
    }
  }

  onSubmit() {
    this.setClearValidation();
    let formData = this.joinUsForm.value;
    this.submitted = true;
    this.spinner.show();
    if (this.joinUsForm.invalid) {
      this.spinner.hide();
      return;
    }else if(formData.isOTPVerified){
      this.otp();
      this.spinner.hide();
    } else {
      this.spinner.show();
      this.addNewMember();
    }
  }

 addNewMember(){
    this.spinner.hide();
    let formData = this.joinUsForm.getRawValue();
     let obj = {
        "id": 0,
        "name": formData.name,
        "gender": formData.gender == 1 ? 'Male' : formData.gender == 2 ? 'Female' : 'Other',
        "genderId": formData.gender,
        "mobileNo": formData.mobileNo,
        "stateCode": formData.stateId,
        "stateName": this.stateArray?.find((ele: any) => ele.code == this.f['stateId'].value)?.name || '',
        "districtCode": formData.districtId || 0,
        "districtName": this.districtArray?.find((ele: any) => ele.code == this.f['districtId'].value)?.name || '',
        "isRural": formData.ruralUrbanId,
        "ruralTalukaCode": formData.talukaId || 0,
        "ruralTalukaName": this.talukaArray?.find((ele: any) => ele.code == this.f['talukaId'].value)?.name || '',
        "ruralVillageCode": formData.villageId || 0,
        "ruralVillageName": this.villageArray?.find((ele: any) => ele.code == this.f['villageId'].value)?.name || '',
        "urbanCityCode": formData.nagarPalikaId || 0,
        "urbanCityName": this.nagarPalikaArray?.find((ele: any) => ele.code == this.f['nagarPalikaId'].value)?.name || '',
        "address": formData.address,
        "otherAddress": formData.otherAddress,
        "remark": formData.feedback,
        "createdDate": new Date(),
        "isDeleted": 0,
        "isOTPVerified":formData?.otp ? 1 : 0,
        "otp" : formData?.otp,
        isSelfReg:true,
        isMannkhatav_web: true 
      }

      this.apiService.setHttp('POST', 'Member/AddNewMember', false, obj, false, 'shisankalpOrg');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.spinner.hide();
          this.saveOtherAddress(); // to save other address
          this.clearForm();
          this.confirmModel();
          this.submitted = false;
        } else {
          this.spinner.hide();
          // this.toastrService.error(res.statusMessage);
          if(res.statusMessage.includes("This mobile number is already registered")){ 
            this.confirmModel(res.statusMessage);
          } else {
            this.toastrService.error(res.statusMessage);
          }
        }
      }, (error: any) => {
        this.spinner.hide();
        this.router.navigate(['../500'], { relativeTo: this.route });
      })
  }

  otp() {
    const dialogRef = this.dialog.open(OtpVerificationComponent, {
      data: { mobileNo: this.f['mobileNo'].value, name: this.f['name'].value },
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.label == 'withOtp') {
        this.f['otp'].setValue(result?.otp);
        this.addNewMember();
      } else if (result?.label == 'withOutOtp') {
        this.f['otp'].setValue('');
        this.addNewMember();
      }
    });
  }

  confirmModel(textMsg?:any) { // flag => flag true is member already exist
     let obj = textMsg ? ({ flag: true, textMsg: textMsg }) :
       { "textMsg": this.language == "English" ? "Your registration has been completed successfully, thank you."
        : this.language == "Hindi" ? "आपकी पंजीकरण सफलतापूर्वक हो गया है, धन्यवाद।" : "आपली नोंदणी यशस्वीरीत्या झाली आहे, धन्यवाद..."
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '400px',
      data: obj,
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
      }
    });
  }

  clearForm() {
    this.joinUs_Form();
    this.getDistrict();
    this.submitted = false;
  }


//..................................................  Autocomplete Other Addrss  ...............................................................//

   showSuggestions: boolean = false;
  filteredSuggestions: string[] = [];
  allPlaces: string[] = []; // Store all places fetched once


  saveOtherAddress() {
    let formData = this.joinUsForm.getRawValue();

    const isAlreadyExists = this.allPlaces.map(p => p.toLowerCase()).includes(formData.otherAddress.toLowerCase());

    if (isAlreadyExists) {
      return;
    } else {
      let obj = {
        "name": formData.otherAddress,
        "talukaId": 0
      }
      this.apiService.setHttp('POST', 'api/elasticSearch/Create', false, obj, false, 'shisankalpOrg');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
        } else {
        }
      }, (error: any) => {
      })
    }
  }

    getOtherAddressList() {
    this.apiService.setHttp('get', 'api/elasticSearch/GetAll', false, false, false, 'shisankalpOrg');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.data != null && res.statusCode == "200") {
        this.allPlaces = res.data.map((item:any) => item.name);
      } else { this.allPlaces = []; }
    }, (error: any) => {
      this.router.navigate(['../500'], { relativeTo: this.route });
    })
  }

  onOtherAddressInput() {
    const value = this.f.otherAddress.value;
    if (!value) {
      this.filteredSuggestions = [];
      return;
    }

    // Filter locally based on input
    this.filteredSuggestions = this.allPlaces.filter(item =>
      item.toLowerCase().startsWith(value.toLowerCase())
    );
    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  selectSuggestion(item: string) {
    this.joinUsForm.patchValue({ otherAddress: item });
    this.showSuggestions = false;
  }

  hideSuggestions() {
    setTimeout(() => this.showSuggestions = false, 200);
  }

}
