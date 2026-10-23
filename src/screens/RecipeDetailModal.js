import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';
import { HapticService } from '../services/haptics';

export default function RecipeDetailModal({
  visible,
  recipe,
  isFavorite,
  onClose,
  onToggleFavorite,
  onAddToGrocery,
  onStartCooking,
  onAskChef
}) {
  if (!recipe) return null;

  const [multiplier, setMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngCheck = (idx) => {
    setCheckedIngredients(prev => {
      const next = !prev[idx];
      if (next) HapticService.success();
      else HapticService.light();
      return { ...prev, [idx]: next };
    });
  };

  const scaleAmount = (str, mult) => {
    if (mult === 1 || !str) return str;
    return str.replace(/(\d+(\.\d+)?)/, match => {
      const num = parseFloat(match);
      return Math.round(num * mult * 10) / 10;
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        {/* Scrollable Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Edge-to-Edge Image Header */}
          <View style={styles.headerImageContainer}>
            <Image source={{ uri: recipe.image }} style={styles.headerImage} />
            <View style={styles.headerGradient} />

            {/* Floating Navigation Controls */}
            <SafeAreaView style={styles.floatingNav}>
              <TouchableOpacity style={styles.navBtn} onPress={onClose}>
                <Ionicons name="arrow-back" size={20} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navBtn, isFavorite && styles.navBtnFavorite]}
                onPress={() => {
                  HapticService.light();
                  onToggleFavorite(recipe.id);
                }}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? Colors.accentTomato : '#FFF'}
                />
              </TouchableOpacity>
            </SafeAreaView>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Tags */}
            <View style={styles.tagsRow}>
              {recipe.tags.map((t, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>

            {/* Title */}
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.description}>{recipe.description}</Text>

            {/* Macro Metrics Grid */}
            <View style={styles.macroGrid}>
              <View style={styles.macroCard}>
                <Text style={styles.macroVal}>{recipe.calories}</Text>
                <Text style={styles.macroLbl}>CALORIES</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={[styles.macroVal, { color: Colors.accentCitrus }]}>{recipe.protein}g</Text>
                <Text style={styles.macroLbl}>PROTEIN</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={[styles.macroVal, { color: Colors.accentCyan }]}>{recipe.carbs}g</Text>
                <Text style={styles.macroLbl}>CARBS</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={[styles.macroVal, { color: Colors.accentAmber }]}>{recipe.fat}g</Text>
                <Text style={styles.macroLbl}>FAT</Text>
              </View>
            </View>

            {/* Serving Size Scaler */}
            <View style={styles.servingRow}>
              <Text style={styles.servingLabel}>Serving Multiplier</Text>
              <View style={styles.servingBtns}>
                {[1, 2, 4].map(mult => (
                  <TouchableOpacity
                    key={mult}
                    style={[styles.servBtn, multiplier === mult && styles.servBtnActive]}
                    onPress={() => {
                      HapticService.light();
                      setMultiplier(mult);
                    }}
                  >
                    <Text style={[styles.servBtnText, multiplier === mult && styles.servBtnTextActive]}>
                      {mult}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ask Chef Auguste (Groq AI) */}
            <TouchableOpacity
              style={styles.askChefCard}
              activeOpacity={0.85}
              onPress={() => onAskChef(recipe)}
            >
              <View style={styles.askChefCardLeft}>
                <View style={styles.askChefAvatar}>
                  <Ionicons name="restaurant" size={16} color={Colors.accentCitrus} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.askChefCardTitle}>Have questions about this recipe?</Text>
                  <Text style={styles.askChefCardSub}>Ask Chef Auguste (Groq Cloud) for substitutions & tips</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.accentCitrus} />
            </TouchableOpacity>

            {/* Ingredients Checklist */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <TouchableOpacity
                style={styles.addAllBtn}
                onPress={() => {
                  HapticService.success();
                  onAddToGrocery(recipe.ingredients);
                }}
              >
                <Ionicons name="cart-outline" size={14} color={Colors.accentCitrus} />
                <Text style={styles.addAllBtnText}>Add All to Grocery</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.ingItem, isChecked && styles.ingItemChecked]}
                    activeOpacity={0.8}
                    onPress={() => toggleIngCheck(idx)}
                  >
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                      {isChecked && <Ionicons name="checkmark" size={13} color={Colors.textInverse} />}
                    </View>
                    <View style={styles.ingLabelGroup}>
                      <Text style={[styles.ingName, isChecked && styles.ingNameChecked]}>
                        {ing.item}
                      </Text>
                      <Text style={styles.ingAmount}>{scaleAmount(ing.amount, multiplier)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Steps Overview */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Preparation Steps</Text>
            </View>

            <View style={styles.stepsList}>
              {recipe.steps.map((step, idx) => (
                <View key={idx} style={styles.stepCard}>
                  <View style={styles.stepNumBubble}>
                    <Text style={styles.stepNumText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: 120 }} />
          </View>
        </ScrollView>

        {/* Sticky Glassmorphic "Start Cooking" Footer */}
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            style={styles.startCookingBtn}
            activeOpacity={0.9}
            onPress={() => {
              HapticService.heavy();
              onStartCooking(recipe);
            }}
          >
            <Ionicons name="play" size={18} color={Colors.textInverse} />
            <Text style={styles.startCookingBtnText}>Start Cooking (Keep-Awake Focus)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.bgApp,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerImageContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
    backgroundColor: '#161B26',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 9, 12, 0.4)',
  },
  floatingNav: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(10, 12, 16, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  navBtnFavorite: {
    backgroundColor: 'rgba(255, 59, 48, 0.25)',
    borderColor: Colors.accentTomato,
  },
  body: {
    padding: 20,
    marginTop: -20,
    backgroundColor: Colors.bgApp,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: 'rgba(212, 255, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  tagText: {
    color: Colors.accentCitrus,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    marginBottom: 8,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 18,
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  macroCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  macroVal: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  macroLbl: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  servingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 20,
  },
  servingLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  servingBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  servBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgInput,
  },
  servBtnActive: {
    backgroundColor: Colors.accentCitrus,
  },
  servBtnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  servBtnTextActive: {
    color: Colors.textInverse,
    fontWeight: '900',
  },
  askChefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(212, 255, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.25)',
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 18,
  },
  askChefCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  askChefAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.accentCitrus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askChefCardTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  askChefCardSub: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '900',
  },
  addAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 255, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  addAllBtnText: {
    color: Colors.accentCitrus,
    fontSize: 11,
    fontWeight: '800',
  },
  ingredientsList: {
    gap: 8,
    marginBottom: 20,
  },
  ingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  ingItemChecked: {
    opacity: 0.5,
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
  ingLabelGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ingName: {
    color: Colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
  },
  ingNameChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  ingAmount: {
    color: Colors.accentCitrus,
    fontSize: 12,
    fontWeight: '700',
  },
  stepsList: {
    gap: 10,
  },
  stepCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  stepNumBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: Colors.accentCitrus,
    fontSize: 12,
    fontWeight: '900',
  },
  stepText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.bgGlassHeavy,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  startCookingBtn: {
    height: 54,
    backgroundColor: Colors.accentCitrus,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startCookingBtnText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '900',
  },
});
