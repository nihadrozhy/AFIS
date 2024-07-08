import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as React from "react";

import { RootStackParamList } from "../../types";
import FlightDetails from "../screens/flights/FlightDetails";
import Flight from "../screens/flights/Flights";
import Home from "../screens/home/Home";
import MyFlight from "../screens/home/MyFlight";
import Splash from "../screens/home/Splash";
import TabsMenu from "../screens/home/TabsMenu";



export default function Navigation() {
  return (
    <NavigationContainer >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="TabsMenu" component={TabsMenu} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MyFlight" component={MyFlight} />

      <Stack.Screen name="Flight" component={Flight} />
      <Stack.Screen name="FlightDetails" component={FlightDetails} />

      {/*     <Stack.Screen name="Arrivals" component={Arrivals} /> */}
      {/*       <Stack.Screen name="Departures" component={Departures} />
 */}

    </Stack.Navigator>
  );
}