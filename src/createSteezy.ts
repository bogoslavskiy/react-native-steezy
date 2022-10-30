import { DefaultDynamicVars, DynamicVarsHook, ExtractDynamicVars, ExtractMediaVars, PreparedStylesheet, StyleSheetConfig } from './types';
import { createStyleHook } from './createStyleHook';
import { createStyleHOC } from './createStyleHOC';
import { createVarsProxy } from './helpers';
import { makeStyles } from './makeStyles';

export function createSteezy<
  TVariablesHook extends DynamicVarsHook<DefaultDynamicVars>, 
  TMedia
>(config: StyleSheetConfig<TVariablesHook, TMedia>) {
  const createStyleSheet: PreparedStylesheet<
    ExtractDynamicVars<TVariablesHook>, 
    ExtractMediaVars<TMedia>
  > = (flatStyles) => {
    if (typeof flatStyles === 'function') {
      const vars = createVarsProxy<
        ExtractDynamicVars<TVariablesHook> & 
        ExtractMediaVars<TMedia>
      >(config.media);

      const styles = flatStyles(vars);
      return makeStyles(styles, config);
    }

    return makeStyles(flatStyles, config);
  };

  return {
    withStyle: createStyleHOC(config.variables),
    useStyle: createStyleHook(config.variables),
    create: createStyleSheet,
  };
}
