import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { EarningService } from './earning.service';
import { ElectricityService } from './electricity.service';
import { LayoutService } from './layout.service';
import { LogTableService } from './log-table.service';
import { OrderTableService } from './order-table.service';
import { OrdersChartService } from './orders-chart.service';
import { OrdersProfitChartService } from './orders-profit-chart.service';
import { PeriodsService } from './periods.service';
import { PlayerService } from './player.service';
import { ProfitBarAnimationChartService } from './profit-bar-animation-chart.service';
import { ProfitChartService } from './profit-chart.service';
import { StateService } from './state.service';
import { SymbolsService } from './symbols.service';
import { TrafficBarService } from './traffic-bar.service';
import { TrafficListService } from './traffic-list.service';
import { UserActivityService } from './user-activity.service';
import { UserService } from './users.service';

const SERVICES = [
  UserService,
  SymbolsService,
  ElectricityService,
  StateService,
  OrderTableService,
  LogTableService,
  PlayerService,
  UserActivityService,
  OrdersChartService,
  ProfitChartService,
  TrafficListService,
  PeriodsService,
  EarningService,
  OrdersProfitChartService,
  TrafficBarService,
  ProfitBarAnimationChartService,
  LayoutService,
];

@NgModule({
  imports: [CommonModule],
  providers: [...SERVICES],
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [...SERVICES],
    };
  }
}
