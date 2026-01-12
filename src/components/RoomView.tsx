import { isTrackReference, useTracks, VideoTrack } from '@livekit/react-native';
import { Text } from '@react-navigation/elements';
import { Track } from 'livekit-client';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export const RoomView = ({ navigation }) => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  ); // all participant tracks

  return (
    <FlatList
      data={tracks}
      renderItem={({ item }) =>
        isTrackReference(item) ? (
          <VideoTrack trackRef={item} style={styles.video} />
        ) : (
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item?.participant.identity?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>

            <Text style={styles.name}>
              {item?.participant?.identity || 'Unknown'}
            </Text>

            {item.source === Track.Source.Camera && (
              <Text style={styles.status}>🎙️ Audio Connected</Text>
            )}
            {/* {item.source === Track.Source.Microphone && (
              <Text style={styles.status}>🎙️ Audio Connected</Text>
            )} */}
          </View>
        )
      }
      numColumns={1} // can change to 2 for side-by-side
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 4,
    alignItems: 'center',
  },
  video: {
    width: width - 16, // full width minus padding
    height: (width * 9) / 16, // 16:9 ratio
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  status: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  userCard: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
});
