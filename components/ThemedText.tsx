import React from 'react'
import { Text, type TextProps } from 'react-native'
import { TColors, colors } from '../constants/colors'

export type ThemedTextProps = TextProps & {
  color?: TColors;
  weight?: '400' | '600' | '700' | '900';
};

export function ThemedText({ style, weight, color = 'primary', ...rest }: ThemedTextProps) {

  const fontFamily = weight
    ? {
      '400': 'Inter_400Regular',
      '600': 'Inter_600SemiBold',
      '700': 'Inter_700Bold',
      '900': 'Inter_900Black',
    }[weight]
    : 'Inter_400Regular' // Default to regular weight

  return (
    <Text
      style={[
        color && { color: colors[color] },
        style,
        { fontFamily }, // Apply the selected font family
      ]}
      {...rest}
    />
  )
}