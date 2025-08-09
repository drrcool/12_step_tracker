import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [cleanTime] = useState({
    days: 145,
    hours: 12,
    minutes: 34,
  });

  const [dailyReflection] = useState(
    'Today I choose progress over perfection. Every moment is a new opportunity to grow and heal.',
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.subtitleText}>Keep moving forward, one day at a time</Text>
        </View>

        {/* Clean Time Counter */}
        <View style={styles.counterCard}>
          <View style={styles.counterHeader}>
            <Ionicons name="time-outline" size={24} color={theme.colors.primary[500]} />
            <Text style={styles.counterTitle}>Clean Time</Text>
          </View>

          <View style={styles.timeDisplay}>
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{cleanTime.days}</Text>
              <Text style={styles.timeLabel}>Days</Text>
            </View>
            <View style={styles.timeSeparator} />
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{cleanTime.hours}</Text>
              <Text style={styles.timeLabel}>Hours</Text>
            </View>
            <View style={styles.timeSeparator} />
            <View style={styles.timeUnit}>
              <Text style={styles.timeNumber}>{cleanTime.minutes}</Text>
              <Text style={styles.timeLabel}>Minutes</Text>
            </View>
          </View>

          <Text style={styles.milestoneText}>
                        🎉 Approaching 5 months - You're doing amazing!
          </Text>
        </View>

        {/* Daily Reflection */}
        <View style={styles.reflectionCard}>
          <View style={styles.reflectionHeader}>
            <Ionicons name="flower-outline" size={24} color={theme.colors.secondary[500]} />
            <Text style={styles.reflectionTitle}>Daily Reflection</Text>
          </View>
          <Text style={styles.reflectionText}>{dailyReflection}</Text>
          <TouchableOpacity style={styles.reflectionButton}>
            <Text style={styles.reflectionButtonText}>New Reflection</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Today's Focus</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.recovery.meditation }]}>
              <Ionicons name="leaf-outline" size={28} color={theme.colors.primary[600]} />
              <Text style={styles.actionText}>Meditate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.recovery.gratitude }]}>
              <Ionicons name="heart-outline" size={28} color={theme.colors.accent[600]} />
              <Text style={styles.actionText}>Gratitude</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.recovery.community }]}>
              <Ionicons name="people-outline" size={28} color={theme.colors.secondary[600]} />
              <Text style={styles.actionText}>Meeting</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.recovery.progress }]}>
              <Ionicons name="checkmark-circle-outline" size={28} color={theme.colors.secondary[600]} />
              <Text style={styles.actionText}>Check-in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    maxWidth: 800, // Max width for web
    alignSelf: 'center', // Center on web
    width: '100%',
  },
  welcomeSection: {
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitleText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  counterCard: {
    backgroundColor: theme.colors.recovery.serenity,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  counterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  counterTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 80,
  },
  timeNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.primary[600],
  },
  timeLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeSeparator: {
    width: 2,
    height: 40,
    backgroundColor: theme.colors.primary[300],
    marginHorizontal: theme.spacing.md,
  },
  milestoneText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  reflectionCard: {
    backgroundColor: theme.colors.recovery.gratitude,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  reflectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  reflectionText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: 26,
  },
  reflectionButton: {
    backgroundColor: theme.colors.accent[500],
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'center',
  },
  reflectionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.inverse,
  },
  quickActions: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    minWidth: 140,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
});

export default HomeScreen;