const KEY_SOLUTIONS = 'cs-solutions';

export const lsGetSolutions = (): Array<Solution> => {
  if (!lsHasSolutions()) return [];

  const solutions = JSON.parse(
    atob(window.localStorage.getItem(KEY_SOLUTIONS)!),
  ) as Array<Solution>;

  return solutions;
};

export const lsPostSolutions = (solutions: Solution | Array<Solution>) => {
  const existingSolutions = lsGetSolutions();

  if (!Array.isArray(solutions)) solutions = [solutions];

  // Remove credits array before saing to DB, takes up unnecessary space
  solutions = solutions.map((row) => ({
    ...row,
    solution: row.solution.map((sol) => ({
      ...sol,
      credits: undefined,
      popularity: undefined,
    })),
  }));

  existingSolutions.push(...solutions);

  window.localStorage.setItem(
    KEY_SOLUTIONS,
    btoa(JSON.stringify(existingSolutions)),
  );
};

export const lsDeleteSolutions = () => {
  window.localStorage.removeItem(KEY_SOLUTIONS);
};

export const lsHasSolutions = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.localStorage.getItem(KEY_SOLUTIONS) !== null
  );
};
