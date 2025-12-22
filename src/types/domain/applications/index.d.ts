interface Application<T> {
  [method: string]: (...args: any[]) => Promise<T>;
}
