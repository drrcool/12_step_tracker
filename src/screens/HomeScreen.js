import React, { useState, useEffect } from 'react';
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
    const [cleanTime, setCleanTime] = useState({
        days: 145,
        hours: 12,
        minutes: 34,
    });

    const [dailyReflection, setDailyReflection] = useState(
        "Today I choose progress over perfection. Every moment is a new opportunity to grow and heal."
    );

    // Calculate total clean time
    const totalHours = cleanTime.days * 24 + cleanTime.hours;
    const totalMinutes = totalHours * 60 + cleanTime.minutes;

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

                {/* Meeting Locator Teaser */}
                <TouchableOpacity style={styles.meetingCard}>
                    <View style={styles.meetingHeader}>
                        <Ionicons name="location-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.meetingTitle}>Find Nearby Meetings</Text>
                    </View>
                    <Text style={styles.meetingSubtitle}>3 meetings happening today within 5 miles</Text>
                    <View style={styles.meetingCTA}>
                        <Text style={styles.meetingCTAText}>View all meetings</Text>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.primary[500]} />
                    </View>
                </TouchableOpacity>
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
    },
    welcomeSection: {
        marginBottom: theme.spacing.lg,
    },
    welcomeText: {
        ...theme.typography.styles.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    subtitleText: {
        ...theme.typography.styles.body1,
        color: theme.colors.text.secondary,
    },
    counterCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.serenity,
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    counterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    counterTitle: {
        ...theme.typography.styles.h3,
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
        ...theme.typography.styles.counter,
        color: theme.colors.primary[600],
    },
    timeLabel: {
        ...theme.typography.styles.caption,
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
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    reflectionCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.gratitude,
        marginBottom: theme.spacing.lg,
    },
    reflectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    reflectionTitle: {
        ...theme.typography.styles.h4,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    reflectionText: {
        ...theme.typography.styles.affirmation,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    reflectionButton: {
        backgroundColor: theme.colors.accent[500],
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignSelf: 'center',
    },
    reflectionButtonText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
    },
    quickActions: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.styles.h4,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: (width - theme.spacing.md * 3) / 2,
        aspectRatio: 1,
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    actionText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.sm,
    },
    meetingCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
    },
    meetingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    meetingTitle: {
        ...theme.typography.styles.h4,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    meetingSubtitle: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
    },
    meetingCTA: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    meetingCTAText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[500],
    },
});

export default HomeScreen;
