import { isTrackReference, useTracks, VideoTrack } from '@livekit/react-native';
import { Track } from 'livekit-client';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, View, Text } from 'react-native';
import { RoomControls } from './RoomControls';

const { width } = Dimensions.get('window');

export const RoomView = ({ navigation }) => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: true }, // Audio track
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <>
      <FlatList
        data={tracks}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => {
          const name = item?.participant?.identity || 'Unknown';
          const speaking = item?.participant?.isSpeaking;
          // 🎥 Video Track
          if (isTrackReference(item) && item.source === Track.Source.Camera) {
            return <VideoTrack trackRef={item} style={styles.video} />;
          }

          // 🎧 Audio-only user card
          if (item.source === Track.Source.Microphone) {
            return (
              <View style={styles.audioCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{name}</Text>
                  {/* <Text style={styles.status}>🎙️ Audio Connected</Text> */}
                  <Text style={styles.status}>
                    🎙️ Audio Connected {speaking ? '💬 Speaking...' : ''}
                  </Text>
                </View>
              </View>
            );
          }

          // Optional fallback for other sources
          return null;
        }}
      />
      <RoomControls onEndCall={() => navigation.goBack()} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  video: {
    width: width - 16,
    height: (width * 9) / 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: width - 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    color: '#6B7280',
  },
});
