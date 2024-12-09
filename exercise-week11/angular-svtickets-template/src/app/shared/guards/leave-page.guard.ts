import { CanActivateFn } from '@angular/router';

export const leavePageGuard: CanActivateFn = (route, state) => {
  return true;
};
