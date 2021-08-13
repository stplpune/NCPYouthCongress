import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-forward-activities',
  templateUrl: './forward-activities.component.html',
  styleUrls: ['./forward-activities.component.css', '../partial.component.css']
})
export class ForwardActivitiesComponent implements OnInit {
  public items: string[] = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
  'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
  'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
  'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
  'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
  'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
  'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
  'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
  'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
  'Zagreb', 'Zaragoza', 'Łódź'];
 
  
  forwardActivitiForm!: FormGroup;
  submitted = false;
  allLevels: any;
  memberNameArray: any;
  
  constructor(
    private callAPIService: CallAPIService, 
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.customForm();
    this.getLevel();
  }

  customForm() {
    this.forwardActivitiForm = this.fb.group({
      activityTitle: ['', Validators.required],
      activityBody: ['', Validators.required],
      activityPhoto: ['', Validators.required],
      link: ['', Validators.required],
      attachment: ['', Validators.required],
      scopeOf_Activity: ['', Validators.required],
      selectValues: ['', Validators.required],
      hashtags_Activity: ['', Validators.required],
    })
  }

  get f() { return this.forwardActivitiForm.controls };
  
  onSubmit(){
    this.submitted = true;
    console.log(this.forwardActivitiForm.value);
    //this.clearForm();
  }

  getLevel() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetLevel_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allLevels = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

}
