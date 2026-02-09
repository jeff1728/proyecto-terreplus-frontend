import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ButtonProps, Button as PaperButton } from 'react-native-paper';

interface Props extends ButtonProps {
    style?: ViewStyle;
}

export const Button = ({ mode = 'contained', style, ...props }: Props) => {
    return (
        <PaperButton
            mode={mode}
            style={[styles.button, style]}
            contentStyle={styles.content}
            {...props}
        >
            {props.children}
        </PaperButton>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 10,
        borderRadius: 8,
    },
    content: {
        height: 48,
    }
});
