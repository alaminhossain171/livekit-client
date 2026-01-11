import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { LiveKitRoom, AudioSession } from '@livekit/react-native';

import { RoomView } from '../components/RoomView';
import { fetchLiveKitToken } from '../services/livekit';

export const RoomScreen: React.FC = () => {
  // Form state
  const [roomName, setRoomName] = useState('');
  const [participantName, setParticipantName] = useState('');

  // LiveKit state
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Start AudioSession once
  useEffect(() => {
    AudioSession.startAudioSession();

    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  // Request permissions on Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  // Join room function
  const joinRoom = async () => {
    if (!roomName || !participantName) {
      alert('Please enter room name and your name');
      return;
    }

    setLoading(true);

    try {
      await requestPermissions();

      const res = await fetchLiveKitToken({
        roomName,
        participantName:
          participantName + '-' + Math.floor(Math.random() * 1000),
        role: 'admin', // or 'publisher' if student
      });

      console.log('LiveKit token response:', res);

      setToken(res.token);
      setUrl(res.livekitUrl);
    } catch (err) {
      console.error('Failed to join room', err);
      alert('Failed to join room. Check console for error.');
    } finally {
      setLoading(false);
    }
  };

  // Conditional rendering: show form first
  if (!token || !url) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Join a Room</Text>

        <TextInput
          style={styles.input}
          placeholder="Room Name"
          value={roomName}
          onChangeText={setRoomName}
          placeholderTextColor={'black'}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={participantName}
          onChangeText={setParticipantName}
          placeholderTextColor={'black'}
        />

        <Button title="Join Room" onPress={joinRoom} />

        {loading && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    );
  }

  // LiveKit Room view
  return (
    <LiveKitRoom
      serverUrl={url}
      token={token}
      connect
      audio={true}
      video={true}
      options={{
        adaptiveStream: { pixelDensity: 'screen' },
      }}
    >
      <RoomView />
    </LiveKitRoom>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
