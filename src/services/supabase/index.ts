import {
  sbGetSolutions,
  sbSaveSolutions,
  sbDeleteSolutions,
} from './solutions.supabase';

export default {
  solutions: {
    get: sbGetSolutions,
    save: sbSaveSolutions,
    delete: sbDeleteSolutions,
  },
};
