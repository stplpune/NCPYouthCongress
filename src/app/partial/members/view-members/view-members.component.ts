import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-members',
  templateUrl: './view-members.component.html',
  styleUrls: ['./view-members.component.css', '../../partial.component.css']
})
export class ViewMembersComponent implements OnInit {
  public items: string[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
