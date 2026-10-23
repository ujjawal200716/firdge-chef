import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

export default function BubblingPot({ statusText, statusSubtext }) {
  const steamAnim1 = useRef(new Animated.Value(0)).current;
  const steamAnim2 = useRef(new Animated.Value(0)).current;
  const steamAnim3 = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Steam animation loops
    const createSteamLoop = (anim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      );
    };

    const bubbleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubbleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    );

    const l1 = createSteamLoop(steamAnim1, 0);
    const l2 = createSteamLoop(steamAnim2, 400);
    const l3 = createSteamLoop(steamAnim3, 800);

    l1.start();
    l2.start();
    l3.start();
    bubbleLoop.start();

    return () => {
      l1.stop();
      l2.stop();
      l3.stop();
      bubbleLoop.stop();
    };
  }, []);

  const getSteamStyle = (anim) => ({
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.8, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, -35],
        }),
      },
      {
        scaleY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1.4],
        }),
      }
    ]
  });

  return (
    <View style={styles.container}>
      <View style={styles.potVisual}>
        {/* Steam Waves */}
        <View style={styles.steamRow}>
          <Animated.View style={[styles.steamWave, getSteamStyle(steamAnim1)]} />
          <Animated.View style={[styles.steamWave, getSteamStyle(steamAnim2), { height: 28 }]} />
          <Animated.View style={[styles.steamWave, getSteamStyle(steamAnim3)]} />
        </View>

        {/* Pot Icon & Glowing Broth */}
        <View style={styles.potBody}>
          <Ionicons name="restaurant" size={38} color={Colors.accentCitrus} />
          <Animated.View
            style={[
              styles.bubbleDot,
              {
                opacity: bubbleAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
                transform: [{ translateY: bubbleAnim.interpolate({ inputRange: [0, 1], outputRange: [5, -15] }) }]
              }
            ]}
          />
        </View>

        {/* Burner Flame */}
        <View style={styles.burnerGlow}>
          <Ionicons name="flame" size={24} color={Colors.accentTomato} />
        </View>
      </View>

      <Text style={styles.statusText}>{statusText || 'Extracting Recipe...'}</Text>
      <Text style={styles.statusSubtext}>{statusSubtext || 'Groq AI parsing video transcript'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  potVisual: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  steamRow: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    gap: 12,
  },
  steamWave: {
    width: 6,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
  },
  potBody: {
    width: 74,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#1E2532',
    borderWidth: 2,
    borderColor: Colors.accentCitrus,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubbleDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentCitrus,
    top: 8,
  },
  burnerGlow: {
    position: 'absolute',
    bottom: 2,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  statusSubtext: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
