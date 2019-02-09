import { Timezone } from '../../app/pages/backtest/tradingview/charting_library/datafeed-api';

export interface Exchange {
  value: string;
  name: string;
  desc: string;
}

export interface SymbolType {
  name: string;
  value: string;
}

export interface Configuration {
  exchanges?: Exchange[];
  supported_resolutions?: string[];
  supports_marks?: boolean;
  supports_time?: boolean;
  supports_timescale_marks?: boolean;
  symbols_types?: SymbolType[];
}

export interface LibrarySymbolInfo {
  /**
   * Symbol Name
   */
  name: string;
  full_name: string;
  base_name?: [string];
  /**
   * Unique symbol id
   */
  ticker?: string;
  description: string;
  type: string;
  /**
   * @example "1700-0200"
   */
  session: string;
  /**
   * Traded exchange
   * @example "NYSE"
   */
  exchange: string;
  listed_exchange: string;
  timezone: Timezone;
  /**
   * Code (Tick)
   * @example 8/16/.../256 (1/8/100 1/16/100 ... 1/256/100) or 1/10/.../10000000 (1 0.1 ... 0.0000001)
   */
  pricescale: number;
  /**
   * The number of units that make up one tick.
   * @example For example, U.S. equities are quotes in decimals, and tick in decimals, and can go up +/- .01. So the tick increment is 1. But the e-mini S&P futures contract, though quoted in decimals, goes up in .25 increments, so the tick increment is 25. (see also Tick Size)
   */
  minmov: number;
  fractional?: boolean;
  /**
   * @example Quarters of 1/32: pricescale=128, minmovement=1, minmovement2=4
   */
  minmove2?: number;
  /**
   * false if DWM only
   */
  has_intraday?: boolean;
  /**
   * An array of resolutions which should be enabled in resolutions picker for this symbol.
   */
  supported_resolutions: string[];
  /**
   * @example (for ex.: "1,5,60") - only these resolutions will be requested, all others will be built using them if possible
   */
  intraday_multipliers?: string[];
  has_seconds?: boolean;
  /**
   * It is an array containing seconds resolutions (in seconds without a postfix) the datafeed builds by itself.
   */
  seconds_multipliers?: string[];
  has_daily?: boolean;
  has_weekly_and_monthly?: boolean;
  has_empty_bars?: boolean;
  force_session_rebuild?: boolean;
  has_no_volume?: boolean;
  /**
   * Integer showing typical volume value decimal places for this symbol
   */
  volume_precision?: number;
  data_status?: 'streaming' | 'endofday' | 'pulsed' | 'delayed_streaming';
  /**
   * Boolean showing whether this symbol is expired futures contract or not.
   */
  expired?: boolean;
  /**
   * Unix timestamp of expiration date.
   */
  expiration_date?: number;
  sector?: string;
  industry?: string;
  currency_code?: string;
}

export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
