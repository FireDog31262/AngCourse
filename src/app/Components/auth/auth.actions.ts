import { Action } from "@ngrx/store";
import { User } from './user.model';

export const SET_AUTHENTICATED = '[Auth] SET_AUTHENTICATED';
export const SET_UNAUTHENTICATED = '[Auth] SET_UNAUTHENTICATED';

export class SetAuthenticated implements Action {
  readonly type = SET_AUTHENTICATED;
  constructor(public payload: { user: User }) {}
};

export class SetUnauthenticated implements Action {
  readonly type = SET_UNAUTHENTICATED;
};

export type AuthActions = SetAuthenticated | SetUnauthenticated;
