
import { DefaultDynamicVars, DynamicVarsHook, WithStyleProp } from './types';
import { createStyleHook } from './createStyleHook';
import React, { forwardRef } from 'react';

export function createStyleHOC<TVars extends DefaultDynamicVars>(useDynamicVars: DynamicVarsHook<TVars>) {
  return function withSteezyStyle<C = unknown, P = Record<string, unknown>>(
    Component: React.ComponentType<P>
  ): React.ForwardRefExoticComponent<React.PropsWithoutRef<WithStyleProp<P>> & React.RefAttributes<C>> {
    const useStyle = createStyleHook(useDynamicVars);
    
    // TODO: forwardRef
    const ForwardComponent = forwardRef<C, WithStyleProp<P>>((props: any, ref) => {
      const { style, ...other } = props;
      const preparedStyle = useStyle(style);

      return <Component {...other} ref={ref} style={preparedStyle} />;
    });

    ForwardComponent.displayName = Component.displayName || `SteezyComponent(${Component.name})`

    return ForwardComponent;
  };
} 
