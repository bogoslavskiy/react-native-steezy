import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';

export const isString = (query: string) => typeof query === 'string';
export const isMedia = (query: string) => query.indexOf('@media') === 0;
export const isPseudo = (query: string) => query.indexOf(':') === 0;
export const isDynamicStyle = (query: string) => isString(query) && query.indexOf('var') === 0;
export const isMediaOrPseudo = (query: string) =>  isMedia(query) || isPseudo(query);
export const isNil = <T>(v: T) => v === undefined;

export const parseDynamicVar = (value: string) => {
  const parsedVar = value.match(/--([a-zA-Z0-9]+)-([^\,\:\)]+)/);
  if (parsedVar) {
    const dynamicName = parsedVar[1];
    const dynamicValue = parsedVar[2];
    if (dynamicName && dynamicValue) {
      return { name: dynamicName, value: dynamicValue };
    }
  }

  return null;
}

export function createVarsProxy<T>(media: Record<string, string> = {}): T {
  return new Proxy({}, {
    get(_, varName, target) {
      if (typeof varName === 'string') {
        if (media[varName]) {
          return media[varName];
        }
        
        return new Proxy({}, {
          get(_, varValue) {
            if (typeof varValue === 'string') {
              return `var(--${varName}-${varValue})`;
            }

            return Reflect.get(_, varName, target);
          }
        }); 
      }

      return Reflect.get(_, varName, target);
    },
  }) as T;
}
