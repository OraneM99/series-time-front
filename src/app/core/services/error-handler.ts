import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function handleApiError<T>(defaultValue: T) {
  return catchError((err) => {
    console.error('Erreur API', err);
    return of(defaultValue);
  });
}
