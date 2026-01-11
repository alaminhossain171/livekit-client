import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import PrejoinScreen from '../screens/PrejoinScreen';
import { RoomScreen } from '../screens/RoomSceen';

const Stack = createNativeStackNavigator();
const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PrejoinScreen"
          component={PrejoinScreen}
          options={{
            title: 'Pre-Join',
          }}
        />
        <Stack.Screen
          name="RoomScreen"
          component={RoomScreen}
          options={{
            title: 'Room',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
