import React, { useCallback, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { View } from 'react-native';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ConnectWallet from './screens/ConnectWallet';

import { observer } from 'mobx-react';
import WalletState from './WalletState';
import MainScreen from './screens/MainScreen';
import { useFonts } from 'expo-font';
import SendCrypto from './screens/SendCrypto';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator()
const walletState = WalletState.getInstance()

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