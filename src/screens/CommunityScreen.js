import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const CommunityScreen = () => {
    const [challenges] = useState([
        {
            id: 1,
            title: '30-Day Gratitude Challenge',
            participants: 127,
            daysLeft: 12,
            progress: 60,
            joined: true,
            description: 'Write down 3 things you\'re grateful for each day',
        },
        {
            id: 2,
            title: 'Meeting Marathon',
            participants: 89,
            daysLeft: 5,
            progress: 85,
            joined: false,
            description: 'Attend at least one meeting per day for 7 days',
        },
        {
            id: 3,
            title: 'Meditation Mindfulness',
            participants: 156,
            daysLeft: 18,
            progress: 40,
            joined: true,
            description: '10 minutes of daily meditation for 30 days',
        },
    ]);

    const [leaderboard] = useState([
        { id: 1, name: 'Sarah M.', points: 2450, rank: 1, avatar: '🌟' },
        { id: 2, name: 'Mike R.', points: 2380, rank: 2, avatar: '🔥' },
        { id: 3, name: 'Jennifer L.', points: 2250, rank: 3, avatar: '💪' },
        { id: 4, name: 'You', points: 2100, rank: 4, avatar: '🎯', isUser: true },
        { id: 5, name: 'David K.', points: 1950, rank: 5, avatar: '⭐' },
    ]);

    const [supportGroups] = useState([
        {
            id: 1,
            name: 'Young People in Recovery',
            members: 342,
            online: 23,
            lastMessage: '2m ago',
            category: 'Age Group',
        },
        {
            id: 2,
            name: 'Parents in Recovery',
            members: 189,
            online: 12,
            lastMessage: '5m ago',
            category: 'Life Situation',
        },
        {
            id: 3,
            name: 'Meditation & Mindfulness',
            members: 456,
            online: 34,
            lastMessage: '1m ago',
            category: 'Practice',
        },
    ]);

    const renderChallenge = ({ item }) => (
        <View style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
                <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>{item.title}</Text>
                    <Text style={styles.challengeDescription}>{item.description}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.joinButton,
                        item.joined && styles.joinedButton
                    ]}
                >
                    <Text style={[
                        styles.joinButtonText,
                        item.joined && styles.joinedButtonText
                    ]}>
                        {item.joined ? 'Joined' : 'Join'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.challengeStats}>
                <View style={styles.statGroup}>
                    <Ionicons name="people-outline" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.statText}>{item.participants} participants</Text>
                </View>
                <View style={styles.statGroup}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.statText}>{item.daysLeft} days left</Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{item.progress}% complete</Text>
            </View>
        </View>
    );

    const renderLeaderboardItem = ({ item }) => (
        <View style={[styles.leaderboardItem, item.isUser && styles.userLeaderboardItem]}>
            <View style={styles.rankSection}>
                <Text style={styles.rankNumber}>#{item.rank}</Text>
            </View>
            <Text style={styles.avatar}>{item.avatar}</Text>
            <View style={styles.nameSection}>
                <Text style={[styles.participantName, item.isUser && styles.userName]}>
                    {item.name}
                </Text>
            </View>
            <Text style={styles.points}>{item.points.toLocaleString()} pts</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Community Header */}
                <View style={styles.headerSection}>
                    <Text style={styles.headerText}>Connect & Grow Together</Text>
                    <Text style={styles.subheaderText}>
                        Join challenges, support others, and celebrate milestones
                    </Text>
                </View>

                {/* Group Challenges */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="trophy-outline" size={24} color={theme.colors.accent[500]} />
                        <Text style={styles.sectionTitle}>Group Challenges</Text>
                    </View>

                    <FlatList
                        data={challenges}
                        renderItem={renderChallenge}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                {/* Leaderboard */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="podium-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.sectionTitle}>This Month's Leaders</Text>
                    </View>

                    <View style={styles.leaderboardCard}>
                        <FlatList
                            data={leaderboard}
                            renderItem={renderLeaderboardItem}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>

                {/* Support Groups */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="chatbubbles-outline" size={24} color={theme.colors.secondary[500]} />
                        <Text style={styles.sectionTitle}>Support Groups</Text>
                    </View>

                    {supportGroups.map((group) => (
                        <TouchableOpacity key={group.id} style={styles.groupCard}>
                            <View style={styles.groupHeader}>
                                <View style={styles.groupInfo}>
                                    <Text style={styles.groupName}>{group.name}</Text>
                                    <Text style={styles.groupCategory}>{group.category}</Text>
                                </View>
                                <View style={styles.onlineIndicator}>
                                    <View style={styles.onlineDot} />
                                    <Text style={styles.onlineText}>{group.online} online</Text>
                                </View>
                            </View>

                            <View style={styles.groupStats}>
                                <Text style={styles.memberCount}>{group.members} members</Text>
                                <Text style={styles.lastMessage}>Last message {group.lastMessage}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.actionButtonText}>Start a Challenge</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="people-circle-outline" size={24} color={theme.colors.secondary[500]} />
                        <Text style={styles.actionButtonText}>Find Support Groups</Text>
                    </TouchableOpacity>
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
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.styles.h4,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
    challengeCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
        marginBottom: theme.spacing.md,
    },
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    challengeInfo: {
        flex: 1,
        marginRight: theme.spacing.md,
    },
    challengeTitle: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    challengeDescription: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    joinButton: {
        backgroundColor: theme.colors.primary[500],
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    joinedButton: {
        backgroundColor: theme.colors.secondary[500],
    },
    joinButtonText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
        fontSize: 14,
    },
    joinedButtonText: {
        color: theme.colors.text.inverse,
    },
    challengeStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    statGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: theme.colors.neutral[200],
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.sm,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary[500],
        borderRadius: theme.borderRadius.sm,
    },
    progressText: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
        minWidth: 60,
    },
    leaderboardCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral[100],
    },
    userLeaderboardItem: {
        backgroundColor: theme.colors.recovery.serenity,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.sm,
        marginVertical: theme.spacing.xs,
    },
    rankSection: {
        width: 40,
        alignItems: 'center',
    },
    rankNumber: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
    },
    avatar: {
        fontSize: 24,
        marginRight: theme.spacing.sm,
    },
    nameSection: {
        flex: 1,
    },
    participantName: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
    },
    userName: {
        fontWeight: '600',
    },
    points: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[500],
    },
    groupCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.community,
        marginBottom: theme.spacing.md,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    groupInfo: {
        flex: 1,
    },
    groupName: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    groupCategory: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
    },
    onlineIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.success,
        marginRight: theme.spacing.xs,
    },
    onlineText: {
        ...theme.typography.styles.caption,
        color: theme.colors.success,
    },
    groupStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    memberCount: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    lastMessage: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    quickActionsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.primary,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.sm,
    },
    actionButtonText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    },
});

export default CommunityScreen;
