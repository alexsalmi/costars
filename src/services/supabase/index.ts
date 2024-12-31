import {
  sbGetDailyStats,
  sbPostDailyStats,
  sbUpdateDailyStats,
} from './dailyStats.supabase';

import {
  sbGetSolutions,
  sbPostSolutions,
  sbDeleteSolutions,
} from './solutions.supabase';

const SupabaseService = {
  dailyStats: {
    get: sbGetDailyStats,
    post: sbPostDailyStats,
    update: sbUpdateDailyStats,
  },
  solutions: {
    get: sbGetSolutions,
    post: sbPostSolutions,
    delete: sbDeleteSolutions,
  },
};

export default SupabaseService;
