import {SerieInterface} from './serie.interface';

export interface SerieState {
  series: SerieInterface[];
  total: number;
  loading: boolean;
  error: string | null;
}

export const initialState: SerieState = {
  series: [],
  total: 0,
  loading: false,
  error: null,
};
