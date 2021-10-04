import { Component, OnInit } from '@angular/core';
import { Location} from  '@angular/common';
@Component({
  selector: 'app-election-profile',
  templateUrl: './election-profile.component.html',
  styleUrls: ['./election-profile.component.css', '../../partial.component.css']
})
export class ElectionProfileComponent implements OnInit {

  constructor( public location:Location) { }

  ngOnInit(): void {
  }

}
