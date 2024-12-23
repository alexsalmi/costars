const KEY_DAILY_STATS = 'cs-daily-stats';
const KEY_SOLUTIONS = 'cs-solutions';
const KEY_UNLIMITED_STATS = 'cs-unlimited-stats';
const KEY_AUTH_STATUS = 'cs-authenticated';

class LocalStorageService {
  hasSolutions = (): boolean => {
    return typeof window !== 'undefined' && (window.localStorage.getItem(KEY_SOLUTIONS) !== null);
  }

  getSolutions = (): Array<Solution> => {
    if (this.hasSolutions()){
      const solutions = JSON.parse(atob(window.localStorage.getItem(KEY_SOLUTIONS)!)) as Array<Solution>;
      return solutions;
    }

    const initialSolutions: Array<Solution> = [];

    window.localStorage.setItem(KEY_SOLUTIONS, btoa(JSON.stringify(initialSolutions)));

    return initialSolutions;
  }

  setSolutions = (solutions: Array<Solution>) => {
    window.localStorage.setItem(KEY_SOLUTIONS, btoa(JSON.stringify(solutions)));
  }

  saveSolution = (solution: Solution) => {
    const solutions = this.getSolutions();

    solutions.push(solution);
    
    window.localStorage.setItem(KEY_SOLUTIONS, btoa(JSON.stringify(solutions)));
  }

  hasDailyStats = (): boolean => {
    return typeof window !== 'undefined' && (window.localStorage.getItem(KEY_DAILY_STATS) !== null);
  }

  getDailyStats = (): DailyStats => {
    if (this.hasDailyStats()){
      const stats = JSON.parse(atob(window.localStorage.getItem(KEY_DAILY_STATS)!)) as DailyStats;
      return stats;
    }

    const initialDailyStats: DailyStats = {
      days_played: 0,
      current_streak: 0,
      highest_streak: 0,
      optimal_solutions: 0
    };

    window.localStorage.setItem(KEY_DAILY_STATS, btoa(JSON.stringify(initialDailyStats)));

    return initialDailyStats;
  }

  setDailyStats = (dailyStats: DailyStats) => {
    window.localStorage.setItem(KEY_DAILY_STATS, btoa(JSON.stringify(dailyStats)));
  }

  hasUnlimitedStats = (): boolean => {
    return typeof window !== 'undefined' && (window.localStorage.getItem(KEY_UNLIMITED_STATS) !== null);
  }

  getUnlimitedStats = (): UnlimitedStats => {
    if (this.hasUnlimitedStats()){
      const stats = JSON.parse(atob(window.localStorage.getItem(KEY_UNLIMITED_STATS)!)) as UnlimitedStats;
      return stats;
    }

    const initialUnlimitedStats: UnlimitedStats = {
      history: [],
      hints: [],
      high_score: 0
    };

    window.localStorage.setItem(KEY_UNLIMITED_STATS, btoa(JSON.stringify(initialUnlimitedStats)));

    return initialUnlimitedStats;
  }

  setUnlimitedStats = (unlimitedStats: UnlimitedStats) => {
    window.localStorage.setItem(KEY_UNLIMITED_STATS, btoa(JSON.stringify(unlimitedStats)));
  }

  setAuthStatus = (status: AuthStatus) => {
    window.localStorage.setItem(KEY_AUTH_STATUS, status);
  }

  getAuthStatus = ():  AuthStatus => {
    return window.localStorage.getItem(KEY_AUTH_STATUS) as AuthStatus;
  }

  clearStorage = () => {
    window.localStorage.removeItem(KEY_SOLUTIONS);
    window.localStorage.removeItem(KEY_DAILY_STATS);
    window.localStorage.removeItem(KEY_UNLIMITED_STATS);
  }
}

const localStorageService = new LocalStorageService();

export default localStorageService;