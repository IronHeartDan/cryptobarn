import React, { useState } from 'react';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ConnectWallet from './Screens/ConnectWallet';
import HomeScreen from './Screens/HomeScreen';

import { observer } from 'mobx-react';
import WalletState from './WalletState';


const Stack = createStackNavigator()
const walletState = WalletState.getInstance()

const App = observer(() => (
  <NavigationContainer>
    <Stack.Navigator>
      {walletState.wallet ? (
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
      ) : (
        <Stack.Screen name='ConnectWallet' component={ConnectWallet} />
      )}
    </Stack.Navigator>
  </NavigationContainer>

))

export default App;