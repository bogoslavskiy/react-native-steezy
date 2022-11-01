import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { View, Text } from './components/ui';
import { Steezy } from './styles';

export default function App() {
  const orientationIsLandscape = React.useRef(false);

  const toggleOrientation = () => {
    orientationIsLandscape.current = !orientationIsLandscape.current;
    const isLandscape = orientationIsLandscape.current;
    if (isLandscape === true) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    } else if(isLandscape === false) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.text}>Open up App.tsx to start working on your app!</Text>
        <Button title="Change Orientation" onPress={toggleOrientation} />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

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
