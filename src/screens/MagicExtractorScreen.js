import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';
import { HapticService } from '../services/haptics';
import { ApiService } from '../services/api';
import BubblingPot from '../components/BubblingPot';

export default function MagicExtractorScreen({ onSaveRecipe, onCookRecipe }) {
  const [url, setUrl] = useState('');
  const [clipboardUrl, setClipboardUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [statusSubtext, setStatusSubtext] = useState('');
  const [extractedRecipe, setExtractedRecipe] = useState(null);

  useEffect(() => {
    checkClipboard();
  }, []);

  const checkClipboard = async () => {
    try {
      const hasString = await Clipboard.hasStringAsync();
      if (hasString) {
        const text = await Clipboard.getStringAsync();
        if (
          text &&
          (text.includes('youtube.com') ||
            text.includes('youtu.be') ||
            text.includes('instagram.com') ||
            text.includes('tiktok.com'))
        ) {
          setClipboardUrl(text);
        }
      }
    } catch (e) {}
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setUrl(text);
        HapticService.light();
      }
    } catch (e) {}
  };

  const handleExtract = async (targetUrl = url) => {
    if (!targetUrl || !targetUrl.trim()) {
      HapticService.heavy();
      return;
    }

    setLoading(true);
    setExtractedRecipe(null);
    HapticService.heavy();

    // Multi-phase status progression
    setStatusText('Fetching video audio stream...');
    setStatusSubtext('Extracting captions & audio transcript');

    const timer1 = setTimeout(() => {
      setStatusText('Groq AI parsing culinary steps...');
      setStatusSubtext('LLaMA 3.3 identifying ingredient amounts');
      HapticService.light();
    }, 800);

    const timer2 = setTimeout(() => {
      setStatusText('Calculating macro breakdown...');
      setStatusSubtext('Computing calories, protein, carbs & fats');
      HapticService.light();
    }, 1600);

    try {
      const recipe = await ApiService.extractRecipeFromUrl(targetUrl);
      clearTimeout(timer1);
      clearTimeout(timer2);
      setExtractedRecipe(recipe);
      HapticService.success();
    } catch (err) {
      console.warn('Extraction error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Badge */}
      <View style={styles.badge}>
        <Ionicons name="sparkles" size={12} color={Colors.accentCitrus} />
        <Text style={styles.badgeText}>AI RECIPE EXTRACTOR</Text>
      </View>

      {/* Hero Typography */}
      <Text style={styles.heroTitle}>Found a recipe you like? Drop the link.</Text>
      <Text style={styles.heroSub}>
        Paste any YouTube, Shorts, or Instagram Reel link. Our ultra-fast AI model converts it into a step-by-step recipe.
      </Text>

      {/* Auto-detected Clipboard Chip */}
      {clipboardUrl && !url && (
        <TouchableOpacity
          style={styles.clipboardChip}
          onPress={() => {
            setUrl(clipboardUrl);
            setClipboardUrl(null);
            handleExtract(clipboardUrl);
          }}
        >
          <Ionicons name="clipboard" size={14} color={Colors.accentCitrus} />
          <Text style={styles.clipboardText} numberOfLines={1}>
            Detected link in clipboard! Tap to extract
          </Text>
        </TouchableOpacity>
      )}

      {/* Pill Input Field */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Paste YouTube, Shorts, or Reel link..."
          placeholderTextColor={Colors.textMuted}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.pasteBtn} onPress={handlePaste}>
          <Ionicons name="clipboard-outline" size={18} color={Colors.accentCitrus} />
        </TouchableOpacity>
      </View>

      {/* Primary CTA */}
      <TouchableOpacity
        style={styles.extractBtn}
        activeOpacity={0.85}
        onPress={() => handleExtract()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.textInverse} />
        ) : (
          <>
            <Ionicons name="flash" size={18} color={Colors.textInverse} />
            <Text style={styles.extractBtnText}>Extract Recipe Now</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Bubbling Pot Animation */}
      {loading && (
        <BubblingPot statusText={statusText} statusSubtext={statusSubtext} />
      )}

      {/* Extracted Recipe Result Card */}
      {extractedRecipe && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.extractedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.accentCitrus} />
              <Text style={styles.extractedBadgeText}>Extracted via AI</Text>
            </View>
            <Text style={styles.timeBadge}>
              ⏱️ {extractedRecipe.prepTime + extractedRecipe.cookTime} MINS
            </Text>
          </View>

          <Text style={styles.resultTitle}>{extractedRecipe.title}</Text>
          <Text style={styles.resultDesc}>{extractedRecipe.description}</Text>

          {/* Macro Mini Grid */}
          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroVal}>{extractedRecipe.calories}</Text>
              <Text style={styles.macroLbl}>CALORIES</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroVal, { color: Colors.accentCitrus }]}>
                {extractedRecipe.protein}g
              </Text>
              <Text style={styles.macroLbl}>PROTEIN</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroVal, { color: Colors.accentCyan }]}>
                {extractedRecipe.ingredients.length}
              </Text>
              <Text style={styles.macroLbl}>ITEMS</Text>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.resultBtnSecondary}
              onPress={() => {
                HapticService.success();
                onSaveRecipe(extractedRecipe);
              }}
            >
              <Ionicons name="bookmark-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.resultBtnSecondaryText}>Save to Cookbook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resultBtnPrimary}
              onPress={() => {
                HapticService.light();
                onCookRecipe(extractedRecipe);
              }}
            >
              <Ionicons name="restaurant" size={16} color={Colors.textInverse} />
              <Text style={styles.resultBtnPrimaryText}>Cook Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Sample Links */}
      <View style={styles.sampleSection}>
        <Text style={styles.sampleTitle}>TRY VIRAL SAMPLE LINKS:</Text>
        <View style={styles.sampleChipsRow}>
          <TouchableOpacity
            style={styles.sampleChip}
            onPress={() => {
              const u = 'https://youtube.com/shorts/chili-garlic-noodles';
              setUrl(u);
              handleExtract(u);
            }}
          >
            <Ionicons name="logo-youtube" size={14} color="#FF0000" />
            <Text style={styles.sampleChipText}>15-Min Chili Noodles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sampleChip}
            onPress={() => {
              const u = 'https://instagram.com/reel/honey-butter-salmon';
              setUrl(u);
              handleExtract(u);
            }}
          >
            <Ionicons name="logo-instagram" size={14} color="#E1306C" />
            <Text style={styles.sampleChipText}>Honey Butter Salmon</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 120,
    alignItems: 'center',
    backgroundColor: Colors.bgApp,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 255, 0, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(212, 255, 0, 0.3)',
    marginBottom: 16,
  },
  badgeText: {
    color: Colors.accentCitrus,
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 10,
  },
  heroSub: {
    color: Colors.textSecondary,
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 320,
  },
  clipboardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(212, 255, 0, 0.12)',
    borderWidth: 1,
    borderColor: Colors.accentCitrus,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  clipboardText: {
    color: Colors.accentCitrus,
    fontSize: 12,
    fontWeight: '800',
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 14,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.pill,
    paddingHorizontal: 22,
    paddingRight: 50,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    fontSize: 14,
  },
  pasteBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extractBtn: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.accentCitrus,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  extractBtnText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '900',
  },
  resultCard: {
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginTop: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  extractedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  extractedBadgeText: {
    color: Colors.accentCitrus,
    fontSize: 11,
    fontWeight: '800',
  },
  timeBadge: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  resultTitle: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 6,
  },
  resultDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  macroItem: {
    flex: 1,
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    padding: 10,
    alignItems: 'center',
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
  resultActions: {
    flexDirection: 'row',
    gap: 10,
  },
  resultBtnSecondary: {
    flex: 1,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  resultBtnSecondaryText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  resultBtnPrimary: {
    flex: 1,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentCitrus,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  resultBtnPrimaryText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '900',
  },
  sampleSection: {
    marginTop: 28,
    width: '100%',
    alignItems: 'center',
  },
  sampleTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  sampleChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  sampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  sampleChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
