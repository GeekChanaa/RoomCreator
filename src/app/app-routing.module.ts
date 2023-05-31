import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanDesignerComponent } from './plan-designer/plan-designer.component';
import { PlanCreatorComponent } from './plan-creator/plan-creator.component';
import { FloorMenuComponent } from './plan-designer/menu/floor-menu/floor-menu.component';
import { WallsMenuComponent } from './plan-designer/menu/walls-menu/walls-menu.component';
import { FurnitureMenuComponent } from './plan-designer/menu/furniture-menu/furniture-menu.component';
import { RoofMenuComponent } from './plan-designer/menu/roof-menu/roof-menu.component';
import { MenuComponent } from './plan-designer/menu/menu.component';

const routes: Routes = [
  {
    path : 'plan',
    component : PlanDesignerComponent,
    children: [
      {
        path: 'floor-menu',
        component: FloorMenuComponent,
        outlet: 'menu3D'
      },
      {
        path: 'roof-menu',
        component: RoofMenuComponent,
        outlet: 'menu3D'
      },
      {
        path: 'furniture-menu',
        component: FurnitureMenuComponent,
        outlet: 'menu3D'
      },
      {
        path: 'walls-menu',
        component: WallsMenuComponent,
        outlet: 'menu3D'
      },
      {
        path: '',
        component: MenuComponent,
        children: [
          {
            path: 'floor-menu',
            component: FloorMenuComponent,
            outlet: 'menu3D'
          },
        ]
      }
    ]
  },
  {
    path : 'plan-creator',
    component : PlanCreatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
