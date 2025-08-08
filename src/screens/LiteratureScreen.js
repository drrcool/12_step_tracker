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

const LiteratureScreen = () => {
    const [basicTexts] = useState([
        {
            id: 1,
            title: 'Alcoholics Anonymous (Big Book)',
            subtitle: 'The Story of How Many Thousands Have Recovered',
            category: 'Core Literature',
            pages: 575,
            progress: 45,
            bookmark: 'Chapter 4: We Agnostics',
            cover: '📖',
        },
        {
            id: 2,
            title: 'Twelve Steps and Twelve Traditions',
            subtitle: 'A Co-founder\'s Interpretation',
            category: 'Core Literature',
            pages: 192,
            progress: 78,
            bookmark: 'Step 11: Prayer and Meditation',
            cover: '📘',
        },
        {
            id: 3,
            title: 'As Bill Sees It',
            subtitle: 'Selected Writings of A.A.\'s Co-founder',
            category: 'Spiritual Growth',
            pages: 288,
            progress: 23,
            bookmark: 'Gratitude',
            cover: '📗',
        },
    ]);

    const [dailyReaders] = useState([
        {
            id: 1,
            title: 'Daily Reflections',
            todayEntry: 'December 15',
            theme: 'Surrender and Acceptance',
            excerpt: 'Today I will remember that my recovery depends on my willingness to surrender...',
            cover: '🌅',
        },
        {
            id: 2,
            title: 'Twenty-Four Hours a Day',
            todayEntry: 'December 15',
            theme: 'One Day at a Time',
            excerpt: 'Each day brings new opportunities for growth and spiritual development...',
            cover: '⏰',
        },
        {
            id: 3,
            title: 'Each Day a New Beginning',
            todayEntry: 'December 15',
            theme: 'Personal Growth',
            excerpt: 'Recovery is not just about stopping harmful behaviors, but about building a new life...',
            cover: '🌱',
        },
    ]);

    const [speakers] = useState([
        {
            id: 1,
            name: 'Joe & Charlie',
            title: 'Big Book Study',
            duration: '12 hours',
            sessions: 8,
            rating: 4.9,
            downloads: '1.2M',
            description: 'Comprehensive walkthrough of the Big Book with practical insights',
        },
        {
            id: 2,
            name: 'Chris R.',
            title: 'The 12 Steps',
            duration: '2.5 hours',
            sessions: 3,
            rating: 4.8,
            downloads: '890K',
            description: 'Clear explanation of working the steps with personal experience',
        },
        {
            id: 3,
            name: 'Sandy B.',
            title: 'Drop the Rock',
            duration: '1.8 hours',
            sessions: 2,
            rating: 4.7,
            downloads: '654K',
            description: 'Removing character defects and emotional sobriety',
        },
    ]);

    const [notifications] = useState({
        dailyReading: true,
        weeklyReflection: true,
        newSpeakers: false,
        literatureUpdates: true,
    });

    const renderBookItem = ({ item }) => (
        <TouchableOpacity style={styles.bookCard}>
            <View style={styles.bookHeader}>
                <Text style={styles.bookCover}>{item.cover}</Text>
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <Text style={styles.bookSubtitle}>{item.subtitle}</Text>
                    <Text style={styles.bookCategory}>{item.category}</Text>
                </View>
            </View>

            <View style={styles.bookProgress}>
                <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>{item.progress}% complete</Text>
                    <Text style={styles.bookmarkText}>📍 {item.bookmark}</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                </View>
            </View>

            <View style={styles.bookActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="play-outline" size={16} color={theme.colors.primary[500]} />
                    <Text style={styles.actionText}>Continue Reading</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                    <Ionicons name="bookmark-outline" size={16} color={theme.colors.text.secondary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderDailyReader = ({ item }) => (
        <TouchableOpacity style={styles.readerCard}>
            <View style={styles.readerHeader}>
                <Text style={styles.readerCover}>{item.cover}</Text>
                <View style={styles.readerInfo}>
                    <Text style={styles.readerTitle}>{item.title}</Text>
                    <Text style={styles.readerDate}>{item.todayEntry}</Text>
                    <Text style={styles.readerTheme}>{item.theme}</Text>
                </View>
            </View>

            <Text style={styles.readerExcerpt}>{item.excerpt}</Text>

            <TouchableOpacity style={styles.readFullButton}>
                <Text style={styles.readFullText}>Read Full Entry</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary[500]} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderSpeaker = ({ item }) => (
        <TouchableOpacity style={styles.speakerCard}>
            <View style={styles.speakerHeader}>
                <View style={styles.speakerAvatar}>
                    <Ionicons name="person" size={24} color={theme.colors.primary[500]} />
                </View>
                <View style={styles.speakerInfo}>
                    <Text style={styles.speakerName}>{item.name}</Text>
                    <Text style={styles.speakerTitle}>{item.title}</Text>
                    <View style={styles.speakerMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
                            <Text style={styles.metaText}>{item.duration}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="star" size={14} color={theme.colors.accent[500]} />
                            <Text style={styles.metaText}>{item.rating}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="download-outline" size={14} color={theme.colors.text.secondary} />
                            <Text style={styles.metaText}>{item.downloads}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Text style={styles.speakerDescription}>{item.description}</Text>

            <View style={styles.speakerActions}>
                <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="play" size={16} color={theme.colors.text.inverse} />
                    <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.downloadButton}>
                    <Ionicons name="download-outline" size={16} color={theme.colors.primary[500]} />
                    <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.headerSection}>
                    <Text style={styles.headerText}>Literature & Resources</Text>
                    <Text style={styles.subheaderText}>
                        Deepen your understanding with recovery literature and speaker recordings
                    </Text>
                </View>

                {/* Daily Readers */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="sunny-outline" size={24} color={theme.colors.accent[500]} />
                        <Text style={styles.sectionTitle}>Today's Readings</Text>
                    </View>

                    <FlatList
                        data={dailyReaders}
                        renderItem={renderDailyReader}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />
                </View>

                {/* Core Literature */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="library-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.sectionTitle}>Core Literature</Text>
                    </View>

                    <FlatList
                        data={basicTexts}
                        renderItem={renderBookItem}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />

                    <TouchableOpacity style={styles.browseButton}>
                        <Text style={styles.browseButtonText}>Browse All Literature</Text>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.primary[500]} />
                    </TouchableOpacity>
                </View>

                {/* Speaker Recordings */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="headset-outline" size={24} color={theme.colors.secondary[500]} />
                        <Text style={styles.sectionTitle}>Speaker Recordings</Text>
                    </View>

                    <FlatList
                        data={speakers}
                        renderItem={renderSpeaker}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />

                    <TouchableOpacity style={styles.browseButton}>
                        <Text style={styles.browseButtonText}>Browse All Speakers</Text>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.secondary[500]} />
                    </TouchableOpacity>
                </View>

                {/* Quick Links */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="link-outline" size={24} color={theme.colors.accent[500]} />
                        <Text style={styles.sectionTitle}>Quick Links</Text>
                    </View>

                    <View style={styles.quickLinksGrid}>
                        <TouchableOpacity style={styles.linkCard}>
                            <Ionicons name="storefront-outline" size={32} color={theme.colors.primary[500]} />
                            <Text style={styles.linkTitle}>A.A. Store</Text>
                            <Text style={styles.linkDescription}>Official literature & merchandise</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkCard}>
                            <Ionicons name="globe-outline" size={32} color={theme.colors.secondary[500]} />
                            <Text style={styles.linkTitle}>A.A. Website</Text>
                            <Text style={styles.linkDescription}>Official resources & information</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkCard}>
                            <Ionicons name="newspaper-outline" size={32} color={theme.colors.accent[500]} />
                            <Text style={styles.linkTitle}>Grapevine</Text>
                            <Text style={styles.linkDescription}>Monthly magazine & stories</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkCard}>
                            <Ionicons name="people-outline" size={32} color={theme.colors.primary[500]} />
                            <Text style={styles.linkTitle}>Meeting Guide</Text>
                            <Text style={styles.linkDescription}>Find meetings worldwide</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notification Settings */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="notifications-outline" size={24} color={theme.colors.primary[500]} />
                        <Text style={styles.sectionTitle}>Notifications</Text>
                    </View>

                    <View style={styles.notificationCard}>
                        <View style={styles.notificationItem}>
                            <View style={styles.notificationInfo}>
                                <Text style={styles.notificationTitle}>Daily Reading Reminder</Text>
                                <Text style={styles.notificationDescription}>8:00 AM every day</Text>
                            </View>
                            <TouchableOpacity style={[
                                styles.toggle,
                                notifications.dailyReading && styles.toggleActive
                            ]}>
                                <View style={[
                                    styles.toggleButton,
                                    notifications.dailyReading && styles.toggleButtonActive
                                ]} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.notificationItem}>
                            <View style={styles.notificationInfo}>
                                <Text style={styles.notificationTitle}>Weekly Reflection</Text>
                                <Text style={styles.notificationDescription}>Sunday evenings</Text>
                            </View>
                            <TouchableOpacity style={[
                                styles.toggle,
                                notifications.weeklyReflection && styles.toggleActive
                            ]}>
                                <View style={[
                                    styles.toggleButton,
                                    notifications.weeklyReflection && styles.toggleButtonActive
                                ]} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.notificationItem}>
                            <View style={styles.notificationInfo}>
                                <Text style={styles.notificationTitle}>New Speaker Recordings</Text>
                                <Text style={styles.notificationDescription}>When available</Text>
                            </View>
                            <TouchableOpacity style={[
                                styles.toggle,
                                notifications.newSpeakers && styles.toggleActive
                            ]}>
                                <View style={[
                                    styles.toggleButton,
                                    notifications.newSpeakers && styles.toggleButtonActive
                                ]} />
                            </TouchableOpacity>
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
    horizontalList: {
        paddingRight: theme.spacing.md,
    },
    readerCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.gratitude,
        width: 280,
        marginRight: theme.spacing.md,
    },
    readerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    readerCover: {
        fontSize: 32,
        marginRight: theme.spacing.md,
    },
    readerInfo: {
        flex: 1,
    },
    readerTitle: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    readerDate: {
        ...theme.typography.styles.body2,
        color: theme.colors.accent[600],
        marginBottom: theme.spacing.xs,
    },
    readerTheme: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
    },
    readerExcerpt: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
        fontStyle: 'italic',
    },
    readFullButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    readFullText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[500],
    },
    bookCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
        marginBottom: theme.spacing.md,
    },
    bookHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    bookCover: {
        fontSize: 48,
        marginRight: theme.spacing.md,
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    bookSubtitle: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
    },
    bookCategory: {
        ...theme.typography.styles.caption,
        color: theme.colors.primary[500],
        textTransform: 'uppercase',
    },
    bookProgress: {
        marginBottom: theme.spacing.md,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    progressText: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    bookmarkText: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    progressBar: {
        height: 8,
        backgroundColor: theme.colors.neutral[200],
        borderRadius: theme.borderRadius.sm,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary[500],
        borderRadius: theme.borderRadius.sm,
    },
    bookActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary[100],
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    secondaryAction: {
        backgroundColor: theme.colors.neutral[100],
        paddingHorizontal: theme.spacing.sm,
    },
    actionText: {
        ...theme.typography.styles.button,
        color: theme.colors.primary[500],
        marginLeft: theme.spacing.xs,
        fontSize: 14,
    },
    browseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.primary,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.sm,
    },
    browseButtonText: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.primary[500],
        marginRight: theme.spacing.sm,
    },
    speakerCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.recovery.meditation,
        marginBottom: theme.spacing.md,
    },
    speakerHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    speakerAvatar: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    speakerInfo: {
        flex: 1,
    },
    speakerName: {
        ...theme.typography.styles.subtitle1,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    speakerTitle: {
        ...theme.typography.styles.body1,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
    },
    speakerMeta: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
        marginLeft: theme.spacing.xs,
    },
    speakerDescription: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    speakerActions: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    playButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.secondary[500],
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    playButtonText: {
        ...theme.typography.styles.button,
        color: theme.colors.text.inverse,
        marginLeft: theme.spacing.xs,
        fontSize: 14,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.primary,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary[300],
    },
    downloadButtonText: {
        ...theme.typography.styles.button,
        color: theme.colors.primary[500],
        marginLeft: theme.spacing.xs,
        fontSize: 14,
    },
    quickLinksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    linkCard: {
        width: '48%',
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    linkTitle: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    linkDescription: {
        ...theme.typography.styles.caption,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    notificationCard: {
        ...theme.components.card,
        backgroundColor: theme.colors.background.primary,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    notificationInfo: {
        flex: 1,
    },
    notificationTitle: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },
    notificationDescription: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
    toggle: {
        width: 50,
        height: 30,
        borderRadius: 15,
        backgroundColor: theme.colors.neutral[300],
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleActive: {
        backgroundColor: theme.colors.primary[500],
    },
    toggleButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: theme.colors.background.primary,
        alignSelf: 'flex-start',
    },
    toggleButtonActive: {
        alignSelf: 'flex-end',
    },
});

export default LiteratureScreen;
