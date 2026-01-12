import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import {
  useLocalParticipant,
  useRoomContext,
  useTracks,
} from '@livekit/react-native';
import { Track } from 'livekit-client';

export const RoomControls = ({ onEndCall }: { onEndCall: () => void }) => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const room = useRoomContext();
  const tracks = useTracks([
    { source: Track.Source.Microphone, withPlaceholder: true },
  ]);
  const speakingParticipant = tracks.find(
    t => t.participant?.isSpeaking,
  )?.participant;

  const someoneElseSpeaking =
    speakingParticipant && speakingParticipant.sid !== localParticipant.sid;

  // q

  const leaveCall = () => {
    room.disconnect();
    onEndCall(); // navigate back
  };
  const talkPressIn = () => {
    if (!isMicrophoneEnabled) {
      localParticipant.setMicrophoneEnabled(true);
    }
  };

  const talkPressOut = () => {
    localParticipant.setMicrophoneEnabled(false);
  };
  return (
    <View style={styles.container}>
      <Pressable
        // onPress={toggleMic}
        onPressIn={talkPressIn}
        onPressOut={talkPressOut}
        style={[
          styles.button,
          { backgroundColor: someoneElseSpeaking ? '#ccc' : '#2563EB' },
        ]}
        disabled={someoneElseSpeaking}
      >
        <Text style={styles.buttonText}>
          {/* {isMicrophoneEnabled ? 'Mute Mic' : 'Unmute Mic'} */}
          Hold to talk
        </Text>
      </Pressable>

      <Pressable
        onPress={leaveCall}
        style={[styles.button, { backgroundColor: 'red' }]}
      >
        <Text style={styles.buttonText}>End Call</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
