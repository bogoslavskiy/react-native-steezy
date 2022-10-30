import { MediaStyleVars, PrepatedMediaQuery } from './types';

export function createMediaStyleVars<T>(vars: MediaStyleVars<T>) {
  const keys =  Object.keys(vars) as (keyof T)[];
  const acc = {} as PrepatedMediaQuery<T>;
  return keys.reduce<PrepatedMediaQuery<T>>((acc, key) => {
    acc[key] = `@media(${JSON.stringify(vars[key])})`;
    return acc;
  }, acc);
}
