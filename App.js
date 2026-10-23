import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from './src/theme';
import { INITIAL_RECIPES } from './src/data/recipes';
import { StorageService } from './src/services/storage';
import { HapticService } from './src/services/haptics';

import HomeScreen from './src/screens/HomeScreen';
import MagicExtractorScreen from './src/screens/MagicExtractorScreen';
import GroceryScreen from './src/screens/GroceryScreen';
import SavedScreen from './src/screens/SavedScreen';
import RecipeDetailModal from './src/screens/RecipeDetailModal';
import CookingFocusModal from './src/screens/CookingFocusModal';
import ChefAssistantModal from './src/screens/ChefAssistantModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'grocery' | 'extractor' | 'saved'
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [favorites, setFavorites] = useState(['r1']);
  const [groceryList, setGroceryList] = useState([]);
  const [detailRecipe, setDetailRecipe] = useState(null);
  const [cookingRecipe, setCookingRecipe] = useState(null);
  const [chefModalVisible, setChefModalVisible] = useState(false);
  const [chefContextRecipe, setChefContextRecipe] = useState(null);

  // Load offline data on startup
  useEffect(() => {
    (async () => {
      const favs = await StorageService.getFavorites();
      const grocery = await StorageService.getGroceryList();
      setFavorites(favs);
      setGroceryList(grocery);
    })();
  }, []);

  const handleToggleFavorite = async (recipeId) => {
    const updated = await StorageService.toggleFavorite(recipeId);
    setFavorites(updated);
  };

  const handleAddToGrocery = async (ingredients) => {
    const updated = await StorageService.addIngredientsToGrocery(ingredients);
    setGroceryList(updated);
    Alert.alert('🛒 Grocery Updated', `Added ${ingredients.length} items to your offline shopping list.`);
  };

  const handleSaveExtractedRecipe = async (recipe) => {
    // Add to recipes if not present
    if (!recipes.some(r => r.id === recipe.id)) {
      setRecipes([recipe, ...recipes]);
    }
    // Add to favorites
    await handleToggleFavorite(recipe.id);
    Alert.alert('❤️ Saved to Cookbook', `"${recipe.title}" is now saved in your collection.`);
  };

  const handleCookFromExtractor = (recipe) => {
    if (!recipes.some(r => r.id === recipe.id)) {
      setRecipes([recipe, ...recipes]);
    }
    setDetailRecipe(recipe);
  };

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            recipes={recipes}
            favorites={favorites}
            onSelectRecipe={setDetailRecipe}
            onToggleFavorite={handleToggleFavorite}
            onAddToGrocery={handleAddToGrocery}
            onOpenChef={() => {
              setChefContextRecipe(null);
              setChefModalVisible(true);
            }}
          />
        );
      case 'grocery':
        return (
          <GroceryScreen
            groceryList={groceryList}
            onUpdateList={async (updated) => {
              setGroceryList(updated);
              await StorageService.saveGroceryList(updated);
            }}
          />
        );
      case 'extractor':
        return (
          <MagicExtractorScreen
            onSaveRecipe={handleSaveExtractedRecipe}
            onCookRecipe={handleCookFromExtractor}
          />
        );
      case 'saved':
        return (
          <SavedScreen
            recipes={recipes}
            favorites={favorites}
            onSelectRecipe={setDetailRecipe}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgApp} />

      {/* Active Screen View */}
      <View style={styles.screenWrapper}>
        {renderActiveScreen()}
      </View>

      {/* Floating Glassmorphic Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Discover Tab */}
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            HapticService.light();
            setCurrentTab('home');
          }}
        >
          <Ionicons
            name={currentTab === 'home' ? 'compass' : 'compass-outline'}
            size={22}
            color={currentTab === 'home' ? Colors.accentCitrus : Colors.textMuted}
          />
          <Text style={[styles.navText, currentTab === 'home' && styles.navTextActive]}>
            Discover
          </Text>
        </TouchableOpacity>

        {/* Grocery Tab */}
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            HapticService.light();
            setCurrentTab('grocery');
          }}
        >
          <Ionicons
            name={currentTab === 'grocery' ? 'basket' : 'basket-outline'}
            size={22}
            color={currentTab === 'grocery' ? Colors.accentCitrus : Colors.textMuted}
          />
          <Text style={[styles.navText, currentTab === 'grocery' && styles.navTextActive]}>
            Grocery
          </Text>
        </TouchableOpacity>

        {/* Glowing Center "+" Magic Extractor Button */}
        <View style={styles.centerBtnWrapper}>
          <View style={styles.centerPulseRing} />
          <TouchableOpacity
            style={[styles.centerBtn, currentTab === 'extractor' && styles.centerBtnActive]}
            activeOpacity={0.88}
            onPress={() => {
              HapticService.heavy();
              setCurrentTab(currentTab === 'extractor' ? 'home' : 'extractor');
            }}
          >
            <Ionicons
              name={currentTab === 'extractor' ? 'close' : 'add'}
              size={28}
              color={Colors.textInverse}
            />
          </TouchableOpacity>
        </View>

        {/* Cookbook / Saved Tab */}
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            HapticService.light();
            setCurrentTab('saved');
          }}
        >
          <Ionicons
            name={currentTab === 'saved' ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={currentTab === 'saved' ? Colors.accentCitrus : Colors.textMuted}
          />
          <Text style={[styles.navText, currentTab === 'saved' && styles.navTextActive]}>
            Cookbook
          </Text>
        </TouchableOpacity>

        {/* Nutrition Info Tab (Direct alert or switch) */}
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            HapticService.light();
        {/* AI Chef Assistant Tab */}
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => {
            HapticService.heavy();
            setChefContextRecipe(null);
            setChefModalVisible(true);
          }}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={Colors.accentCitrus}
          />
          <Text style={[styles.navText, { color: Colors.accentCitrus }]}>AI Chef</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        visible={!!detailRecipe}
        recipe={detailRecipe}
        isFavorite={detailRecipe ? favorites.includes(detailRecipe.id) : false}
        onClose={() => setDetailRecipe(null)}
        onToggleFavorite={handleToggleFavorite}
        onAddToGrocery={handleAddToGrocery}
        onStartCooking={(recipe) => {
          setDetailRecipe(null);
          setCookingRecipe(recipe);
        }}
        onAskChef={(recipe) => {
          setChefContextRecipe(recipe);
          setChefModalVisible(true);
        }}
      />

      {/* Full-Screen Step-by-Step Cooking Focus Modal */}
      <CookingFocusModal
        visible={!!cookingRecipe}
        recipe={cookingRecipe}
        onClose={() => setCookingRecipe(null)}
      />

      {/* Groq Cloud AI Chef Assistant Modal */}
      <ChefAssistantModal
        visible={chefModalVisible}
        recipe={chefContextRecipe}
        onClose={() => setChefModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgApp,
  },
  screenWrapper: {
    flex: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: Colors.bgGlassHeavy,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 12,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    width: 60,
  },
  navText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  navTextActive: {
    color: Colors.accentCitrus,
    fontWeight: '800',
  },
  centerBtnWrapper: {
    position: 'relative',
    width: 62,
    height: 62,
    marginTop: -30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPulseRing: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.accentCitrusGlow,
  },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accentCitrus,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  centerBtnActive: {
    backgroundColor: Colors.accentTomato,
  },
});
