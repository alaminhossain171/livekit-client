import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const PrejoinScreen = () => {
  const navigation = useNavigation<any>();
  const [roomName, setRoomName] = useState('');
  const [participantName, setParticipantName] = useState('');

  const canJoin = roomName.trim() && participantName.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Join a Room</Text>
        <Text style={styles.subtitle}>
          Enter room ID and your name to continue
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Room name"
          value={roomName}
          onChangeText={setRoomName}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={participantName}
          onChangeText={setParticipantName}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, !canJoin && styles.buttonDisabled]}
          disabled={!canJoin}
          onPress={() => {
            navigation.navigate('RoomScreen', {
              roomName,
              participantName,
            });
          }}
        >
          <Text style={styles.buttonText}>Join Room</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PrejoinScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff', // dark background
    // justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  button: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
