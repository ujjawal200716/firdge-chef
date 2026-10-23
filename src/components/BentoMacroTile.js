import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';

export default function BentoMacroTile() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="pie-chart" size={16} color={Colors.accentCitrus} />
          <Text style={styles.title}>DAILY NUTRITION</Text>
        </View>
        <View style={styles.goalBadge}>
          <Text style={styles.goalText}>2,200 KCAL GOAL</Text>
        </View>
      </View>

      <View style={styles.contentRow}>
        {/* Calorie Progress Ring / Widget */}
        <View style={styles.calorieWidget}>
          <View style={styles.calorieCircle}>
            <Text style={styles.calorieNumber}>1,480</Text>
            <Text style={styles.calorieLabel}>KCAL LEFT</Text>
          </View>
        </View>

        {/* Macro Bars */}
        <View style={styles.macroBarsGroup}>
          {/* Protein */}
          <View style={styles.macroBarItem}>
            <View style={styles.macroMeta}>
              <Text style={styles.macroName}>Protein (140g)</Text>
              <Text style={styles.macroVal}>98g</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: '70%', backgroundColor: Colors.accentCitrus }]} />
            </View>
          </View>

          {/* Carbs */}
          <View style={styles.macroBarItem}>
            <View style={styles.macroMeta}>
              <Text style={styles.macroName}>Carbs (210g)</Text>
              <Text style={styles.macroVal}>122g</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: '58%', backgroundColor: Colors.accentCyan }]} />
            </View>
          </View>

          {/* Fats */}
          <View style={styles.macroBarItem}>
            <View style={styles.macroMeta}>
              <Text style={styles.macroName}>Fats (65g)</Text>
              <Text style={styles.macroVal}>34g</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: '52%', backgroundColor: Colors.accentAmber }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
  },
  goalBadge: {
    backgroundColor: 'rgba(212, 255, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.25)',
  },
  goalText: {
    color: Colors.accentCitrus,
    fontSize: 10,
    fontWeight: '800',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  calorieWidget: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 3,
    borderColor: Colors.accentCitrus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieCircle: {
    alignItems: 'center',
  },
  calorieNumber: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '900',
  },
  calorieLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
  },
  macroBarsGroup: {
    flex: 1,
    gap: 8,
  },
  macroBarItem: {
    gap: 3,
  },
  macroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroName: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  macroVal: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
