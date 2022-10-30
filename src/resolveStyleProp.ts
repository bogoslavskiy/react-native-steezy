import { CleanMediaStyle, DefaultDynamicVars, ResolveStyleProp, StaticStyles, Style, StyleProp } from "./types";

export function resolveStyleProp<TVars extends DefaultDynamicVars>(styleProp?: StyleProp, vars?: TVars): ResolveStyleProp {
  if (!styleProp) {
    return {};
  } 

  const mixedStyles: StyleProp = !Array.isArray(styleProp) ? [styleProp] : styleProp;
  const cleanStyles: StaticStyles[] = [];

  const mediaStyles: CleanMediaStyle[] = [];
  mixedStyles.map((mixStyle) => {
    const preparedStyle = mixStyle as Style<TVars>;
    const otherStyle = mixStyle as StaticStyles;
 
    if (preparedStyle && preparedStyle.static) {
      cleanStyles.push(preparedStyle.static);

      if (preparedStyle.dynamic && vars) {
        preparedStyle.dynamic.map((dynamic) => {
          const value = vars[dynamic.var];
          if (value) {
            const res = dynamic.resolver(value);
            cleanStyles.push(res);
          }
        });
      }

      if (preparedStyle.media) {
        preparedStyle.media.map((media) => {
          const itemMedia = [];
          if (media.style.static) {
            itemMedia.push(media.style.static);
          }
          
          if (media.style.dynamic && vars) {
            media.style.dynamic.map((dynamic) => {
              const value = vars[dynamic.var];
              if (value) {
                const res = dynamic.resolver(value);
                itemMedia.push(res);
              }
            });
          }

          const style = itemMedia.length === 1 ? itemMedia[0] : itemMedia;
          mediaStyles.push({ rule: media.rule, style });
        });
      }
    } else {
      cleanStyles.push(otherStyle);
    }
  });

  const style = cleanStyles.length === 1 ? cleanStyles[0] : cleanStyles;
  const media = mediaStyles.length === 1 ? mediaStyles[0] : mediaStyles;

  return { style, media };
}
