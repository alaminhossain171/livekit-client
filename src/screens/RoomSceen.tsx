import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { LiveKitRoom, AudioSession } from '@livekit/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { RoomView } from '../components/RoomView';
import { fetchLiveKitToken } from '../services/livekit';

export const RoomScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { roomName, participantName } = route.params || {};

  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio lifecycle
  useEffect(() => {
    AudioSession.startAudioSession();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  useEffect(() => {
    if (roomName && participantName) {
      joinRoom();
    } else {
      setError('Missing room or participant name');
      setLoading(false);
    }
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      const denied = Object.values(result).some(
        status => status !== PermissionsAndroid.RESULTS.GRANTED,
      );

      if (denied) {
        throw new Error('Camera or microphone permission denied');
      }
    }
  };

  const joinRoom = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await requestPermissions();

      const res = await fetchLiveKitToken({
        roomName,
        participantName:
          participantName + '-' + Math.floor(Math.random() * 1000),
        role: 'admin',
      });

      setToken(res.token);
      setUrl(res.livekitUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  }, [roomName, participantName]);

  // ───────── UI STATES ─────────

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Joining room…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Unable to Join</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!token || !url) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Invalid LiveKit session</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiveKitRoom
        serverUrl={url}
        token={token}
        connect={true}
        audio={true}
        video={false}
        options={{
          adaptiveStream: { pixelDensity: 'screen' },
        }}
      >
        <RoomView navigation={navigation} />
      </LiveKitRoom>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
});
