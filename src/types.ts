import { ImageStyle, TextStyle, ViewStyle as RNViewStyle, StyleProp as RNStyleProp } from "react-native";

export type DynamicStyleResolver = (obj: Record<string, any>) => Record<string, any>;  

export type DynamicStyle = {
  resolver: DynamicStyleResolver;
  var: string;
}

export type StaticStyles = ViewStyle | TextStyle | ImageStyle;
export type NestedStaticStyles = ViewStyle | ImageStyle | StaticStyles[];
export type MixedPossibleStyles = StaticStyles;

export type MediaStyle = {
  rule: MediaRule;
  style: {
    static: StaticStyles;
    dynamic?: DynamicStyle[];
  };
}

export type CleanMediaStyle = {
  style: StaticStyles | StaticStyles[];
  rule: MediaRule;
}

export type ResolveStyleProp = {
  style?: NestedStaticStyles;
  media?: CleanMediaStyle | CleanMediaStyle[];
}

export type ViewStyle = RNViewStyle;

export type CSSNamedStyles<T> = { [P in keyof T]: string };
export type NamedStyles = { [key: string]: MixedPossibleStyles };
export type CleanNamedStyles<T> = { [P in keyof T]: StaticStyles };

export type StylesArgs<T = {}> = T;
export type StylesFunc = (stylesArgs: StylesArgs) => NamedStyles;

export type Style<T = StaticStyles> = {
  static: T;
  dynamic?: DynamicStyle[];
  media?: MediaStyle[];
};

export type CreatedStyles<T> = { [P in keyof T]: Style<T[P]> }

export type WithStyleProp<P, T = StaticStyles> = Omit<P, 'style'> & { 
  style?: StyleProp<T>;
};

export type StyleProp<T = MixedPossibleStyles> = RNStyleProp<T | Style<T>>;

export type SteezyModificators = {
  [key in keyof StaticStyles]?: (value: Exclude<StaticStyles[key], undefined>) => StaticStyles[key];
}

export type AnyModificator = (value: any) => any;

export type MediaRuleKeys =
  | 'maxWidth'
  | 'minWidth'
  | 'maxHeight'
  | 'minHeight'
  | 'orientation';

export type MediaRule = { [key in MediaRuleKeys]?: number | string };
export type MediaStyleVars<T> = { [key in keyof T]: MediaRule };
export type PrepatedMediaQuery<T> = { [key in keyof T]: string };

export type DefaultDynamicVars = { [key: string]: any };

export type DynamicVarsHook<TVars> = () => TVars;

export type ExtractDynamicVars<TPConfigVars> =
  TPConfigVars extends DynamicVarsHook<infer TVars>
    ? TVars
    : TPConfigVars;

export type ExtractMediaVars<TMedia> = { 
  [key in keyof TMedia]: 'media';
};

export type PreparedStylesheet<TVariables, TMedia> = <T extends NamedStyles>(flatStyles: T | ((options: StylesArgs<TVariables & TMedia>) => T)) => CreatedStyles<T & TMedia>;

export type StyleSheetConfig<TVariables, TMedia> = {
  media: PrepatedMediaQuery<TMedia>;
  modificators?: SteezyModificators;
  variables: TVariables;
}

export type PreparedStyle = {
  [key: string]: Style;
}
