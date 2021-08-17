import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { iif, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.css', '../partial.component.css']
})
export class HelpSupportComponent implements OnInit, OnDestroy {
  public items: string[] = [];
  receiverChatListArray: any;
  messagebyGroupIdArray: any;
  chatGroupMemberArray: any;
  tblchatreceivedArray: any;
  defaultMsgBox: boolean = false;
  replayForm!: FormGroup;
  selectedFile: any;
  ImgUrl: any;
  getImgExt: any;
  imgName: any;
  infoUser: any;
  loginUserId: any;
  timeInterval: any;
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();
  // searchFilter:any;
  @ViewChildren('messages') messages: any;
  @ViewChild('content') content!: ElementRef;
  globalGroupId = 0;

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private router: Router, private route: ActivatedRoute,
    private commonService: CommonService, public datepipe: DatePipe, private _el: ElementRef) { }

  ngOnInit(): void {
    this.loginUserId = this.commonService.loggedInUserId();
    this.defualtForm();
    this.customFilter();
    this.getReceiverChatList();
    this.searchFilters(false);
  }

  defualtForm() {
    this.replayForm = this.fb.group({
      senderMsg: ['', Validators.required]
    })
  }

  customFilter() {
    this.filterForm = this.fb.group({
      searchFilter: ['']
    });
  }

  clearFilter() {
    this.filterForm.controls['searchFilter'].setValue('');
    this.getReceiverChatList();
  }

  getReceiverChatList() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_get_ReceiverChatList?UserId=' + this.commonService.loggedInUserId() + '&Search=' + this.filterForm.value.searchFilter, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.receiverChatListArray = res.data1;
      } else {
        this.spinner.hide();
        this.receiverChatListArray = [];
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getMessagebyGroupId(infoUser: any, GroupId: any, readStatus: any) {
    if (readStatus == 0) {
      this.getTblchatreceived(GroupId);
      if (infoUser.IsMember == 0) {
        this.joinChatGroupMember();
      }
    }

    this.defaultMsgBox = true;
    this.infoUser = infoUser;
    this.globalGroupId = this.infoUser.GroupId;
    console.log(this.infoUser);
    this.Chat_MessagebyGroupId(this.infoUser.GroupId)
  }

  Chat_MessagebyGroupId(GroupId: any) {
    this.callAPIService.setHttp('get', 'Web_get_HelpMe_Chat_MessagebyGroupId_All?UserId=' + this.commonService.loggedInUserId() + '&GroupId=' + GroupId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.messagebyGroupIdArray = res.data1;
        this.getReceiverChatList();
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })

  }
  joinChatGroupMember() {
    this.callAPIService.setHttp('get', 'Web_Join_ChatGroupMember?GroupId=' + this.commonService.loggedInUserId() + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.chatGroupMemberArray = res.data1;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getTblchatreceived(GroupId: any) {
    this.callAPIService.setHttp('get', 'Web_Insert_tblchatreceived_status?GroupId=' + GroupId + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.tblchatreceivedArray = res.data1;
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  UploadHelpMeChatMediaMsg() {
    let data = this.replayForm.value;
    if (data.senderMsg == "" || this.selectedFile == "") {
      this.toastrService.error('please Enter your data')
      return
    }
    let fromData = new FormData();
    let checkrecId:any;

    this.commonService.loggedInUserId() ==  this.infoUser.ReceiverId ? checkrecId = this.infoUser.SenderId :  checkrecId = this.infoUser.ReceiverId; 

    let MediaTypeId: any;
    this.selectedFile ? (MediaTypeId = 2) : (MediaTypeId = 1);
    fromData.append('MessageId', this.infoUser.MessageId);
    fromData.append('SenderId', this.commonService.loggedInUserId());
    fromData.append('ReceiverId', checkrecId);
    fromData.append('SenderMsg', data.senderMsg);
    fromData.append('MediaPath', this.selectedFile); //this.selectedFile
    fromData.append('MediaName', this.imgName); // this.imgName
    fromData.append('MessageTypeId', this.infoUser.MediaTypeId);  // 1 personal 2 group
    fromData.append('MediaTypeId', MediaTypeId); //1 for text, 2 for Image // 3 for video // 4 audio // 5 documnet 
    this.callAPIService.setHttp('post', 'Upload_HelpMe_Chat_Media_Message', false, fromData, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.replayForm.reset();
        this.getReceiverChatList();
        this.Chat_MessagebyGroupId(this.infoUser.GroupId)
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);

      } else {
        this.toastrService.error('Something went wrong please try again');
        this.spinner.hide();
        this.replayForm.reset();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  readUrl(event: any) {
    let selResult = event.target.value.split('.');
    this.getImgExt = selResult.pop();
    this.getImgExt.toLowerCase();
    if (this.getImgExt == "png" || this.getImgExt == "jpg" || this.getImgExt == "mp3" || this.getImgExt == "mp4") {
      this.selectedFile = <File>event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.ImgUrl = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.imgName = event.target.files[0].name;
      }
    }
    else {
      this.toastrService.error("Allowed only jpg, png, mp3 & mp4 format");
    }
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  closeImg() {
    this.ImgUrl = null;
    this.selectedFile = null;
    this.imgName = null;
  }
  onKeyUpFilter() {
    this.subject.next();
  }

  openInputFile() {
    let clickInputFile = document.getElementById("img-upload");
    clickInputFile?.click();
  }
  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.searchFilter == "" || this.filterForm.value.searchFilter == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject
      .pipe(debounceTime(700))
      .subscribe(() => {
        this.filterForm.value.searchFilter;
        this.getReceiverChatList()
      }
      );
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
