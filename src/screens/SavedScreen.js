import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';

export default function SavedScreen({ recipes, favorites, onSelectRecipe }) {
  const savedRecipes = recipes.filter(r => favorites.includes(r.id));

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subTitle}>SAVED COLLECTION</Text>
          <Text style={styles.mainTitle}>My Cookbook</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{savedRecipes.length}</Text>
        </View>
      </View>

      {savedRecipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={48} color={Colors.accentTomato} />
          <Text style={styles.emptyTitle}>No saved recipes yet</Text>
          <Text style={styles.emptySub}>
            Swipe right on any recipe card to save it to your personal cookbook.
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {savedRecipes.map(recipe => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => onSelectRecipe(recipe)}
            >
              <Image source={{ uri: recipe.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay}>
                <View style={styles.favoritePill}>
                  <Ionicons name="heart" size={11} color="#FFF" />
                  <Text style={styles.favoritePillText}>FAVORITE</Text>
                </View>
                <View>
                  <Text style={styles.cardTitle}>{recipe.title}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      ⏱️ {recipe.prepTime + recipe.cookTime}m
                    </Text>
                    <Text style={styles.metaText}>
                      🔥 {recipe.calories} kcal
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 52,
    backgroundColor: Colors.bgApp,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subTitle: {
    color: Colors.accentTomato,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  mainTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
  },
  countBadge: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  countText: {
    color: Colors.accentCitrus,
    fontSize: 14,
    fontWeight: '900',
  },
  grid: {
    gap: 14,
  },
  card: {
    height: 180,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 9, 12, 0.65)',
    padding: 14,
    justifyContent: 'space-between',
  },
  favoritePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentTomato,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  favoritePillText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySub: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
});
