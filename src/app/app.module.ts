import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanDesignerComponent } from './plan-designer/plan-designer.component';
import { PlanCreatorComponent } from './plan-creator/plan-creator.component';
import { MenuComponent } from './plan-designer/menu/menu.component';
import { FloorMenuComponent } from './plan-designer/menu/floor-menu/floor-menu.component';
import { RoofMenuComponent } from './plan-designer/menu/roof-menu/roof-menu.component';
import { WallsMenuComponent } from './plan-designer/menu/walls-menu/walls-menu.component';
import { FurnitureMenuComponent } from './plan-designer/menu/furniture-menu/furniture-menu.component';

@NgModule({
  declarations: [		
    AppComponent,
      PlanDesignerComponent,
      PlanCreatorComponent,
      MenuComponent,
      FloorMenuComponent,
      RoofMenuComponent,
      WallsMenuComponent,
      FurnitureMenuComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
