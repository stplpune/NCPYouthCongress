import { Component, OnInit } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-member-report',
  templateUrl: './member-report.component.html',
  styleUrls: ['./member-report.component.css', '../../partial.component.css']
})
export class MemberReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  printDiv(el:any) {
    var restorepage = $('body').html();
    var printcontent = $('#' + el).clone();
    $('body').empty().html(printcontent);
    window.print();
    $('body').html(restorepage);

    // var divContents:any = document.getElementById("printarea")
    // divContents.innerHTML;
    // var a:any = window.open('', '', 'height=500, width=500');
    // a.document.write('<html>');
    // a.document.write('<body > <h1>Div contents are <br>');
    // a.document.write(divContents);
    // a.document.write('</body></html>');
    // a.document.close();
    // a.print();
}
}