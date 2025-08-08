import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

const Card = ({
    children,
    style,
    backgroundColor = theme.colors.background.primary,
    padding = theme.spacing.md,
    borderRadius = theme.borderRadius.lg,
    shadow = 'md',
    onPress,
    ...props
}) => {
    const getShadowStyle = () => {
        switch (shadow) {
            case 'sm':
                return theme.shadows.sm;
            case 'md':
                return theme.shadows.md;
            case 'lg':
                return theme.shadows.lg;
            case 'xl':
                return theme.shadows.xl;
            case 'none':
                return {};
            default:
                return theme.shadows.md;
        }
    };

    const cardStyle = [
        styles.card,
        {
            backgroundColor,
            padding,
            borderRadius,
        },
        getShadowStyle(),
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.95}
                {...props}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        // Base card styles are applied via props
    },
});

export default Card;
