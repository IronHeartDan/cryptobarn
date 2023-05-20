import React, { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { View } from 'react-native';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ConnectWallet from './screens/ConnectWallet';

import { observer } from 'mobx-react';
import walletState from './states/WalletState';
import MainScreen from './screens/MainScreen';
import { useFonts } from 'expo-font';
import SendCrypto from './screens/SendCrypto';

SplashScreen.preventAutoHideAsync();

const App = observer(() => {

  const [fontsLoaded] = useFonts({
    'RobotoMono': require('./assets/fonts/RobotoMono-VariableFont.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const Stack = createStackNavigator()

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {walletState.wallet ? (
            <Stack.Screen name='HomeScreen' component={MainScreen} options={{
              headerShown: false,
            }} />
          ) : (
            <Stack.Screen name='ConnectWallet' component={ConnectWallet} options={{
              headerShown: false,
            }} />
          )}
          <Stack.Screen name='SendCrypto' component={SendCrypto} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>

  )
})

export default App;