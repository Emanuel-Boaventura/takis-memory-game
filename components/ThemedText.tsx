import React from 'react'
import { Text, type TextProps } from 'react-native'
import { TColors, colors } from '../constants/colors'


export type ThemedTextProps = TextProps & {
  color?: TColors;
  weight?: 'normal' | 'bold' | 'black';
};

export function ThemedText({
  style,
  weight,
  color,
  ...rest
}: ThemedTextProps) {

  return (
    <Text
      style={[
        weight && { fontWeight: weight },
        color && { color: colors[color] },
        style,
      ]}
      {...rest}
    />
  )
}
