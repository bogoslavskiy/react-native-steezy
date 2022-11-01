import { createSteezy, createDynamicStyleVars, createMediaStyleVars } from "@bogoslavskiy/react-native-steezy";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";

export const media = createMediaStyleVars({
  isTablet: {
    minWidth: 706,
  },
  isLandscape: {
    orientation: 'landscape'
  }
});

export const variables = createDynamicStyleVars(() => {
  const safeArea = useSafeAreaInsets();
  const theme = useTheme();

  return {
    safeArea,
    colors: theme.colors,
  };
});

export const Steezy = createSteezy({
  media,
  variables,
  modificators: {
    width: (value) => value,
    height: (value) => value,
  },
});
