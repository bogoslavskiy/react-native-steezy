import { CleanMediaStyle, MediaRule, MediaRuleKeys, StaticStyles } from './types';
import { useWindowDimensions } from 'react-native';
import { isNil } from './helpers';
import { useMemo } from 'react';

export function useMediaQuery(query?: CleanMediaStyle | CleanMediaStyle[]) {
  const dims = useWindowDimensions(); // TODO: memo
  const height = dims.height ?? 0;
  const width = dims.width ?? 0;

  return useMemo(
    () => query ? iterateQuery(query, height, width) : [],
    [query, width, height]
  );
}

function queryResolver(query: MediaRule, width: number, height: number) {
  for (let queryKey in query) {
    const ruleKey = queryKey as MediaRuleKeys;
    if (!calculateQuery(queryKey, query[ruleKey]!, height, width)) {
      return false;
    }
  }
  return true;
}

function iterateQuery(
  query: CleanMediaStyle | CleanMediaStyle[],
  height: number,
  width: number
) {
  const iterableQuery = !Array.isArray(query) ? [query] : query;
  const queryResults: (StaticStyles | StaticStyles[])[] = [];

  iterableQuery.forEach((subQuery: CleanMediaStyle) => {
    const match = queryResolver(subQuery.rule, width, height);
    if (match) {
      queryResults.push(subQuery.style);
    }
  });

  const result = queryResults.length === 1 ? queryResults[0] : queryResults;
  
  return result as StaticStyles[];
}

function calculateQuery(
  key: string,
  val: number | string,
  height: number,
  width: number
) {
  let retval;
  if (isNil(width) || isNil(height) || isNil(val)) {
    return;
  }
  switch (key) {
    case 'maxWidth':
      retval = !isNil(val) ? width <= val : undefined;
      break;
    case 'minWidth':
      retval = !isNil(val) ? width >= val : undefined;
      break;
    case 'maxHeight':
      retval = !isNil(val) ? height <= val : undefined;
      break;
    case 'minHeight':
      retval = !isNil(val) ? height >= val : undefined;
      break;
    case 'orientation':
      if (!isNil(val)) {
        if (width > height) {
          retval = val === 'landscape';
        } else {
          retval = val === 'portrait';
        }
      }
      break;
    default:
      break;
  }
  return retval;
}
