/* eslint-disable @typescript-eslint/no-require-imports */
import background from '@/assets/images/background.png'
import backCard from '@/assets/images/card.png'
import takisLogo from '@/assets/images/logo-takis.png'
import enjoyLogo from '@/assets/images/logo-enjoy.png'
import { ThemedText } from '@/components/ThemedText'
import { colors } from '@/constants/colors'
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

interface Card {
  id: number;
  type: string;
  image: any;
  isFlipped: boolean;
  matched: boolean;
}

const GAME_CARDS: Card[] = [
  { id: 1, type: 'chilli', image: require('@/assets/images/chilli.png'), isFlipped: false, matched: false },
  { id: 2, type: 'chilli', image: require('@/assets/images/chilli.png'), isFlipped: false, matched: false },
  { id: 3, type: 'explosion', image: require('@/assets/images/explosion.png'), isFlipped: false, matched: false },
  { id: 4, type: 'explosion', image: require('@/assets/images/explosion.png'), isFlipped: false, matched: false },
  { id: 5, type: 'fuego', image: require('@/assets/images/fuego.png'), isFlipped: false, matched: false },
  { id: 6, type: 'fuego', image: require('@/assets/images/fuego.png'), isFlipped: false, matched: false },
  { id: 7, type: 'green-pepper', image: require('@/assets/images/green-pepper.png'), isFlipped: false, matched: false },
  { id: 8, type: 'green-pepper', image: require('@/assets/images/green-pepper.png'), isFlipped: false, matched: false },
  { id: 9, type: 'red-pepper', image: require('@/assets/images/red-pepper.png'), isFlipped: false, matched: false },
  { id: 10, type: 'red-pepper', image: require('@/assets/images/red-pepper.png'), isFlipped: false, matched: false },
  { id: 11, type: 'logo-takis', image: require('@/assets/images/logo-takis.png'), isFlipped: false, matched: false },
  { id: 12, type: 'logo-takis', image: require('@/assets/images/logo-takis.png'), isFlipped: false, matched: false },
]

const shuffleCards = (cards: Card[]): Card[] => {
  return [...cards].sort(() => Math.random() - 0.5)
}

const TIME_LIMIT = 30 // 30s time limit

