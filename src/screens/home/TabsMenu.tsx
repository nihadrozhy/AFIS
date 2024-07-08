import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, View } from 'react-native';
import Home from './Home';
import MyFlight from './MyFlight';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: { backgroundColor: '#F1EFEF', padding: 0, },
      headerShown: false,
    }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <View style={{ width: 100, alignItems: 'center' }}>
                <Text>Home</Text>
              </View>
            );
          },
          tabBarShowLabel: false
        }}
      />
      <Tab.Screen
        name="MyFlight"
        component={MyFlight}
        options={{
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <View style={{ width: 100, alignItems: 'center' }}>
                <Text>My Flight</Text>
              </View>
            );
          },
          tabBarShowLabel: false
        }}
      />

    </Tab.Navigator>
  );
}

export default function TabsMenu({ navigation }: any) {
  return (
    <MyTabs />
  );
}