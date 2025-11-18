import { Action } from '@ngrx/store';
import { AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED, SetAuthenticated } from './auth.actions';
import { User } from './user.model';

export interface State{
  isAuthenticated: boolean;
  user: User | null;
};

export const initialState: State = {
  isAuthenticated: false,
  user: null
};

export function authReducer(state = initialState, action: AuthActions | Action): State {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
        user: (action as SetAuthenticated).payload.user
      };
    case SET_UNAUTHENTICATED:
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

export const getIsAuthenticated = (state: State) => state.isAuthenticated;
export const getUser = (state: State) => state.user;

