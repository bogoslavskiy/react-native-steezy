import { DefaultDynamicVars, DynamicVarsHook, StyleProp } from './types';
import { resolveStyleProp } from './resolveStyleProp';
import { useMediaQuery } from './useMediaResolver';
import { useMemo } from 'react';

export function createStyleHook<TVars extends DefaultDynamicVars>(useDynamicVars: DynamicVarsHook<TVars>) {
  const useStyle = (style: StyleProp) => {
    const vars = useDynamicVars();

    const preparedStyle = useMemo(
      () => resolveStyleProp(style, vars),
      [style, vars]
    );  
    
    const mediaStyle = useMediaQuery(preparedStyle.media);
    if (mediaStyle.length > 0) {
      const arr = !Array.isArray(preparedStyle.style)
        ? [preparedStyle.style]
        : preparedStyle.style;

      return Array.from(arr).concat(mediaStyle);
    }

    return preparedStyle.style;
  }

  return useStyle;
}
