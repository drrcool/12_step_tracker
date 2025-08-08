import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconPress,
    secureTextEntry,
    multiline = false,
    numberOfLines = 1,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    style,
    inputStyle,
    disabled = false,
    required = false,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const toggleSecureEntry = () => {
        setIsSecureVisible(!isSecureVisible);
    };

    const getContainerStyle = () => {
        const baseStyle = [styles.container];
        if (style) baseStyle.push(style);
        return baseStyle;
    };

    const getInputContainerStyle = () => {
        const baseStyle = [styles.inputContainer];

        if (isFocused) {
            baseStyle.push(styles.focused);
        }

        if (error) {
            baseStyle.push(styles.error);
        }

        if (disabled) {
            baseStyle.push(styles.disabled);
        }

        return baseStyle;
    };

    const getInputStyle = () => {
        const baseStyle = [styles.input];

        if (multiline) {
            baseStyle.push(styles.multilineInput);
        }

        if (leftIcon) {
            baseStyle.push(styles.inputWithLeftIcon);
        }

        if (rightIcon || secureTextEntry) {
            baseStyle.push(styles.inputWithRightIcon);
        }

        if (inputStyle) {
            baseStyle.push(inputStyle);
        }

        return baseStyle;
    };

    return (
        <View style={getContainerStyle()}>
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                        {label}
                        {required && <Text style={styles.required}> *</Text>}
                    </Text>
                </View>
            )}

            <View style={getInputContainerStyle()}>
                {leftIcon && (
                    <View style={styles.leftIconContainer}>
                        <Ionicons
                            name={leftIcon}
                            size={20}
                            color={isFocused ? theme.colors.primary[500] : theme.colors.neutral[400]}
                        />
                    </View>
                )}

                <TextInput
                    style={getInputStyle()}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.neutral[400]}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={secureTextEntry && !isSecureVisible}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    editable={!disabled}
                    {...props}
                />

                {(rightIcon || secureTextEntry) && (
                    <TouchableOpacity
                        style={styles.rightIconContainer}
                        onPress={secureTextEntry ? toggleSecureEntry : onRightIconPress}
                        disabled={!secureTextEntry && !onRightIconPress}
                    >
                        <Ionicons
                            name={
                                secureTextEntry
                                    ? isSecureVisible
                                        ? 'eye-off-outline'
                                        : 'eye-outline'
                                    : rightIcon
                            }
                            size={20}
                            color={isFocused ? theme.colors.primary[500] : theme.colors.neutral[400]}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {(error || helperText) && (
                <View style={styles.helperContainer}>
                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={16} color={theme.colors.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                    {!error && helperText && (
                        <Text style={styles.helperText}>{helperText}</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    labelContainer: {
        marginBottom: theme.spacing.sm,
    },
    label: {
        ...theme.typography.styles.subtitle2,
        color: theme.colors.text.primary,
    },
    required: {
        color: theme.colors.error,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 1,
        borderColor: theme.colors.neutral[300],
        borderRadius: theme.borderRadius.md,
        minHeight: 48,
    },
    focused: {
        borderColor: theme.colors.primary[500],
        borderWidth: 2,
    },
    error: {
        borderColor: theme.colors.error,
        borderWidth: 2,
    },
    disabled: {
        backgroundColor: theme.colors.neutral[100],
        opacity: 0.6,
    },
    input: {
        flex: 1,
        ...theme.typography.styles.body1,
        color: theme.colors.text.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    inputWithLeftIcon: {
        paddingLeft: 0,
    },
    inputWithRightIcon: {
        paddingRight: 0,
    },
    leftIconContainer: {
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.sm,
    },
    rightIconContainer: {
        paddingRight: theme.spacing.md,
        paddingLeft: theme.spacing.sm,
    },
    helperContainer: {
        marginTop: theme.spacing.sm,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        ...theme.typography.styles.body2,
        color: theme.colors.error,
        marginLeft: theme.spacing.xs,
    },
    helperText: {
        ...theme.typography.styles.body2,
        color: theme.colors.text.secondary,
    },
});

export default Input;
