interface DailyStatsParams {
  user_id?: string;
}

interface SolutionParams {
  uuid?: string;
  user_id?: string;
  daily_id?: number;
  all_daily?: boolean;
  is_daily_optimal?: boolean;
  is_temporary?: boolean;
  after_date?: string;
}
