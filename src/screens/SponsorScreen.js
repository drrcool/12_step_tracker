import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const SponsorScreen = () => {
    const [sponsor] = useState({
        name: 'Patricia M.',
        cleanTime: '8 years, 3 months',
        lastContact: '2 days ago',
        avatar: '🌟',
        phone: '(555) 123-4567',
    });

    const [sponsees] = useState([
        {
            id: 1,
            name: 'Alex R.',
            cleanTime: '45 days',
            lastContact: '1 day ago',
            avatar: '🔥',
            nextMeeting: 'Tomorrow 7:00 PM',
        },
        {
            id: 2,
            name: 'Jordan K.',
            cleanTime: '127 days',
            lastContact: '3 days ago',
            avatar: '💪',
            nextMeeting: 'Friday 6:30 PM',
        },
    ]);

    const [stepWork] = useState([
        {
            id: 1,
            step: 4,
            title: 'Step 4: Searching and Fearless Moral Inventory',
            dueDate: 'Due in 5 days',
            progress: 60,
            status: 'in_progress',
        },
        {
            id: 2,
            step: 3,
            title: 'Step 3: Decision to Turn Our Will Over',
            dueDate: 'Completed',
            progress: 100,
            status: 'completed',
        },
    ]);

    const [meetings] = useState([
        {
            id: 1,
            type: 'sponsor',
            date: 'Today',
            time: '7:00 PM',
            location: 'Coffee Shop on Main St',
            confirmed: true,
        },
        {
            id: 2,
            type: 'sponsee',
            date: 'Tomorrow',
            time: '6:30 PM',
            location: 'Virtual Meeting',
            confirmed: false,
            sponsee: 'Jordan K.',
        },
    ]);

    const [messageText, setMessageText] = useState('');

    const getStepStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return theme.colors.success;
            case 'in_progress':
                return theme.colors.primary[500];
            default:
                return theme.colors.neutral[400];
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Sponsor Connection */}
                <View style={styles.sponsorCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-circle-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.cardTitle}>My Sponsor</Text>
                    </View>

                    <View style={styles.sponsorInfo}>
                        <Text style={styles.sponsorAvatar}>{sponsor.avatar}</Text>
                        <View style={styles.sponsorDetails}>
                            <Text style={styles.sponsorName}>{sponsor.name}</Text>
                            <Text style={styles.sponsorTime}>{sponsor.cleanTime} clean</Text>
                            <Text style={styles.lastContact}>Last contact: {sponsor.lastContact}</Text>
                        </View>
                    </View>

                    <View style={styles.sponsorActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="call-outline" size={20} color={theme.colors.primary[500]} />
                            <Text style={styles.actionButtonText}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary[500]} />
                            <Text style={styles.actionButtonText}>Message</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary[500]} />
                            <Text style={styles.actionButtonText}>Schedule</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Message */}
                <View style={styles.messageCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="chatbubbles-outline" size={24} color={theme.colors.secondary[500]} />
                        <Text style={styles.cardTitle}>Quick Message</Text>
                    </View>

                    <View style={styles.messageInput}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Send a quick message to your sponsor..."
                            multiline
                            numberOfLines={3}
                            value={messageText}
                            onChangeText={setMessageText}
                            placeholderTextColor={theme.colors.text.secondary}
                        />
                    </View>

                    <TouchableOpacity style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Send Message</Text>
                        <Ionicons name="send-outline" size={16} color={theme.colors.text.inverse} />
                    </TouchableOpacity>
                </View>

                {/* Step Work */}
                <View style={styles.stepWorkCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="book-outline" size={24} color={theme.colors.accent[500]} />
                        <Text style={styles.cardTitle}>Step Work</Text>
                    </View>

                    {stepWork.map((step) => (
                        <View key={step.id} style={styles.stepItem}>
                            <View style={styles.stepHeader}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{step.step}</Text>
                                </View>
                                <View style={styles.stepInfo}>
                                    <Text style={styles.stepTitle}>{step.title}</Text>
                                    <Text style={[
                                        styles.stepDue,
                                        step.status === 'completed' && styles.stepCompleted
                                    ]}>
                                        {step.dueDate}
                                    </Text>
                                </View>
                                {step.status === 'completed' && (
                                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                                )}
                            </View>

                            {step.status === 'in_progress' && (
                                <View style={styles.stepProgress}>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${step.progress}%` }]} />
                                    </View>
                                    <Text style={styles.progressText}>{step.progress}%</Text>
                                </View>
                            )}
                        </View>
                    ))}

                    <TouchableOpacity style={styles.viewAllButton}>
                        <Text style={styles.viewAllButtonText}>View All Steps</Text>
                    </TouchableOpacity>
                </View>

                {/* Upcoming Meetings */}
                <View style={styles.meetingsCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="calendar-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.cardTitle}>Upcoming Meetings</Text>
                    </View>

                    {meetings.map((meeting) => (
                        <View key={meeting.id} style={styles.meetingItem}>
                            <View style={styles.meetingInfo}>
                                <View style={styles.meetingHeader}>
                                    <Text style={styles.meetingType}>
                                        {meeting.type === 'sponsor' ? 'With Sponsor' : `With ${meeting.sponsee}`}
                                    </Text>
                                    <View style={[
                                        styles.statusBadge,
                                        meeting.confirmed ? styles.confirmedBadge : styles.pendingBadge
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            meeting.confirmed ? styles.confirmedText : styles.pendingText
                                        ]}>
                                            {meeting.confirmed ? 'Confirmed' : 'Pending'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.meetingDetails}>
                                    <View style={styles.meetingTime}>
                                        <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} />
                                        <Text style={styles.meetingTimeText}>{meeting.date} at {meeting.time}</Text>
                                    </View>
                                    <View style={styles.meetingLocation}>
                                        <Ionicons name="location-outline" size={16} color={theme.colors.text.secondary} />
                                        <Text style={styles.meetingLocationText}>{meeting.location}</Text>
                                    </View>
                                </View>
                            </View>

                            {!meeting.confirmed && (
                                <TouchableOpacity style={styles.confirmButton}>
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    <TouchableOpacity style={styles.scheduleButton}>
                        <Ionicons name="add-outline" size={20} color={theme.colors.primary[500]} />
                        <Text style={styles.scheduleButtonText}>Schedule New Meeting</Text>
                    </TouchableOpacity>
                </View>

                {/* Sponsees (if any) */}
                {sponsees.length > 0 && (
                    <View style={styles.sponseesCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="people-outline" size={24} color={theme.colors.secondary[500]} />
                            <Text style={styles.cardTitle}>My Sponsees</Text>
                        </View>

                        {sponsees.map((sponsee) => (
                            <TouchableOpacity key={sponsee.id} style={styles.sponseeItem}>
                                <Text style={styles.sponseeAvatar}>{sponsee.avatar}</Text>
                                <View style={styles.sponseeInfo}>
                                    <Text style={styles.sponseeName}>{sponsee.name}</Text>
                                    <Text style={styles.sponseeTime}>{sponsee.cleanTime} clean</Text>
                                    <Text style={styles.nextMeeting}>Next: {sponsee.nextMeeting}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
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
    sponsorCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.serenity,
        marginBottom: theme.spacing.lg,
    },
    messageCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
        marginBottom: theme.spacing.lg,
    },
    stepWorkCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.gratitude,
        marginBottom: theme.spacing.lg,
    },
    meetingsCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
        marginBottom: theme.spacing.lg,
    },
    sponseesCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.community,
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
    sponsorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    sponsorAvatar: {
        fontSize: 48,
        marginRight: theme.spacing.md,
    },
    sponsorDetails: {
        flex: 1,
    },
    sponsorName: {
        ...theme.typography.styles.h4,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    sponsorTime: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[600],
        marginBottom: theme.spacing.xs,
    },
    lastContact: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    sponsorActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.primary,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.sm,
    },
    actionButtonText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[500],
        marginLeft: theme.spacing.xs,
    },
    messageInput: {
        marginBottom: theme.spacing.md,
    },
    textInput: {
        ...theme.components.input,
        ...theme.typography.styles.body1,
        color: theme.colors.text.primary,
        textAlignVertical: 'top',
        minHeight: 80,
    },
    sendButton: {
        backgroundColor: theme.colors.secondary[500],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    sendButtonText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
        marginRight: theme.spacing.sm,
    },
    stepItem: {
        marginBottom: theme.spacing.lg,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.accent[500],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    stepNumberText: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.inverse,
        fontWeight: '600',
    },
    stepInfo: {
        flex: 1,
    },
    stepTitle: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    stepDue: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    stepCompleted: {
        color: theme.colors.success,
    },
    stepProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 56, // offset for step number
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
        backgroundColor: theme.colors.accent[500],
        borderRadius: theme.borderRadius.sm,
    },
    progressText: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
        minWidth: 40,
    },
    viewAllButton: {
        alignSelf: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.accent[500],
        borderRadius: theme.borderRadius.md,
    },
    viewAllButtonText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
    },
    meetingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral[200],
    },
    meetingInfo: {
        flex: 1,
    },
    meetingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    meetingType: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
    },
    statusBadge: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
    },
    confirmedBadge: {
        backgroundColor: theme.colors.success,
    },
    pendingBadge: {
        backgroundColor: theme.colors.warning,
    },
    statusText: {
        ...theme.typography.styles.caption,
        fontWeight: '500',
    },
    confirmedText: {
        color: theme.colors.text.inverse,
    },
    pendingText: {
        color: theme.colors.text.inverse,
    },
    meetingDetails: {
        gap: theme.spacing.xs,
    },
    meetingTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    meetingTimeText: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    meetingLocation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    meetingLocationText: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    confirmButton: {
        backgroundColor: theme.colors.primary[500],
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    confirmButtonText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
        fontSize: 14,
    },
    scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary[100],
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    scheduleButtonText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[500],
        marginLeft: theme.spacing.sm,
    },
    sponseeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    sponseeAvatar: {
        fontSize: 32,
        marginRight: theme.spacing.md,
    },
    sponseeInfo: {
        flex: 1,
    },
    sponseeName: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    sponseeTime: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    nextMeeting: {
        ...theme.typography.styles.caption,
        color: theme.colors.primary[500],
    },
});

export default SponsorScreen;
