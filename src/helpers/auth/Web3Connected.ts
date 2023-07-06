export const MetriMaskConnected = () => {
  if (window) {
    if ((window as any).metrimask) {
      const metrimask = (window as any).metrimask;
      // check if log in
      return metrimask.account.loggedIn && !!metrimask.account.address;
    }
  }
  return false;
};
