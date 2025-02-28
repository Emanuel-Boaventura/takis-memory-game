const background = require('@/assets/images/background.png')
const backCard = require('@/assets/images/card.png')
const enjoyLogo = require('@/assets/images/logo-enjoy.png')
const takisLogo = require('@/assets/images/logo-takis.png')
import { DefeatModal } from '@/components/DefeatModal'
import { ThemedText } from '@/components/ThemedText'
import { VictoryModal } from '@/components/VictoryModal'
import { colors } from '@/constants/colors'
import { BLOCK_MOVE_TIME, Card, GAME_CARDS, INITIAL_SHOW_CARDS_TIME, TIME_LIMIT } from '@/constants/game'
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const shuffleCards = (cards: Card[]): Card[] => {
  return [...cards].sort(() => Math.random() - 0.5)
}

export default function Index() {
  const [cards, setCards] = useState<Card[]>(shuffleCards(GAME_CARDS))
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [attempts, setAttempts] = useState<number>(0)
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)
  const [gameFinished, setGameFinished] = useState<boolean>(false)
  const [blockMove, setBlockMove] = useState<boolean>(true)
  const [remainingTime, setRemainingTime] = useState<number>(TIME_LIMIT)
  const [playerWon, setPlayerWon] = useState<boolean>(true)

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
          setPlayerWon(false)

          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [gameStartTime, gameFinished])

  // Show all cards at the start of the game
  useEffect(() => {
    if (gameStartTime !== null) {
      setBlockMove(true)
      setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped: true })))

      const timeout = setTimeout(() => {
        setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped: false })))
        setBlockMove(false)
      }, INITIAL_SHOW_CARDS_TIME)

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
    setPlayerWon(true)
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
        setCards((prevCards) =>
          prevCards.map((c) => (selected.some((s) => s.id === c.id) ? { ...c, isFlipped: false } : c)),
        )
        setBlockMove(false)
      }, BLOCK_MOVE_TIME)
    }
    setSelectedCards([])
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container} edges={['left', 'right']}>
        <ImageBackground source={background} style={s.imageBackground}>
          <Stack.Screen />
          <Image source={takisLogo} style={s.takisLogo} />
          <ThemedText style={s.title} weight="700">
            Jogo da Memória
          </ThemedText>
          <ThemedText color="white">
            Tentativas:{' '}
            <ThemedText color="white" weight="700">
              {attempts}
            </ThemedText>
          </ThemedText>
          <ThemedText color="white">
            <ThemedText style={{ fontSize: 16 }} weight="700" color='white'>
              Tempo restante: {remainingTime}s
            </ThemedText>
          </ThemedText>

          <View style={s.gameContainer}>
            <View style={s.cardsContainer}>
              {cards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  disabled={blockMove || remainingTime <= 0 || card.matched}
                  onPress={() => handleCardPress(card)}
                  style={s.cardWrapper}
                >
                  {card.isFlipped || card.matched ? (
                    <Image source={card.image} style={s.card} />
                  ) : (
                    <Image source={backCard} style={s.hiddenCard} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[s.startButton, gameStartTime !== null && s.hidden]}
              disabled={gameStartTime !== null}
              onPress={startNewGame}
            >
              <ThemedText style={s.startText} weight="700">
                Iniciar partida
              </ThemedText>
            </TouchableOpacity>

            <ThemedText color="white" style={{ marginTop: 'auto', fontSize: 10 }}>
              Idealização
            </ThemedText>
            <Image source={enjoyLogo} style={s.enjoyLogo} />

            <VictoryModal
              visible={gameFinished && playerWon}
              attempts={attempts}
              remainingTime={remainingTime}
              resetGameState={resetGameState}
            />
            <DefeatModal visible={gameFinished && !playerWon} attempts={attempts} resetGameState={resetGameState} />
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
    width: 160,
    height: 160,
    marginTop: 24,
    marginBottom: 8,
  },
  enjoyLogo: {
    width: 56,
    height: 56,
    marginVertical: 6,
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
    height: 108,
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
    height: 48,
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
  hidden: {
    opacity: 0,
  },
})
