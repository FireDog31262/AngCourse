import { Action } from '@ngrx/store';
import { START_LOADING, STOP_LOADING } from './ui.actions';

export interface State{
  isLoading: boolean;
};

export const initialState: State = {
  isLoading: false
};

export function uiReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case STOP_LOADING:
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const getIsLoading = (state: State) => state.isLoading;

