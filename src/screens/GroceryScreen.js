import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';
import { HapticService } from '../services/haptics';

export default function GroceryScreen({ groceryList, onUpdateList }) {
  const [newItem, setNewItem] = useState('');

  const categories = ['Produce', 'Meat & Seafood', 'Dairy & Refrigerated', 'Pantry & Spices'];

  const toggleCheck = (id) => {
    const updated = groceryList.map(item => {
      if (item.id === id) {
        const nextState = !item.checked;
        if (nextState) HapticService.success();
        else HapticService.light();
        return { ...item, checked: nextState };
      }
      return item;
    });
    onUpdateList(updated);
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    const item = {
      id: 'g_' + Date.now(),
      item: newItem.trim(),
      amount: '1x',
      category: 'Produce',
      checked: false,
    };
    onUpdateList([item, ...groceryList]);
    setNewItem('');
    HapticService.success();
  };

  const clearCompleted = () => {
    const activeOnly = groceryList.filter(item => !item.checked);
    onUpdateList(activeOnly);
    HapticService.medium();
  };

  const shareList = async () => {
    const text = groceryList
      .map(i => `${i.checked ? '☑' : '☐'} ${i.item} (${i.amount || ''})`)
      .join('\n');
    try {
      await Share.share({
        title: 'FridgeChef Grocery List',
        message: `🛒 FridgeChef Grocery List:\n\n${text}`
      });
    } catch (e) {}
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subTitle}>LOCAL SUPERMARKET READY</Text>
          <Text style={styles.mainTitle}>Grocery List</Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={shareList}>
          <Ionicons name="share-social" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Offline Status Banner */}
      <View style={styles.offlineBanner}>
        <View style={styles.offlineLeft}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.accentEmerald} />
          <View>
            <Text style={styles.offlineTitle}>Offline Mode Active</Text>
            <Text style={styles.offlineDesc}>Saved on device for spotty supermarket signals</Text>
          </View>
        </View>
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineBadgeText}>LOCAL</Text>
        </View>
      </View>

      {/* Quick Add Row */}
      <View style={styles.addInputRow}>
        <TextInput
          style={styles.addInput}
          placeholder="Quick add item (e.g., Greek Yogurt, Avocado)..."
          placeholderTextColor={Colors.textMuted}
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={handleAddItem}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
          <Ionicons name="add" size={22} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>

      {/* Categorized List */}
      {categories.map(cat => {
        const items = groceryList.filter(i => (i.category || 'Produce') === cat);
        if (items.length === 0) return null;

        return (
          <View key={cat} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{cat}</Text>
              <Text style={styles.categoryCount}>
                {items.filter(i => i.checked).length}/{items.length}
              </Text>
            </View>

            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.checkItem, item.checked && styles.checkItemChecked]}
                activeOpacity={0.8}
                onPress={() => toggleCheck(item.id)}
              >
                <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                  {item.checked && <Ionicons name="checkmark" size={14} color={Colors.textInverse} />}
                </View>

                <View style={styles.itemLabelGroup}>
                  <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                    {item.item}
                  </Text>
                  {item.amount && (
                    <Text style={styles.itemAmount}>{item.amount}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}

      {groceryList.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="basket-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Your grocery list is empty</Text>
          <Text style={styles.emptySub}>
            Swipe left on recipe cards or add items directly above!
          </Text>
        </View>
      )}

      {/* Footer Clear Completed */}
      {groceryList.some(i => i.checked) && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearCompleted}>
          <Ionicons name="trash-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.clearBtnText}>Clear Completed Items</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  subTitle: {
    color: Colors.accentEmerald,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  mainTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
  },
  shareBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: Radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  offlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  offlineTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  offlineDesc: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  offlineBadge: {
    backgroundColor: Colors.accentEmerald,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  offlineBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
  },
  addInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  addInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.pill,
    paddingHorizontal: 18,
    color: Colors.textPrimary,
    fontSize: 13.5,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentCitrus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryCount: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 8,
  },
  checkItemChecked: {
    opacity: 0.6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.accentCitrus,
    borderColor: Colors.accentCitrus,
  },
  itemLabelGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    color: Colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  itemAmount: {
    color: Colors.accentCitrus,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginTop: 8,
  },
  clearBtnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
