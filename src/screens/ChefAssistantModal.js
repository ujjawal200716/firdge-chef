import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';
import { ApiService } from '../services/api';
import { HapticService } from '../services/haptics';

export default function ChefAssistantModal({ visible, recipe, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'chef',
      text: recipe
        ? `Bonjour! I am Chef Auguste, your AI culinary assistant powered by Groq Cloud. How can I help you perfect "${recipe.title}" today? Ask me about techniques, substitutions, or pairing ideas!`
        : `Bonjour! I am Chef Auguste, your AI culinary advisor powered by Groq Cloud. Ask me any cooking question, ingredient substitutions, or tell me what's in your fridge and I'll suggest a recipe!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'How do I make the skin crispier? 🔥',
    'Best healthy substitutions? 🥑',
    'What wine or drink pairs best? 🍷',
    'How do I reheat leftovers without drying? 🍱'
  ];

  const handleSend = async (questionText = input) => {
    const q = questionText.trim();
    if (!q || loading) return;

    HapticService.light();
    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const answer = await ApiService.askGroqChef(
        q,
        recipe ? recipe.title : null,
        recipe ? recipe.ingredients : null
      );
      HapticService.success();
      setMessages(prev => [
        ...prev,
        {
          id: 'chef_' + Date.now(),
          sender: 'chef',
          text: answer
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'chef_err_' + Date.now(),
          sender: 'chef',
          text: "Pardonnez-moi! I am adjusting my kitchen stove. Please ask your question again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Ionicons name="restaurant" size={18} color={Colors.accentCitrus} />
              </View>
              <View>
                <Text style={styles.chefName}>Chef Auguste</Text>
                <View style={styles.groqBadge}>
                  <Ionicons name="flash" size={10} color={Colors.accentCitrus} />
                  <Text style={styles.groqBadgeText}>GROQ CLOUD AI</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Context Badge if attached to a recipe */}
          {recipe && (
            <View style={styles.recipeContextBadge}>
              <Ionicons name="book-outline" size={12} color={Colors.accentCitrus} />
              <Text style={styles.recipeContextText} numberOfLines={1}>
                Cooking: {recipe.title}
              </Text>
            </View>
          )}

          {/* Chat Messages */}
          <ScrollView
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(msg => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.chefBubble
                ]}
              >
                {msg.sender === 'chef' && (
                  <Text style={styles.chefSenderLabel}>👨‍🍳 CHEF AUGUSTE</Text>
                )}
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}

            {loading && (
              <View style={[styles.messageBubble, styles.chefBubble]}>
                <View style={styles.typingRow}>
                  <ActivityIndicator size="small" color={Colors.accentCitrus} />
                  <Text style={styles.typingText}>Groq Cloud is cooking your answer...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompts */}
          <View style={styles.quickPromptsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPromptsScroll}>
              {quickPrompts.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  onPress={() => handleSend(p)}
                >
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask Chef Auguste anything..."
              placeholderTextColor={Colors.textMuted}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
              onPress={() => handleSend()}
              disabled={!input.trim() || loading}
            >
              <Ionicons name="arrow-up" size={20} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgApp,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.accentCitrus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chefName: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  groqBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  groqBadgeText: {
    color: Colors.accentCitrus,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeContextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 255, 0, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 255, 0, 0.2)',
  },
  recipeContextText: {
    color: Colors.accentCitrus,
    fontSize: 11,
    fontWeight: '800',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: Radius.lg,
    padding: 14,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accentCitrus,
    borderBottomRightRadius: 4,
  },
  chefBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderBottomLeftRadius: 4,
  },
  chefSenderLabel: {
    color: Colors.accentCitrus,
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  messageText: {
    color: Colors.textPrimary,
    fontSize: 13.5,
    lineHeight: 20,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  quickPromptsWrapper: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  quickPromptsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  promptChipText: {
    color: Colors.textSecondary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    color: Colors.textPrimary,
    fontSize: 13.5,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentCitrus,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
