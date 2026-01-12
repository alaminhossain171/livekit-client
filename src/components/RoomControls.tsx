import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Vibration,
  Animated,
} from 'react-native';
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

  const [isHoldingToTalk, setIsHoldingToTalk] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const speakingParticipant = tracks.find(
    t => t.participant?.isSpeaking,
  )?.participant;

  const someoneElseSpeaking =
    speakingParticipant && speakingParticipant.sid !== localParticipant.sid;

  const leaveCall = () => {
    room.disconnect();
    onEndCall();
  };

  const talkPressIn = () => {
    if (someoneElseSpeaking) return;

    // Haptic feedback - short vibration
    Vibration.vibrate(50);

    // Visual feedback - button scale animation
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      tension: 150,
      friction: 3,
      useNativeDriver: true,
    }).start();

    setIsHoldingToTalk(true);

    if (!isMicrophoneEnabled) {
      localParticipant.setMicrophoneEnabled(true);
    }
  };

  const talkPressOut = () => {
    // Haptic feedback - different pattern for release
    Vibration.vibrate([0, 30]);

    // Reset animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 150,
      friction: 3,
      useNativeDriver: true,
    }).start();

    setIsHoldingToTalk(false);
    localParticipant.setMicrophoneEnabled(false);
  };

  // Optional: Add a pulsing animation when holding
  const [pulseAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isHoldingToTalk) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [isHoldingToTalk]);

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <View style={styles.talkButtonContainer}>
        {/* Pulsing background effect when holding */}
        {isHoldingToTalk && (
          <Animated.View
            style={[styles.pulseBackground, { opacity: pulseOpacity }]}
          />
        )}

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPressIn={talkPressIn}
            onPressOut={talkPressOut}
            style={({ pressed }) => [
              styles.button,
              styles.talkButton,
              {
                backgroundColor: isHoldingToTalk
                  ? '#10B981' // Green when active
                  : someoneElseSpeaking
                  ? '#9CA3AF' // Gray when disabled
                  : pressed
                  ? '#1D4ED8' // Slightly darker when pressed (briefly)
                  : '#2563EB', // Normal blue
              },
            ]}
            disabled={someoneElseSpeaking}
          >
            <Text style={styles.buttonText}>
              {isHoldingToTalk ? 'Speaking...' : 'Hold to talk'}
            </Text>

            {/* Indicator dot when speaking */}
            {/* {isHoldingToTalk && (
              <View style={styles.speakingIndicator}>
                <View style={styles.speakingDot} />
                <Text style={styles.speakingText}>Live</Text>
              </View>
            )} */}
          </Pressable>
        </Animated.View>
      </View>

      <Pressable
        onPress={leaveCall}
        style={({ pressed }) => [
          styles.button,
          styles.endButton,
          {
            backgroundColor: pressed ? '#DC2626' : 'red',
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
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
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 40,
  },
  talkButtonContainer: {
    position: 'relative',
  },
  pulseBackground: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: '#10B981',
    borderRadius: 20,
    zIndex: 0,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  talkButton: {
    position: 'relative',
    zIndex: 1,
  },
  endButton: {
    shadowColor: '#EF4444',
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  speakingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  speakingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  speakingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
  },
});
