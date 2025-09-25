import { Injectable } from '@angular/core';
import { SerieInterface } from '../../../interfaces/serie.interface';

@Injectable({ providedIn: 'root' })
export class SerieService {

  async getSeries(page = 1, limit = 12): Promise<{ items: SerieInterface[]; total: number }> {
    const res = await fetch(`/api/series?page=${page}&limit=${limit}`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erreur API: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  }

  async getSerieById(id: number): Promise<SerieInterface> {
    const res = await fetch(`/api/series/${id}`);
    if (!res.ok) throw new Error('Erreur API');
    return res.json();
  }

  async toggleFavorite(id: number): Promise<{ ok: boolean; status: string }> {
    const res = await fetch(`/api/series/${id}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Erreur API favoris');
    return res.json();
  }
}
