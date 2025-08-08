import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const PrinciplesScreen = () => {
    const [meditationTimer, setMeditationTimer] = useState({
        isRunning: false,
        duration: 600, // 10 minutes in seconds
        timeLeft: 600,
    });

    const [gratitudeEntries] = useState([
        {
            id: 1,
            date: 'Today',
            entries: [
                'My sponsor\'s guidance and patience',
                'A good night\'s sleep and peaceful morning',
                'The strength to face challenges with serenity',
            ],
        },
        {
            id: 2,
            date: 'Yesterday',
            entries: [
                'Connection with my recovery community',
                'Progress in my step work',
                'A beautiful sunset during my evening walk',
            ],
        },
    ]);

    const [habits] = useState([
        {
            id: 1,
            name: 'Morning Meditation',
            icon: 'leaf-outline',
            streak: 12,
            completed: true,
            target: 'Daily',
        },
        {
            id: 2,
            name: 'Gratitude Journal',
            icon: 'heart-outline',
            streak: 8,
            completed: true,
            target: 'Daily',
        },
        {
            id: 3,
            name: 'Quality Sleep (8hrs)',
            icon: 'moon-outline',
            streak: 5,
            completed: false,
            target: 'Daily',
        },
        {
            id: 4,
            name: 'Evening Reflection',
            icon: 'book-outline',
            streak: 15,
            completed: false,
            target: 'Daily',
        },
    ]);

    const [showGratitudeModal, setShowGratitudeModal] = useState(false);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleMeditation = () => {
        setMeditationTimer(prev => ({
            ...prev,
            isRunning: !prev.isRunning,
        }));
    };

    const resetMeditation = () => {
        setMeditationTimer(prev => ({
            ...prev,
            isRunning: false,
            timeLeft: prev.duration,
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.headerSection}>
                    <Text style={styles.headerText}>Daily Principles</Text>
                    <Text style={styles.subheaderText}>
                        Cultivate mindfulness, gratitude, and healthy habits
                    </Text>
                </View>

                {/* Meditation Timer */}
                <View style={styles.meditationCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="leaf-outline" size={24} color={theme.colors.secondary[500]} />
                        <Text style={styles.cardTitle}>Meditation Timer</Text>
                    </View>

                    <View style={styles.timerDisplay}>
                        <View style={styles.timerCircle}>
                            <Text style={styles.timerText}>{formatTime(meditationTimer.timeLeft)}</Text>
                            <Text style={styles.timerLabel}>
                                {meditationTimer.isRunning ? 'In Progress' : 'Ready to Begin'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.timerControls}>
                        <TouchableOpacity
                            style={[styles.timerButton, styles.resetButton]}
                            onPress={resetMeditation}
                        >
                            <Ionicons name="refresh-outline" size={20} color={theme.colors.text.secondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.timerButton,
                                styles.playButton,
                                meditationTimer.isRunning && styles.pauseButton
                            ]}
                            onPress={toggleMeditation}
                        >
                            <Ionicons
                                name={meditationTimer.isRunning ? 'pause' : 'play'}
                                size={32}
                                color={theme.colors.text.inverse}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.timerButton, styles.settingsButton]}>
                            <Ionicons name="settings-outline" size={20} color={theme.colors.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.meditationTips}>
                        <Text style={styles.tipsTitle}>Today's Focus</Text>
                        <Text style={styles.tipsText}>
                            "Focus on your breath. When your mind wanders, gently return your attention to the present moment."
                        </Text>
                    </View>
                </View>

                {/* Gratitude Journal */}
                <View style={styles.gratitudeCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="heart-outline" size={24} color={theme.colors.accent[500]} />
                        <Text style={styles.cardTitle}>Gratitude Journal</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.addGratitudeButton}
                        onPress={() => setShowGratitudeModal(true)}
                    >
                        <Ionicons name="add-outline" size={24} color={theme.colors.accent[600]} />
                        <Text style={styles.addGratitudeText}>Add Today's Gratitude</Text>
                    </TouchableOpacity>

                    {gratitudeEntries.map((entry) => (
                        <View key={entry.id} style={styles.gratitudeEntry}>
                            <Text style={styles.entryDate}>{entry.date}</Text>
                            {entry.entries.map((item, index) => (
                                <View key={index} style={styles.gratitudeItem}>
                                    <Text style={styles.gratitudeBullet}>•</Text>
                                    <Text style={styles.gratitudeText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    ))}

                    <TouchableOpacity style={styles.viewAllGratitude}>
                        <Text style={styles.viewAllText}>View All Entries</Text>
                    </TouchableOpacity>
                </View>

                {/* Habit Tracker */}
                <View style={styles.habitsCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.cardTitle}>Habit Tracker</Text>
                    </View>

                    {habits.map((habit) => (
                        <View key={habit.id} style={styles.habitItem}>
                            <TouchableOpacity
                                style={[
                                    styles.habitCheckbox,
                                    habit.completed && styles.habitCompleted
                                ]}
                            >
                                {habit.completed && (
                                    <Ionicons name="checkmark" size={20} color={theme.colors.text.inverse} />
                                )}
                            </TouchableOpacity>

                            <View style={styles.habitIcon}>
                                <Ionicons name={habit.icon} size={20} color={theme.colors.primary[500]} />
                            </View>

                            <View style={styles.habitInfo}>
                                <Text style={[
                                    styles.habitName,
                                    habit.completed && styles.habitNameCompleted
                                ]}>
                                    {habit.name}
                                </Text>
                                <Text style={styles.habitTarget}>{habit.target}</Text>
                            </View>

                            <View style={styles.habitStreak}>
                                <Text style={styles.streakNumber}>{habit.streak}</Text>
                                <Text style={styles.streakLabel}>day streak</Text>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addHabitButton}>
                        <Ionicons name="add-outline" size={20} color={theme.colors.primary[500]} />
                        <Text style={styles.addHabitText}>Add New Habit</Text>
                    </TouchableOpacity>
                </View>

                {/* Daily Affirmation */}
                <View style={styles.affirmationCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="flower-outline" size={24} color={theme.colors.secondary[500]} />
                        <Text style={styles.cardTitle}>Daily Affirmation</Text>
                    </View>

                    <Text style={styles.affirmationText}>
                        "I am exactly where I need to be in my recovery journey. Each day, I grow stronger in my commitment to healing and self-discovery."
                    </Text>

                    <TouchableOpacity style={styles.newAffirmationButton}>
                        <Text style={styles.newAffirmationText}>New Affirmation</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Principles */}
                <View style={styles.principlesCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="library-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.cardTitle}>12 Step Principles</Text>
                    </View>

                    <View style={styles.principlesList}>
                        <TouchableOpacity style={styles.principleItem}>
                            <Text style={styles.principleNumber}>1</Text>
                            <Text style={styles.principleText}>Honesty</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.principleItem}>
                            <Text style={styles.principleNumber}>2</Text>
                            <Text style={styles.principleText}>Hope</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.principleItem}>
                            <Text style={styles.principleNumber}>3</Text>
                            <Text style={styles.principleText}>Faith</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.principleItem}>
                            <Text style={styles.principleNumber}>4</Text>
                            <Text style={styles.principleText}>Courage</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.viewAllPrinciples}>
                        <Text style={styles.viewAllText}>View All 12 Principles</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Gratitude Modal */}
            <Modal
                visible={showGratitudeModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowGratitudeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>What are you grateful for today?</Text>
                        {/* Modal content would go here */}
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowGratitudeModal(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    headerSection: {
        marginBottom: theme.spacing.lg,
    },
    headerText: {
        ...theme.typography.styles.h2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    subheaderText: {
        ...theme.typography.styles.body1,
        color: theme.colors.text.secondary,
    },
    meditationCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.meditation,
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    gratitudeCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.gratitude,
        marginBottom: theme.spacing.lg,
    },
    habitsCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
        marginBottom: theme.spacing.lg,
    },
    affirmationCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.serenity,
        marginBottom: theme.spacing.lg,
    },
    principlesCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        alignSelf: 'flex-start',
    },
    cardTitle: {
        ...theme.typography.styles.h4,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    timerDisplay: {
        marginBottom: theme.spacing.xl,
    },
    timerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: theme.colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    timerText: {
        ...theme.typography.styles.counter,
        color: theme.colors.secondary[600],
        fontSize: 48,
    },
    timerLabel: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.sm,
    },
    timerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.lg,
    },
    timerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    resetButton: {
        backgroundColor: theme.colors.background.primary,
    },
    settingsButton: {
        backgroundColor: theme.colors.background.primary,
    },
    playButton: {
        backgroundColor: theme.colors.secondary[500],
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    pauseButton: {
        backgroundColor: theme.colors.warning,
    },
    meditationTips: {
        alignSelf: 'stretch',
    },
    tipsTitle: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    tipsText: {
        ...theme.typography.styles.affirmation,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    addGratitudeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.accent[100],
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.lg,
    },
    addGratitudeText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.accent[600],
        marginLeft: theme.spacing.sm,
    },
    gratitudeEntry: {
        marginBottom: theme.spacing.lg,
    },
    entryDate: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    gratitudeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xs,
    },
    gratitudeBullet: {
        ...theme.typography.styles.body1,
        color: theme.colors.accent[500],
        marginRight: theme.spacing.sm,
        width: 20,
    },
    gratitudeText: {
        ...theme.typography.styles.body1,
        color: theme.colors.text.primary,
        flex: 1,
    },
    viewAllGratitude: {
        alignSelf: 'center',
    },
    viewAllText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.accent[500],
    },
    habitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    habitCheckbox: {
        width: 24,
        height: 24,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 2,
        borderColor: theme.colors.neutral[300],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    habitCompleted: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
    },
    habitIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
    },
    habitNameCompleted: {
        textDecorationLine: 'line-through',
        color: theme.colors.text.secondary,
    },
    habitTarget: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    habitStreak: {
        alignItems: 'center',
    },
    streakNumber: {
        ...theme.typography.styles.h4,
        color: theme.colors.primary[500],
    },
    streakLabel: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
    },
    addHabitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary[100],
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    addHabitText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[500],
        marginLeft: theme.spacing.sm,
    },
    affirmationText: {
        ...theme.typography.styles.affirmation,
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    newAffirmationButton: {
        backgroundColor: theme.colors.primary[500],
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignSelf: 'center',
    },
    newAffirmationText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
    },
    principlesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
    },
    principleItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary[50],
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
    },
    principleNumber: {
        ...theme.typography.styles.h4,
        color: theme.colors.primary[500],
        marginRight: theme.spacing.sm,
        width: 24,
    },
    principleText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
    },
    viewAllPrinciples: {
        alignSelf: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        margin: theme.spacing.lg,
        width: '90%',
    },
    modalTitle: {
        ...theme.typography.styles.h3,
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    modalCloseButton: {
        backgroundColor: theme.colors.primary[500],
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    modalCloseText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
    },
});

export default PrinciplesScreen;
