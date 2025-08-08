import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled = false,
    style,
    textStyle,
    ...props
}) => {
    const getButtonStyle = () => {
        const baseStyle = [styles.button];

        // Variant styles
        switch (variant) {
            case 'primary':
                baseStyle.push(styles.primaryButton);
                break;
            case 'secondary':
                baseStyle.push(styles.secondaryButton);
                break;
            case 'outline':
                baseStyle.push(styles.outlineButton);
                break;
            case 'ghost':
                baseStyle.push(styles.ghostButton);
                break;
            default:
                baseStyle.push(styles.primaryButton);
        }

        // Size styles
        switch (size) {
            case 'small':
                baseStyle.push(styles.smallButton);
                break;
            case 'medium':
                baseStyle.push(styles.mediumButton);
                break;
            case 'large':
                baseStyle.push(styles.largeButton);
                break;
        }

        // Disabled style
        if (disabled) {
            baseStyle.push(styles.disabledButton);
        }

        // Custom style
        if (style) {
            baseStyle.push(style);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseTextStyle = [styles.buttonText];

        // Variant text styles
        switch (variant) {
            case 'primary':
                baseTextStyle.push(styles.primaryText);
                break;
            case 'secondary':
                baseTextStyle.push(styles.secondaryText);
                break;
            case 'outline':
                baseTextStyle.push(styles.outlineText);
                break;
            case 'ghost':
                baseTextStyle.push(styles.ghostText);
                break;
        }

        // Size text styles
        switch (size) {
            case 'small':
                baseTextStyle.push(styles.smallText);
                break;
            case 'medium':
                baseTextStyle.push(styles.mediumText);
                break;
            case 'large':
                baseTextStyle.push(styles.largeText);
                break;
        }

        // Disabled text style
        if (disabled) {
            baseTextStyle.push(styles.disabledText);
        }

        // Custom text style
        if (textStyle) {
            baseTextStyle.push(textStyle);
        }

        return baseTextStyle;
    };

    const getIconColor = () => {
        if (disabled) return theme.colors.neutral[400];

        switch (variant) {
            case 'primary':
            case 'secondary':
                return theme.colors.text.inverse;
            case 'outline':
                return theme.colors.primary[500];
            case 'ghost':
                return theme.colors.primary[500];
            default:
                return theme.colors.text.inverse;
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'small':
                return 16;
            case 'medium':
                return 20;
            case 'large':
                return 24;
            default:
                return 20;
        }
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
            {...props}
        >
            {icon && iconPosition === 'left' && (
                <Ionicons
                    name={icon}
                    size={getIconSize()}
                    color={getIconColor()}
                    style={styles.iconLeft}
                />
            )}

            <Text style={getTextStyle()}>{title}</Text>

            {icon && iconPosition === 'right' && (
                <Ionicons
                    name={icon}
                    size={getIconSize()}
                    color={getIconColor()}
                    style={styles.iconRight}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.sm,
    },

    // Variant styles
    primaryButton: {
        backgroundColor: theme.colors.primary[500],
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary[500],
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary[500],
    },
    ghostButton: {
        backgroundColor: 'transparent',
    },

    // Size styles
    smallButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    mediumButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },
    largeButton: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
    },

    // Disabled style
    disabledButton: {
        backgroundColor: theme.colors.neutral[300],
        shadowOpacity: 0,
        elevation: 0,
    },

    // Text styles
    buttonText: {
        ...theme.typography.styles.button,
        textAlign: 'center',
    },

    // Variant text styles
    primaryText: {
        color: theme.colors.text.inverse,
    },
    secondaryText: {
        color: theme.colors.text.inverse,
    },
    outlineText: {
        color: theme.colors.primary[500],
    },
    ghostText: {
        color: theme.colors.primary[500],
    },

    // Size text styles
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },

    // Disabled text style
    disabledText: {
        color: theme.colors.neutral[500],
    },

    // Icon styles
    iconLeft: {
        marginRight: theme.spacing.sm,
    },
    iconRight: {
        marginLeft: theme.spacing.sm,
    },
});

export default Button;
