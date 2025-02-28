const qrCode = require('@/assets/images/qr-code.png')
import { colors } from '@/constants/colors'
import { TIME_LIMIT } from '@/constants/game'
import React from 'react'
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from './ThemedText'

interface IVictoryModal {
  visible: boolean
  attempts: number
  remainingTime: number
  resetGameState: () => void
}

export const VictoryModal = ({ visible, attempts, remainingTime, resetGameState }: IVictoryModal) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.modalOverlay}>
        <View style={s.modalContainer}>
          <ThemedText style={s.modalTitle} weight="900">
            Parabéns! Você venceu o jogo!
          </ThemedText>

          <ThemedText style={s.modalQrText}>
            <ThemedText weight="700">Escaneie</ThemedText> o <ThemedText weight="700">QRCode</ThemedText> abaixo e siga
            nossas <ThemedText weight="700">Redes Sociais</ThemedText> para receber a sua{' '}
            <ThemedText weight="700">Premiação</ThemedText>
          </ThemedText>

          <Image source={qrCode} style={s.qrCode} />
          <ThemedText style={s.modalText} weight="600">
            Tempo:
            <ThemedText weight="900"> {TIME_LIMIT - remainingTime}s</ThemedText>
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
  modalQrText: {
    fontSize: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  qrCode: {
    width: 132,
    height: 132,
    marginTop: 10,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 24,
    color: colors.primary,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: colors.primary,
    paddingBottom: 12,
    width: '100%',
  },
})
