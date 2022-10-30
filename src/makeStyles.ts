import { StyleSheet } from 'react-native';
import { isDynamicStyle, isMedia, parseDynamicVar } from "./helpers";
import { AnyModificator, CreatedStyles, DynamicStyle, MediaStyle, NamedStyles, PreparedStyle, StaticStyles, StyleSheetConfig } from "./types";

export function makeStyles<TStyles, TVariablesHook, TMedia>(
  flatStyles: NamedStyles, 
  config: StyleSheetConfig<TVariablesHook, TMedia>, 
): CreatedStyles<TStyles> {
  const staticStyles: { [key: string]: StaticStyles } = {};
  const dynamicStyles: { [key: string]: DynamicStyle[] } = {};
  const mediaStyles: { [key: string]: MediaStyle[] } = {};

  Object.keys(flatStyles).map((styleName) => {
    const styles: Record<string, any> = flatStyles[styleName]; // TODO: any
    const rawDynamic: any = {};  // TODO: any
    
    // Prepare and cleaning styles 
    staticStyles[styleName] = Object.keys(styles).reduce<StaticStyles>((acc, prop) => {
      if (!styles[prop])  {
        return acc;
      }
      
      let value = styles[prop];
      
      if (isMedia(prop)) {
        try {
          const rule = prop.replace('@media(', '').replace(')', '');

          const styles = makeStyles<NamedStyles, TVariablesHook, TMedia>({ [styleName]: value }, config);
          const media = { rule: JSON.parse(rule), style: styles[styleName] };
         
          if (mediaStyles[styleName]) {
            mediaStyles[styleName].push(media);
          } else {
            mediaStyles[styleName] = [media];
          }
        } catch (err) {
          console.log('[Steezy]: error parse @media');
        }
      } else if (isDynamicStyle(value)) {
        const dynamicVar = parseDynamicVar(value);

        if (dynamicVar) {
          if (rawDynamic[dynamicVar.name]) {
            rawDynamic[dynamicVar.name][prop] = dynamicVar.value
          } else {
            rawDynamic[dynamicVar.name] = { [prop]: dynamicVar.value };
          }
        }
      } else { // Static style
        const staticKeyRule = prop as keyof StaticStyles;
        if (config.modificators) {
          const modificator = config.modificators[staticKeyRule];
          if (modificator) {
            value = (modificator as AnyModificator)(value);
          }
        }

        acc[staticKeyRule] = value;
      }

      return acc;
    }, {});

    // Group dynamic styles
    const dynamicKeys = Object.keys(rawDynamic);
    if (dynamicKeys.length > 0) {
      dynamicStyles[styleName] = dynamicKeys.reduce<any>((acc, dynamicKey) => { // TODO: any
        const value = rawDynamic[dynamicKey];

        acc.push({
          var: dynamicKey,
          resolver: (obj: Record<string, any>) => {
            return Object.keys(value).reduce<any>((acc, styleKey) => { // TODO: any 
              if (obj[value[styleKey]] === undefined) {
                console.warn(`${styleKey}: ${value[styleKey]}; ${value[styleKey]} not found in ${JSON.stringify(obj)}`);
              }
  
              acc[styleKey] = obj[value[styleKey]];
              return acc;
            }, ({}));
          }
        });

        return acc;
      }, []);
    }
  });

  const preparedStyles: PreparedStyle = {};
  const styleSheet = StyleSheet.create(staticStyles);

  Object.keys(styleSheet).forEach((styleName) => {
    preparedStyles[styleName] = {
      static: styleSheet[styleName],
    };
    
    if (dynamicStyles[styleName]) {
      preparedStyles[styleName]['dynamic'] = dynamicStyles[styleName];
    }

    if (mediaStyles[styleName]) {
      preparedStyles[styleName]['media'] = mediaStyles[styleName];
    }
  });

  return preparedStyles as CreatedStyles<TStyles>;
}
