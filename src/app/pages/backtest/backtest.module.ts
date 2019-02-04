import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '../common/common.module';
import { ActionsComponent } from './actions/actions.component';
import { BacktestComponent } from './backtest.component';
import { OrderTableComponent } from './order/order-table.component';
import { TradingviewComponent } from './tradingview/tradingview.component';

const components = [BacktestComponent, ActionsComponent, OrderTableComponent, TradingviewComponent];
@NgModule({
  imports: [ThemeModule, Ng2SmartTableModule, CommonModule],
  declarations: [...components],
})
export class BacktestModule {}
