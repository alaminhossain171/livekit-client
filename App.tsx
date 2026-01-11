import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoomScreen } from './src/screens/RoomSceen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <RoomScreen />
    </SafeAreaView>
  );
};

export default App;
