import { inject } from '@angular/core';
import {signalStore, withState, withMethods, patchState} from '@ngrx/signals';
import { SerieService } from '../services/api/serie.service';
import { initialState } from '../../interfaces/serie-state.interface';

export const SerieStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store, serieService = inject(SerieService)) => ({
    async loadSeries(page = 1, perPage = 12) {
      patchState(store, {loading: true, error: null});

      try {
        console.log('🔍 Appel API - page:', page, 'perPage:', perPage);
        const res = await serieService.getSeries(page, perPage);
        console.log('✅ Réponse API:', res);

        patchState(store, {
          series: res.items,
          total: res.total,
        });
      } catch (e) {
        console.error('❌ Erreur API complète:', e);

        // Debug supplémentaire
        if (e instanceof Error) {
          console.error('Message d\'erreur:', e.message);
          console.error('Stack:', e.stack);
        }

        patchState(store, {
          error: 'Impossible de charger les séries.',
          series: [],
          total: 0,
        });
      } finally {
        patchState(store, { loading: false });
      }
    },
  }))
);
