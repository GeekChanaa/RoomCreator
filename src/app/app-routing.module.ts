import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanDesignerComponent } from './plan-designer/plan-designer.component';
import { PlanCreatorComponent } from './plan-creator/plan-creator.component';

const routes: Routes = [
  {
    path : 'plan',
    component : PlanDesignerComponent
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
