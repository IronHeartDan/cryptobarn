import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import Transactions from './Transactions';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MainScreen() {
    const Tab = createMaterialBottomTabNavigator();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen name="Transactions" component={Transactions}
                    options={{
                        tabBarLabel: 'Transactions',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="history" color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen name="Settings" component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="face-man-profile" color={color} size={26} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    )
}