import { isTrackReference, useTracks, VideoTrack } from '@livekit/react-native';
import { Track } from 'livekit-client';
import React from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';

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
        ) : null
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
});
