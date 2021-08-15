import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.css', '../partial.component.css']
})
export class HelpSupportComponent implements OnInit {
  public items: string[] = [];
  receiverChatListArray: any;
  messagebyGroupIdArray: any;
  chatGroupMemberArray: any;
  tblchatreceivedArray: any;
 
  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService, private router: Router,private route: ActivatedRoute,
    private commonService: CommonService, public datepipe: DatePipe,) { }

  ngOnInit(): void {
    this.getReceiverChatList();
    this.getMessagebyGroupId();
    this.getChatGroupMember();
    this.getTblchatreceived();
    this.UploadHelpMeChatMediaMsg()
  }

  getReceiverChatList() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_get_ReceiverChatList?UserId=' + this.commonService.loggedInUserId() + '&Search=' + '' , false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.receiverChatListArray = res.data1;
        console.log(this.receiverChatListArray)
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    } )
  }

  getMessagebyGroupId() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_get_HelpMe_Chat_MessagebyGroupId_All?UserId=' + this.commonService.loggedInUserId() + '&GroupId=' + 8 , false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.messagebyGroupIdArray = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    } )
  }

  getChatGroupMember() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Join_ChatGroupMember?GroupId=' + 8 + '&UserId=' + this.commonService.loggedInUserId() , false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.chatGroupMemberArray = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    } )
  }

  getTblchatreceived() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Insert_tblchatreceived_status?GroupId=' + 8 + '&UserId=' + this.commonService.loggedInUserId() , false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.tblchatreceivedArray = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    } )
  } 

  UploadHelpMeChatMediaMsg() {
    this.spinner.show();
    let fromData = new FormData();
    fromData.append('MessageId', '0');
    fromData.append('SenderId', '0');
    fromData.append('ReceiverId', '0');
    fromData.append('SenderMsg', '');
    fromData.append('MediaPath', '');
    fromData.append('MediaName', '');
    fromData.append('MessageTypeId', '0');
    fromData.append('MediaTypeId', '0');

    this.callAPIService.setHttp('post', 'Upload_HelpMe_Chat_Media_Message', false, fromData, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
       // this.submitted = false;
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg)
      } else {
        // this.toastrService.error(res.data1[0].Msg)
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

}
