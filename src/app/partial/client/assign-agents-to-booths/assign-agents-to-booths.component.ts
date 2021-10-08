import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-agents-to-booths',
  templateUrl: './assign-agents-to-booths.component.html',
  styleUrls: ['./assign-agents-to-booths.component.css', '../../partial.component.css']
})
export class AssignAgentsToBoothsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}








// import { Component, OnInit } from '@angular/core';
// import {FlatTreeControl} from '@angular/cdk/tree';
// import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

//   interface FoodNode {
//     name: string;
//     children?: FoodNode[];
//   }
  
//   const TREE_DATA: FoodNode[] = [
//     {
//       name: 'Fruit',
//       children: [
//         {name: 'Apple'},
//         {name: 'Banana'},
//         {name: 'Fruit loops'},
//       ]
//     }, {
//       name: 'Vegetables',
//       children: [
//         {
//           name: 'Green',
//           children: [
//             {name: 'Broccoli'},
//             {name: 'Brussels sprouts'},
//           ]
//         }, {
//           name: 'Orange',
//           children: [
//             {name: 'Pumpkins'},
//             {name: 'Carrots'},
//           ]
//         },
//       ]
//     },
//   ];
  
//   /** Flat node with expandable and level information */
//   interface ExampleFlatNode {
//     expandable: boolean;
//     name: string;
//     level: number;
//   }
  
//   /**
//    * @title Tree with flat nodes
//    */
//    @Component({
//     selector: 'app-assign-agents-to-booths',
//     templateUrl: './assign-agents-to-booths.component.html',
//     styleUrls: ['./assign-agents-to-booths.component.css', '../../partial.component.css']
//   }) 
//   export class AssignAgentsToBoothsComponent {
//     private _transformer = (node: FoodNode, level: number) => {
//       return {
//         expandable: !!node.children && node.children.length > 0,
//         name: node.name,
//         level: level,
//       };
//     }
  
//     treeControl = new FlatTreeControl<ExampleFlatNode>(
//         node => node.level, node => node.expandable);
  
//     treeFlattener = new MatTreeFlattener(
//         this._transformer, node => node.level, node => node.expandable, node => node.children);
  
//     dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
//     constructor() {
//       this.dataSource.data = TREE_DATA;
//     }
  
//     hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
//   }
  