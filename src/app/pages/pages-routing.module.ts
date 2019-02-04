import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BacktestComponent } from './backtest/backtest.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogComponent } from './log/log.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'log',
        component: LogComponent,
      },
      {
        path: 'backtest',
        component: BacktestComponent,
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
