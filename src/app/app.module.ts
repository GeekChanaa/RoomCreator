import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanDesignerComponent } from './plan-designer/plan-designer.component';
import { PlanCreatorComponent } from './plan-creator/plan-creator.component';

@NgModule({
  declarations: [		
    AppComponent,
      PlanDesignerComponent,
      PlanCreatorComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
