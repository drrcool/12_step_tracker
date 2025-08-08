import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import CommunityScreen from '../screens/CommunityScreen';
import SponsorScreen from '../screens/SponsorScreen';
import PrinciplesScreen from '../screens/PrinciplesScreen';
import LiteratureScreen from '../screens/LiteratureScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        switch (route.name) {
                            case 'Home':
                                iconName = focused ? 'home' : 'home-outline';
                                break;
                            case 'Progress':
                                iconName = focused ? 'trending-up' : 'trending-up-outline';
                                break;
                            case 'Community':
                                iconName = focused ? 'people' : 'people-outline';
                                break;
                            case 'Sponsor':
                                iconName = focused ? 'person-circle' : 'person-circle-outline';
                                break;
                            case 'Principles':
                                iconName = focused ? 'leaf' : 'leaf-outline';
                                break;
                            case 'Literature':
                                iconName = focused ? 'library' : 'library-outline';
                                break;
                            default:
                                iconName = 'circle';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: theme.colors.primary[500],
                    tabBarInactiveTintColor: theme.colors.neutral[400],
                    tabBarStyle: {
                        backgroundColor: theme.colors.background.primary,
                        borderTopColor: theme.colors.neutral[200],
                        paddingBottom: 5,
                        paddingTop: 5,
                        height: 60,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                    },
                    headerStyle: {
                        backgroundColor: theme.colors.background.primary,
                        borderBottomColor: theme.colors.neutral[200],
                        borderBottomWidth: 1,
                    },
                    headerTitleStyle: {
                        color: theme.colors.text.primary,
                        fontSize: 18,
                        fontWeight: '600',
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'Recovery',
                        headerTitle: '12 Step Tracker',
                    }}
                />
                <Tab.Screen
                    name="Progress"
                    component={ProgressScreen}
                    options={{
                        title: 'Progress',
                        headerTitle: 'My Progress',
                    }}
                />
                <Tab.Screen
                    name="Community"
                    component={CommunityScreen}
                    options={{
                        title: 'Community',
                        headerTitle: 'Community',
                    }}
                />
                <Tab.Screen
                    name="Sponsor"
                    component={SponsorScreen}
                    options={{
                        title: 'Sponsor',
                        headerTitle: 'Sponsor Connection',
                    }}
                />
                <Tab.Screen
                    name="Principles"
                    component={PrinciplesScreen}
                    options={{
                        title: 'Principles',
                        headerTitle: 'Daily Principles',
                    }}
                />
                <Tab.Screen
                    name="Literature"
                    component={LiteratureScreen}
                    options={{
                        title: 'Literature',
                        headerTitle: 'Resources',
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
