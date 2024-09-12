export interface HydratableStore<T> {
  hydrate: (d: T) => void;
}
