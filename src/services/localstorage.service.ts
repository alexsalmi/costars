const KEY_DAILY_STATS = 'cs-daily-stats';
const KEY_SOLUTIONS = 'cs-solutions';
const KEY_UNLIMITED_STATS = 'cs-unlimited-stats';

class LocalStorageService {
  getSolutions = (): Array<Solution> => {
    if (typeof window !== 'undefined' && (window.localStorage.getItem(KEY_SOLUTIONS) !== null)){
      const solutions = JSON.parse(atob(window.localStorage.getItem(KEY_SOLUTIONS)!)) as Array<Solution>;
      return solutions;
    }

    const initialSolutions: Array<Solution> = [];

    window.localStorage.setItem(KEY_SOLUTIONS, btoa(JSON.stringify(initialSolutions)));

    return initialSolutions;
  }

  saveSolution = (solution: Solution) => {
    const solutions = this.getSolutions();

    solutions.push(solution);
    
    window.localStorage.setItem(KEY_SOLUTIONS, btoa(JSON.stringify(solutions)));
  }

  getDailyStats = (): DailyStats => {
    if (typeof window !== 'undefined' && (window.localStorage.getItem(KEY_DAILY_STATS) !== null)){
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

  updateDailyStats = (dailyStats: DailyStats) => {
    window.localStorage.setItem(KEY_DAILY_STATS, btoa(JSON.stringify(dailyStats)));
  }

  getUnlimitedStats = (): UnlimitedStats => {
    if (typeof window !== 'undefined' && (window.localStorage.getItem(KEY_UNLIMITED_STATS) !== null)){
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

  updateUnlimitedStats = (unlimitedStats: UnlimitedStats) => {
    window.localStorage.setItem(KEY_UNLIMITED_STATS, btoa(JSON.stringify(unlimitedStats)));
  }
}

const localStorageService = new LocalStorageService();

export default localStorageService;