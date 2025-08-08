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

const ProgressScreen = () => {
    const [meetingStats] = useState({
        attended: 67,
        goal: 90,
        streak: 12,
    });

    const [moodData] = useState([
        { day: 'Mon', mood: 4 },
        { day: 'Tue', mood: 5 },
        { day: 'Wed', mood: 3 },
        { day: 'Thu', mood: 4 },
        { day: 'Fri', mood: 5 },
        { day: 'Sat', mood: 4 },
        { day: 'Sun', mood: 4 },
    ]);

    const [goals] = useState([
        { id: 1, title: 'Daily Meditation', progress: 85, target: 100, icon: 'leaf-outline' },
        { id: 2, title: 'Meeting Attendance', progress: 67, target: 90, icon: 'people-outline' },
        { id: 3, title: 'Gratitude Entries', progress: 23, target: 30, icon: 'heart-outline' },
        { id: 4, title: 'Sleep Quality', progress: 78, target: 100, icon: 'moon-outline' },
    ]);

    const getMoodColor = (mood) => {
        const colors = [
            theme.colors.error,
            theme.colors.warning,
            theme.colors.accent[400],
            theme.colors.secondary[400],
            theme.colors.secondary[500],
        ];
        return colors[mood - 1] || theme.colors.neutral[400];
    };

    const getMoodEmoji = (mood) => {
        const emojis = ['😔', '😕', '😐', '😊', '😄'];
        return emojis[mood - 1] || '😐';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 90 in 90 Tracker */}
                <View style={styles.meetingCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="calendar-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.cardTitle}>90 in 90 Challenge</Text>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${(meetingStats.attended / meetingStats.goal) * 100}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {meetingStats.attended} / {meetingStats.goal} meetings
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{meetingStats.streak}</Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{90 - meetingStats.attended}</Text>
                            <Text style={styles.statLabel}>Days Left</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{Math.round((meetingStats.attended / meetingStats.goal) * 100)}%</Text>
                            <Text style={styles.statLabel}>Complete</Text>
                        </View>
                    </View>
                </View>

                {/* Mood Tracking */}
                <View style={styles.moodCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="happy-outline" size={24} color={theme.colors.secondary[500]} />
                        <Text style={styles.cardTitle}>Mood This Week</Text>
                    </View>

                    <View style={styles.moodChart}>
                        {moodData.map((item, index) => (
                            <View key={index} style={styles.moodDay}>
                                <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
                                <View
                                    style={[
                                        styles.moodBar,
                                        {
                                            height: item.mood * 12,
                                            backgroundColor: getMoodColor(item.mood),
                                        }
                                    ]}
                                />
                                <Text style={styles.moodLabel}>{item.day}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.moodButton}>
                        <Text style={styles.moodButtonText}>Log Today's Mood</Text>
                    </TouchableOpacity>
                </View>

                {/* Goal Progress */}
                <View style={styles.goalsCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="target-outline" size={24} color={theme.colors.accent[500]} />
                        <Text style={styles.cardTitle}>Monthly Goals</Text>
                    </View>

                    {goals.map((goal) => (
                        <View key={goal.id} style={styles.goalItem}>
                            <View style={styles.goalHeader}>
                                <View style={styles.goalIcon}>
                                    <Ionicons name={goal.icon} size={20} color={theme.colors.primary[500]} />
                                </View>
                                <View style={styles.goalInfo}>
                                    <Text style={styles.goalTitle}>{goal.title}</Text>
                                    <Text style={styles.goalProgress}>
                                        {goal.progress} / {goal.target}
                                    </Text>
                                </View>
                                <Text style={styles.goalPercentage}>
                                    {Math.round((goal.progress / goal.target) * 100)}%
                                </Text>
                            </View>

                            <View style={styles.goalProgressBar}>
                                <View
                                    style={[
                                        styles.goalProgressFill,
                                        { width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }
                                    ]}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Achievement Section */}
                <View style={styles.achievementCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="trophy-outline" size={24} color={theme.colors.accent[600]} />
                        <Text style={styles.cardTitle}>Recent Achievements</Text>
                    </View>

                    <View style={styles.achievementList}>
                        <View style={styles.achievementItem}>
                            <Text style={styles.achievementEmoji}>🏆</Text>
                            <View style={styles.achievementText}>
                                <Text style={styles.achievementTitle}>5 Month Milestone</Text>
                                <Text style={styles.achievementDate}>2 days ago</Text>
                            </View>
                        </View>

                        <View style={styles.achievementItem}>
                            <Text style={styles.achievementEmoji}>🔥</Text>
                            <View style={styles.achievementText}>
                                <Text style={styles.achievementTitle}>2 Week Meeting Streak</Text>
                                <Text style={styles.achievementDate}>1 week ago</Text>
                            </View>
                        </View>

                        <View style={styles.achievementItem}>
                            <Text style={styles.achievementEmoji}>🧘</Text>
                            <View style={styles.achievementText}>
                                <Text style={styles.achievementTitle}>30 Days of Meditation</Text>
                                <Text style={styles.achievementDate}>3 days ago</Text>
                            </View>
                        </View>
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
    },
    meetingCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.progress,
        marginBottom: theme.spacing.lg,
    },
    moodCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.meditation,
        marginBottom: theme.spacing.lg,
    },
    goalsCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
        marginBottom: theme.spacing.lg,
    },
    achievementCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.gratitude,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    cardTitle: {
        ...theme.typography.styles.h4,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    progressContainer: {
        marginBottom: theme.spacing.lg,
    },
    progressBar: {
        height: 12,
        backgroundColor: theme.colors.neutral[200],
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        marginBottom: theme.spacing.sm,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.secondary[500],
        borderRadius: theme.borderRadius.md,
    },
    progressText: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        ...theme.typography.styles.h3,
        color: theme.colors.secondary[600],
    },
    statLabel: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
    },
    moodChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 120,
        marginBottom: theme.spacing.lg,
    },
    moodDay: {
        alignItems: 'center',
        flex: 1,
    },
    moodEmoji: {
        fontSize: 20,
        marginBottom: theme.spacing.xs,
    },
    moodBar: {
        width: 20,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.xs,
    },
    moodLabel: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
    },
    moodButton: {
        backgroundColor: theme.colors.secondary[500],
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignSelf: 'center',
    },
    moodButtonText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
    },
    goalItem: {
        marginBottom: theme.spacing.lg,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    goalIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    goalInfo: {
        flex: 1,
    },
    goalTitle: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
    },
    goalProgress: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    goalPercentage: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[500],
    },
    goalProgressBar: {
        height: 8,
        backgroundColor: theme.colors.neutral[200],
        borderRadius: theme.borderRadius.sm,
        overflow: 'hidden',
    },
    goalProgressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary[500],
        borderRadius: theme.borderRadius.sm,
    },
    achievementList: {
        gap: theme.spacing.md,
    },
    achievementItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    achievementEmoji: {
        fontSize: 32,
        marginRight: theme.spacing.md,
    },
    achievementText: {
        flex: 1,
    },
    achievementTitle: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
    },
    achievementDate: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
});

export default ProgressScreen;
