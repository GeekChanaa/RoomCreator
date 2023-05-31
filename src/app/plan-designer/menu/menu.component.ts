import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuExpanded : boolean = false;

  constructor(
    private router : Router
  ) { }

  ngOnInit() {
  }

  expand(){
    this.menuExpanded = !this.menuExpanded;
    this.router.navigate(['/plan', { outlets: { menu3D: ['floor-menu'] } }]);
  }
}
