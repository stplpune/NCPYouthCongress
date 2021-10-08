import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
declare var $: any;
// import { jsPDF } from "jspdf";

@Component({
  selector: 'app-member-report',
  templateUrl: './member-report.component.html',
  styleUrls: ['./member-report.component.css', '../../partial.component.css']
})
export class MemberReportComponent implements OnInit {
  @ViewChild('pdfTable', {static: false}) pdfTable!: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  printPage() {
    window.print();
  }

  downloadPdf() {
    // let doc:any = new jsPDF();
    // const specialElementHandlers = {
    //   '#editor': (element:any, renderer:any)=>{
    //     return true;
    //   }
    // };

    // const pdfTable = this.pdfTable.nativeElement;

    // doc.fromHTML(pdfTable.innerHTML, 15, 15, {
    //   width: 190,
    //   'elementHandlers': specialElementHandlers
    // });

    // doc.save('tableToPdf.pdf');
  }
}