export default function Index() {
  const [cards, setCards] = useState<Card[]>(shuffleCards(GAME_CARDS))
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [attempts, setAttempts] = useState<number>(0)
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)
  const [gameFinished, setGameFinished] = useState<boolean>(false)
  const [blockMove, setBlockMove] = useState<boolean>(true)
  const [remainingTime, setRemainingTime] = useState<number>(TIME_LIMIT)


  // Calculate remaining time
  useEffect(() => {
    if (gameStartTime !== null && !gameFinished) {
      const interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000)
        const newRemainingTime = TIME_LIMIT - elapsedTime
        setRemainingTime(newRemainingTime)

        // End the game if time runs out
        if (newRemainingTime <= 0) {
          setGameFinished(true)
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [gameStartTime, gameFinished])

  // Show all cards for 1.5s at the start of the game
  useEffect(() => {
    if (gameStartTime !== null) {
      setBlockMove(true)
      setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped: true })))

      const timeout = setTimeout(() => {
        setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped: false })))
        setBlockMove(false)
      }, 1500) // 1.5s delay

      return () => clearTimeout(timeout)
    }
  }, [gameStartTime])

  const startNewGame = () => {
    setCards(shuffleCards(GAME_CARDS))
    resetGameState()
    setGameStartTime(Date.now())
  }

  const resetGameState = () => {
    setAttempts(0)
    setBlockMove(true)
    setSelectedCards([])
    setGameFinished(false)
    setGameStartTime(null)
    setRemainingTime(TIME_LIMIT)
    setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped: false, matched: false })))
  }

  const handleCardPress = (card: Card) => {
    if (selectedCards.length < 2 && !card.isFlipped && !gameFinished && remainingTime > 0) {
      const updatedCards = cards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
      setCards(updatedCards)
      const newSelected = [...selectedCards, { ...card, isFlipped: true }]
      setSelectedCards(newSelected)

      if (newSelected.length === 2) {
        setAttempts(attempts + 1)
        checkMatch(newSelected)
      }
    }
  }

  const checkMatch = (selected: Card[]) => {
    if (selected[0].type === selected[1].type) {
      const updatedCards = cards.map((c) => (selected.some((s) => s.id === c.id) ? { ...c, matched: true } : c))
      setCards(updatedCards)

      if (updatedCards.every((c) => c.matched)) {
        setGameFinished(true)
      }
    } else {
      setBlockMove(true)
      setTimeout(() => {
        setCards((prevCards) => prevCards.map((c) => (selected.some((s) => s.id === c.id) ? { ...c, isFlipped: false } : c)))
        setBlockMove(false)
      }, 1000) // 1s delay
    }
    setSelectedCards([])
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container} edges={['left', 'right']}>
        <ImageBackground source={background} style={s.imageBackground}>
          <Stack.Screen />
          <Image source={takisLogo} style={s.takisLogo} />
          <ThemedText style={s.title} weight='700'>Jogo da Memória</ThemedText>
          <ThemedText style={s.text}>Tentativas:{' '}
            <ThemedText color='white' weight='700'>{attempts}</ThemedText>
          </ThemedText>
          <ThemedText style={s.text} weight='700'>Tempo restante: {remainingTime}s</ThemedText>

          <View style={s.gameContainer}>
            <View style={s.cardsContainer}>
              {cards.map((card) => (
                <TouchableOpacity key={card.id} disabled={blockMove || remainingTime <= 0} onPress={() => handleCardPress(card)} style={s.cardWrapper}>
                  {card.isFlipped || card.matched ? (
                    <Image source={card.image} style={s.card} />
                  ) : (
                    <Image source={backCard} style={s.hiddenCard} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={s.startButton} onPress={startNewGame}>
              <ThemedText style={s.startText} weight='700'>Iniciar partida</ThemedText>
            </TouchableOpacity>

            <ThemedText color='white' style={{ marginTop: 16, fontSize: 10 }}>Idealização</ThemedText>
            <Image source={enjoyLogo} style={s.enjoyLogo} />

            <Modal visible={gameFinished} transparent animationType="slide">
              <View style={s.modalOverlay}>
                <View style={s.modalContainer}>
                  <ThemedText style={s.modalTitle} weight='900' >Parabéns! Você venceu o jogo!</ThemedText>

                  <ThemedText style={s.modalQrText}>
                    <ThemedText weight='700'>Escaneie</ThemedText> o <ThemedText weight='700'>QRCode</ThemedText> abaixo e siga nossas <ThemedText weight='700'>Redes Sociais</ThemedText> para receber a sua <ThemedText weight='700'>Premiação</ThemedText>
                  </ThemedText>
                  <ThemedText style={s.modalText} weight='600'>Tempo:
                    <ThemedText weight='700'> {TIME_LIMIT - remainingTime}s</ThemedText>
                  </ThemedText>
                  <ThemedText style={s.modalText} weight='600'>Tentativas:
                    <ThemedText weight='700'> {attempts}</ThemedText>
                  </ThemedText>
                  <TouchableOpacity style={s.modalButton} onPress={resetGameState}>
                    <ThemedText style={s.modalButtonText} weight='700'>Jogar novamente</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takisLogo: {
    width: 100,
    height: 100,
    marginTop: 24,
    marginBottom: 8,
  },
  enjoyLogo: {
    width: 36,
    height: 36,
    marginVertical: 2,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginTop: 16,
    paddingTop: 28,

  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    marginTop: 'auto',
    color: colors.white,
  },
  text: {
    color: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  cardWrapper: {
    height: 72,
    width: '20%',
  },
  card: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  hiddenCard: {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  startButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 4,
    minWidth: '60%',
    marginTop: 24,
  },
  startText: {
    textAlign: 'center',
    color: colors.primary,
  },
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
    color: colors.secondary,
    textAlign: 'center',
  },
  modalText: {
  },
  modalQrText: {
    fontSize: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 24,
    color: colors.primary,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: colors.primary,
    paddingBottom: 12,
    width: '100%',
  },
})