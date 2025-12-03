import {UserProfile} from '../../models/User';
import { signalStore } from '@ngrx/signals';

type AppState = {
  user: UserProfile | undefined
}

const initialState: AppState = {
  user: undefined
}

export const AppStore = signalStore<AppState>(initialState);
