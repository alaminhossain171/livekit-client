import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RoomScreen } from './src/screens/RoomSceen';
import RootStack from './src/navigation/RootStack';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RootStack />
    </SafeAreaProvider>
  );
};

export default App;
