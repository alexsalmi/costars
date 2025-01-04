const KEY_AUTH_STATUS = 'cs-authenticated';

export const lsGetAuthStatus = (): AuthStatus => {
  return window.localStorage.getItem(KEY_AUTH_STATUS) as AuthStatus;
};

export const lsPostAuthStatus = (status: AuthStatus) => {
  window.localStorage.setItem(KEY_AUTH_STATUS, status);
};
