import { Observable, combineLatest, debounceTime, distinctUntilChanged, map, timer } from 'rxjs';

export function debounceDistinctUntilChanged(dueTime: number) {
  return function <T>(source: Observable<T>) {
    return source.pipe(distinctUntilChanged(), debounceTime(dueTime));
  };
}

export function minTime(due: number) {
  return function <T>(source: Observable<T>) {
    return combineLatest([timer(due), source]).pipe(map(([_, obs]) => obs));
  };
}
