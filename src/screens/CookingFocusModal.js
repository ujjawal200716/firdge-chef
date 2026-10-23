import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Colors, Radius } from '../theme';
import { HapticService } from '../services/haptics';

export default function CookingFocusModal({ visible, recipe, onClose }) {
  if (!recipe) return null;

  const [stepIndex, setStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Keep-Awake lifecycle
  useEffect(() => {
    if (visible) {
      activateKeepAwakeAsync('COOKING_MODE').catch(e => console.log('KeepAwake error', e));
    }
    return () => {
      deactivateKeepAwake('COOKING_MODE').catch(e => {});
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [visible]);

  // Check for timers in step
  useEffect(() => {
    const currentStepText = recipe.steps[stepIndex] || '';
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerRunning(false);

    const match = currentStepText.match(/(\d+)\s*(min|minute|minutes)/i);
    if (match) {
      const mins = parseInt(match[1]);
      setTimerSeconds(mins * 60);
    } else {
      setTimerSeconds(0);
    }
  }, [stepIndex, recipe]);

  const toggleTimer = () => {
    if (timerRunning) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
      setTimerRunning(false);
      HapticService.light();
    } else {
      setTimerRunning(true);
      HapticService.success();
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerRunning(false);
            HapticService.heavy();
            Alert.alert('⏰ Step Timer Complete!', 'Your cooking step timer has finished.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNext = () => {
    if (stepIndex < recipe.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      HapticService.light();
    } else {
      HapticService.success();
      Alert.alert(
        '🎉 Cooking Complete!',
        `You nailed it Chef! "${recipe.title}" is ready to serve.`,
        [{ text: 'Enjoy Meal', onPress: onClose }]
      );
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      HapticService.light();
    }
  };

  const currentStep = recipe.steps[stepIndex];
  const progressPercent = ((stepIndex + 1) / recipe.steps.length) * 100;

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <SafeAreaView style={styles.container}>
        {/* Top Bar: Progress & Keep Awake Badge */}
        <View style={styles.topBar}>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.keepAwakeBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.keepAwakeText}>Keep-Awake: ON</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.stepCount}>
              Step {stepIndex + 1} of {recipe.steps.length}
            </Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </View>

        {/* Center Giant Step Display */}
        <View style={styles.centerBody}>
          <View style={styles.stepTag}>
            <Text style={styles.stepTagText}>STEP {stepIndex + 1}</Text>
          </View>

          <Text style={styles.stepGiantText}>{currentStep}</Text>

          {/* Interactive Timer if step contains minutes */}
          {timerSeconds > 0 && (
            <View style={styles.timerWidget}>
              <Ionicons name="timer-outline" size={20} color={Colors.accentCitrus} />
              <Text style={styles.timerDigits}>{formatTimer(timerSeconds)}</Text>
              <TouchableOpacity style={styles.timerBtn} onPress={toggleTimer}>
                <Ionicons
                  name={timerRunning ? 'pause' : 'play'}
                  size={16}
                  color={Colors.textInverse}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[styles.navStepBtn, stepIndex === 0 && { opacity: 0.3 }]}
            onPress={handlePrev}
            disabled={stepIndex === 0}
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextStepBtn} onPress={handleNext}>
            <Text style={styles.nextStepBtnText}>
              {stepIndex === recipe.steps.length - 1 ? 'Finish Cooking' : 'Next Step'}
            </Text>
            <Ionicons
              name={stepIndex === recipe.steps.length - 1 ? 'checkmark' : 'arrow-forward'}
              size={18}
              color={Colors.textInverse}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050608',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 48,
  },
  topBar: {
    gap: 16,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepAwakeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  keepAwakeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800',
  },
  progressContainer: {
    gap: 6,
  },
  stepCount: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.accentCitrus,
  },
  centerBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 20,
  },
  stepTag: {
    backgroundColor: 'rgba(212, 255, 0, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  stepTagText: {
    color: Colors.accentCitrus,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stepGiantText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  timerWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginTop: 10,
  },
  timerDigits: {
    color: Colors.accentCitrus,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  timerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentCitrus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  navStepBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepBtn: {
    flex: 1,
    height: 56,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentCitrus,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextStepBtnText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '900',
  },
});
