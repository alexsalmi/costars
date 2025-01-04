const KEY_FRESH_STATUS = 'cs-fresh';

export const lsGetFreshStatus = () => {
  return window.localStorage.getItem(KEY_FRESH_STATUS);
};

export const lsPostFreshStatus = () => {
  window.localStorage.setItem(KEY_FRESH_STATUS, 'fresh');
};

export const lsDeleteFreshStatus = () => {
  window.localStorage.removeItem(KEY_FRESH_STATUS);
};
