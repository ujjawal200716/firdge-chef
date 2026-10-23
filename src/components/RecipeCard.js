import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';
import { HapticService } from '../services/haptics';

export default function RecipeCard({
  recipe,
  isFavorite,
  onPress,
  onToggleFavorite,
  onAddToGrocery
}) {
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 15 && Math.abs(gesture.dy) < 15,
      onPanResponderMove: (_, gesture) => {
        pan.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 80) {
          // Swipe Right: Save Favorite
          Animated.timing(pan, { toValue: 180, duration: 200, useNativeDriver: true }).start(() => {
            HapticService.success();
            onToggleFavorite(recipe.id);
            Animated.spring(pan, { toValue: 0, friction: 5, useNativeDriver: true }).start();
          });
        } else if (gesture.dx < -80) {
          // Swipe Left: Add to Grocery List
          Animated.timing(pan, { toValue: -180, duration: 200, useNativeDriver: true }).start(() => {
            HapticService.success();
            onAddToGrocery(recipe.ingredients);
            Animated.spring(pan, { toValue: 0, friction: 5, useNativeDriver: true }).start();
          });
        } else {
          // Snap back
          Animated.spring(pan, { toValue: 0, friction: 5, useNativeDriver: true }).start();
        }
      }
    })
  ).current;

  return (
    <View style={styles.wrapper}>
      {/* Background Swipe Indicators */}
      <View style={[styles.swipeBg, styles.swipeBgRight]}>
        <Ionicons name="heart" size={20} color="#FFF" />
        <Text style={styles.swipeText}>SAVED TO FAVORITES</Text>
      </View>
      <View style={[styles.swipeBg, styles.swipeBgLeft]}>
        <Text style={styles.swipeText}>ADDED TO GROCERY</Text>
        <Ionicons name="cart" size={20} color="#FFF" />
      </View>

      {/* Swipeable Foreground Card */}
      <Animated.View
        style={[styles.card, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(recipe)}>
          {/* Card Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: recipe.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.difficultyBadge}>
              <Ionicons name="flash" size={11} color={Colors.accentCitrus} />
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>

            <TouchableOpacity
              style={[styles.favBtn, isFavorite && styles.favBtnActive]}
              onPress={() => {
                HapticService.light();
                onToggleFavorite(recipe.id);
              }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={isFavorite ? Colors.accentTomato : '#FFF'}
              />
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View style={styles.content}>
            <View style={styles.tagsRow}>
              {recipe.tags.map((t, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Ionicons name="time-outline" size={14} color={Colors.accentCitrus} />
                <Text style={styles.metricText}>{recipe.prepTime + recipe.cookTime}m</Text>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="flame-outline" size={14} color={Colors.accentCitrus} />
                <Text style={styles.metricText}>{recipe.calories} kcal</Text>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="barbell-outline" size={14} color={Colors.accentCitrus} />
                <Text style={styles.metricText}>{recipe.protein}g protein</Text>
              </View>
            </View>

            {/* Quick Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionBtnSecondary}
                onPress={() => {
                  HapticService.medium();
                  onAddToGrocery(recipe.ingredients);
                }}
              >
                <Ionicons name="cart-outline" size={14} color={Colors.textPrimary} />
                <Text style={styles.actionBtnSecondaryText}>Grocery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() => {
                  HapticService.light();
                  onPress(recipe);
                }}
              >
                <Text style={styles.actionBtnPrimaryText}>View Recipe</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.textInverse} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  swipeBg: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  swipeBgRight: {
    backgroundColor: Colors.accentTomato,
    justifyContent: 'flex-start',
  },
  swipeBgLeft: {
    backgroundColor: Colors.accentEmerald,
    justifyContent: 'flex-end',
  },
  swipeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#161B26',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  difficultyText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  favBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 12, 16, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  favBtnActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.25)',
    borderColor: Colors.accentTomato,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtnSecondary: {
    flex: 1,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnSecondaryText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flex: 1.2,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentCitrus,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnPrimaryText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '800',
  },
});
