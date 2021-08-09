import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-party-program-details',
  templateUrl: './party-program-details.component.html',
  styleUrls: ['./party-program-details.component.css', '../../../partial.component.css']
})
export class PartyProgramDetailsComponent implements OnInit {

  constructor(public location:Location) { }

  ngOnInit(): void {
  }

}
