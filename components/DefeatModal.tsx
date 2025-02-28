import { colors } from '@/constants/colors'
import { TIME_LIMIT } from '@/constants/game'
import React from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from './ThemedText'

interface IDefeatModal {
  visible: boolean
  attempts: number
  resetGameState: () => void
}

export const DefeatModal = ({ visible, attempts, resetGameState }: IDefeatModal) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.modalOverlay}>
        <View style={s.modalContainer}>
          <ThemedText style={s.modalTitle} weight="900">
            Que pena! não foi dessa vez...
          </ThemedText>

          <ThemedText style={s.modalText} weight="600">
            Tempo:
            <ThemedText weight="900"> {TIME_LIMIT}s</ThemedText>
          </ThemedText>
          <ThemedText style={s.modalText} weight="600">
            Tentativas:
            <ThemedText weight="900"> {attempts}</ThemedText>
          </ThemedText>
          <TouchableOpacity style={s.modalButton} onPress={resetGameState}>
            <ThemedText style={s.modalButtonText} weight="700">
              Jogar novamente
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  modalButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 8,
    width: '70%',
  },
  modalButtonText: {
    fontSize: 12,
    color: colors.secondary,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 12,
    lineHeight: 12,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 16,
    color: colors.primary,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: colors.primary,
    paddingBottom: 12,
    width: '100%',
  },
})
