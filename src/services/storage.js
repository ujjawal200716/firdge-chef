import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  GROCERY: '@fridgechef_grocery',
  FAVORITES: '@fridgechef_favorites',
};

export const StorageService = {
  async getGroceryList() {
    try {
      const data = await AsyncStorage.getItem(KEYS.GROCERY);
      if (data) return JSON.parse(data);
      // Default starter items for demonstration
      const initial = [
        { id: 'g1', item: 'Fresh Salmon Fillet', amount: '2 fillets', category: 'Meat & Seafood', checked: false },
        { id: 'g2', item: 'Ripe Avocado', amount: '2 pieces', category: 'Produce', checked: true },
        { id: 'g3', item: 'Chili Crisp Oil', amount: '1 jar', category: 'Pantry & Spices', checked: false },
        { id: 'g4', item: 'Organic Eggs', amount: '1 carton', category: 'Dairy & Refrigerated', checked: false }
      ];
      await AsyncStorage.setItem(KEYS.GROCERY, JSON.stringify(initial));
      return initial;
    } catch (e) {
      console.warn('Error reading grocery list', e);
      return [];
    }
  },

  async saveGroceryList(list) {
    try {
      await AsyncStorage.setItem(KEYS.GROCERY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn('Error saving grocery list', e);
      return false;
    }
  },

  async addIngredientsToGrocery(ingredients) {
    try {
      const current = await this.getGroceryList();
      const updated = [...current];
      ingredients.forEach(ing => {
        if (!updated.some(item => item.item.toLowerCase() === ing.item.toLowerCase())) {
          updated.push({
            id: 'g_' + Date.now() + Math.random().toString(36).substring(2, 6),
            item: ing.item,
            amount: ing.amount,
            category: ing.category || 'Produce',
            checked: false,
          });
        }
      });
      await this.saveGroceryList(updated);
      return updated;
    } catch (e) {
      console.warn('Error adding ingredients', e);
      return [];
    }
  },

  async getFavorites() {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : ['r1'];
    } catch (e) {
      return ['r1'];
    }
  },

  async toggleFavorite(recipeId) {
    try {
      const current = await this.getFavorites();
      let updated;
      if (current.includes(recipeId)) {
        updated = current.filter(id => id !== recipeId);
      } else {
        updated = [...current, recipeId];
      }
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Error toggling favorite', e);
      return [];
    }
  }
};
