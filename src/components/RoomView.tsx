import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useTracks, VideoTrack, isTrackReference } from '@livekit/react-native';
import { Track } from 'livekit-client';

const { width } = Dimensions.get('window');

export const RoomView = () => {
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]); // all participant tracks

  return (
    <FlatList
      data={tracks}
      keyExtractor={track => track.publication.trackSid}
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
    backgroundColor: '#000',
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
