interface DailyCostarsParams {
  date?: string;
  day_number?: number;
  after_date?: string;
  before_date?: string;
}

interface DailyStatsParams {
  user_id?: string;
}

interface UnlimitedStatsParams {
  user_id?: string;
}

interface SolutionParams {
  uuid?: string;
  user_id?: string;
  daily_id?: number;
  all_daily?: boolean;
  is_daily_optimal?: boolean;
  is_temporary?: boolean;
  before_date?: string;
}
