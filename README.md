# React Native Steezy

Create Steezy
```js
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
    colors: theme.colors,
    safeArea,
  };
});

export const Steezy = createSteezy({
  variables,
  media,
});
```

Wrap Native Components
```js
import { 
  View as NativeView 
  Text as NativeText
} from 'react-native';

export const View = Steezy.withStyle(NativeView);
export const Text = Steezy.withStyle(NativeText);
```

Create styles
```js
const Component = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Text</Text>
  </View>
);

const styles = Steezy.create(({ colors, safeArea, isTablet, isLandscape }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: safeArea.top,
    marginBottom: safeArea.bottom,

    [isTablet]: {
      backgroundColor: colors.primary,
    },
    [isLandscape]: {
      backgroundColor: 'red',
    }
  },
  text: {
    color: 'green',
    
    [isLandscape]: {
      color: '#FFF',
    }
  }
}));
```