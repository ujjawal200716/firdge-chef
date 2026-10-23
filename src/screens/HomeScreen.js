import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';
import BentoMacroTile from '../components/BentoMacroTile';
import RecipeCard from '../components/RecipeCard';
import { HapticService } from '../services/haptics';

export default function HomeScreen({
  recipes,
  favorites,
  onSelectRecipe,
  onToggleFavorite,
  onAddToGrocery,
  onOpenChef
}) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Morning Energizers';
    if (hour >= 12 && hour < 17) return 'Power Lunches';
    if (hour >= 17 && hour < 22) return 'Quick Dinners for Tonight';
    return 'Late Night Bites';
  }, []);

  const filterTags = [
    { id: 'all', label: 'All' },
    { id: 'under-30', label: 'Under 30 Mins', icon: 'flash' },
    { id: 'high-protein', label: 'High Protein', icon: 'barbell' },
    { id: 'meal-prep', label: 'Meal Prep', icon: 'cube' },
    { id: 'vegan', label: 'Vegan', icon: 'leaf' },
    { id: 'keto', label: 'Keto', icon: 'egg' },
    { id: 'under-500', label: '< 500 Cals', icon: 'flame' },
  ];

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      let matchesFilter = true;
      if (activeFilter === 'under-30') {
        matchesFilter = (r.prepTime + r.cookTime) <= 30;
      } else if (activeFilter === 'high-protein') {
        matchesFilter = r.protein >= 30;
      } else if (activeFilter === 'vegan') {
        matchesFilter = r.tags.some(t => t.toLowerCase() === 'vegan');
      } else if (activeFilter === 'keto') {
        matchesFilter = r.tags.some(t => t.toLowerCase() === 'keto');
      } else if (activeFilter === 'meal-prep') {
        matchesFilter = r.tags.some(t => t.toLowerCase() === 'meal prep');
      } else if (activeFilter === 'under-500') {
        matchesFilter = r.calories < 500;
      }

      let matchesSearch = true;
      if (search.trim()) {
        const q = search.toLowerCase();
        matchesSearch = r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.ingredients.some(i => i.item.toLowerCase().includes(q));
      }

      return matchesFilter && matchesSearch;
    });
  }, [recipes, activeFilter, search]);

  const featured = recipes.find(r => r.featured) || recipes[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgApp} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingSub}>{greeting}</Text>
            <Text style={styles.greetingMain}>What's Cooking?</Text>
          </View>
          <TouchableOpacity
            style={styles.chefHeaderBtn}
            activeOpacity={0.85}
            onPress={() => {
              HapticService.heavy();
              onOpenChef && onOpenChef();
            }}
          >
            <Ionicons name="sparkles" size={13} color={Colors.accentCitrus} />
            <Text style={styles.chefHeaderBtnText}>Ask AI Chef</Text>
          </TouchableOpacity>
        </View>

        {/* Minimalist Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes, macros, ingredients..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Horizontal Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {filterTags.map(f => {
            const isActive = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => {
                  HapticService.light();
                  setActiveFilter(f.id);
                }}
              >
                {f.icon && (
                  <Ionicons
                    name={f.icon}
                    size={12}
                    color={isActive ? Colors.textInverse : Colors.textSecondary}
                  />
                )}
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bento Box: Macro Nutrients Widget */}
        <BentoMacroTile />

        {/* Bento Box: Featured Hero Card */}
        {featured && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.heroCard}
            onPress={() => onSelectRecipe(featured)}
          >
            <Image source={{ uri: featured.image }} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>🔥 DISH OF THE DAY</Text>
              </View>
              <View>
                <Text style={styles.heroTitle}>{featured.title}</Text>
                <View style={styles.heroMetaRow}>
                  <Text style={styles.heroMeta}>
                    <Ionicons name="time" size={12} color={Colors.accentCitrus} /> {featured.prepTime + featured.cookTime}m
                  </Text>
                  <Text style={styles.heroMeta}>
                    <Ionicons name="flame" size={12} color={Colors.accentCitrus} /> {featured.calories} kcal
                  </Text>
                  <Text style={styles.heroMeta}>
                    <Ionicons name="barbell" size={12} color={Colors.accentCitrus} /> {featured.protein}g protein
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Swipe Gesture Hint Banner */}
        <View style={styles.swipeHintBanner}>
          <Text style={styles.swipeHintText}>
            💡 Swipe Cards: 👉 <Text style={styles.swipeHintAccent}>Right</Text> to Favorite | 👈 <Text style={styles.swipeHintAccent}>Left</Text> to Grocery
          </Text>
        </View>

        {/* Recipe Feed */}
        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>EXPLORE RECIPES ({filteredRecipes.length})</Text>
        </View>

        {filteredRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favorites.includes(recipe.id)}
            onPress={onSelectRecipe}
            onToggleFavorite={onToggleFavorite}
            onAddToGrocery={onAddToGrocery}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgApp,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.accentCitrus,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  greetingMain: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chefHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 255, 0, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.35)',
  },
  chefHeaderBtnText: {
    color: Colors.accentCitrus,
    fontSize: 12,
    fontWeight: '800',
  },
  avatarText: {
    color: Colors.accentCitrus,
    fontWeight: '900',
    fontSize: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  filtersScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  filterPillActive: {
    backgroundColor: Colors.accentCitrus,
    borderColor: Colors.accentCitrus,
  },
  filterPillText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: Colors.textInverse,
    fontWeight: '900',
  },
  heroCard: {
    height: 200,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 9, 12, 0.65)',
    padding: 16,
    justifyContent: 'space-between',
  },
  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentCitrus,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  heroTagText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '900',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroMeta: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  swipeHintBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderSubtle,
    borderRadius: Radius.md,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  swipeHintText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  swipeHintAccent: {
    color: Colors.accentCitrus,
    fontWeight: '800',
  },
  feedHeader: {
    marginBottom: 12,
  },
  feedTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
