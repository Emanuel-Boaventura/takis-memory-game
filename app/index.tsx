import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Card {
  id: number;
  type: string;
  image: any;
  isFlipped: boolean;
  matched: boolean;
}

const GAME_CARDS: Card[] = [
  { id: 1, type: 'blocks', image: require('@/assets/images/blocks.png'), isFlipped: false, matched: false },
  { id: 2, type: 'blocks', image: require('@/assets/images/blocks.png'), isFlipped: false, matched: false },
  { id: 3, type: 'circle', image: require('@/assets/images/circle.png'), isFlipped: false, matched: false },
  { id: 4, type: 'circle', image: require('@/assets/images/circle.png'), isFlipped: false, matched: false },
  { id: 5, type: 'react', image: require('@/assets/images/react.png'), isFlipped: false, matched: false },
  { id: 6, type: 'react', image: require('@/assets/images/react.png'), isFlipped: false, matched: false },
  { id: 7, type: 'css', image: require('@/assets/images/css.png'), isFlipped: false, matched: false },
  { id: 8, type: 'css', image: require('@/assets/images/css.png'), isFlipped: false, matched: false },
  { id: 9, type: 'next', image: require('@/assets/images/next.png'), isFlipped: false, matched: false },
  { id: 10, type: 'next', image: require('@/assets/images/next.png'), isFlipped: false, matched: false },
  { id: 11, type: 'tailwind', image: require('@/assets/images/tailwind.png'), isFlipped: false, matched: false },
  { id: 12, type: 'tailwind', image: require('@/assets/images/tailwind.png'), isFlipped: false, matched: false },
];

const shuffleCards = (cards: Card[]): Card[] => {
  return [...cards].sort(() => Math.random() - 0.5);
};

const TIME_LIMIT = 30; // 30s time limit

export default function Index() {
  const [cards, setCards] = useState<Card[]>(shuffleCards(GAME_CARDS));
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [blockMove, setBlockMove] = useState<boolean>(true);
  const [remainingTime, setRemainingTime] = useState<number>(TIME_LIMIT);

  // Calculate remaining time
  useEffect(() => {
    if (gameStartTime !== null && !gameFinished) {
      const interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
        const newRemainingTime = TIME_LIMIT - elapsedTime;
        setRemainingTime(newRemainingTime);

        // End the game if time runs out
        if (newRemainingTime <= 0) {
          setGameFinished(true);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStartTime, gameFinished]);

  // Show all cards for 1.5s at the start of the game
  useEffect(() => {
    if (gameStartTime !== null) {
      setBlockMove(true);
      setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped: true })));

      const timeout = setTimeout(() => {
        setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped: false })));
        setBlockMove(false);
      }, 1500); // 1.5s delay

      return () => clearTimeout(timeout);
    }
  }, [gameStartTime]);

  const startNewGame = () => {
    setCards(shuffleCards(GAME_CARDS));
    resetGameState();
    setGameStartTime(Date.now());
  };

  const resetGameState = () => {
    setAttempts(0);
    setBlockMove(true);
    setSelectedCards([]);
    setGameFinished(false);
    setGameStartTime(null);
    setRemainingTime(TIME_LIMIT);
    setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped: false, matched: false })));
  };

  const handleCardPress = (card: Card) => {
    if (selectedCards.length < 2 && !card.isFlipped && !gameFinished && remainingTime > 0) {
      const updatedCards = cards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c));
      setCards(updatedCards);
      const newSelected = [...selectedCards, { ...card, isFlipped: true }];
      setSelectedCards(newSelected);

      if (newSelected.length === 2) {
        setAttempts(attempts + 1);
        checkMatch(newSelected);
      }
    }
  };

  const checkMatch = (selected: Card[]) => {
    if (selected[0].type === selected[1].type) {
      const updatedCards = cards.map((c) => (selected.some((s) => s.id === c.id) ? { ...c, matched: true } : c));
      setCards(updatedCards);

      if (updatedCards.every((c) => c.matched)) {
        setGameFinished(true);
      }
    } else {
      setBlockMove(true);
      setTimeout(() => {
        setCards((prevCards) => prevCards.map((c) => (selected.some((s) => s.id === c.id) ? { ...c, isFlipped: false } : c)));
        setBlockMove(false);
      }, 1000); // 1s delay
    }
    setSelectedCards([]);
  };

  return (
    <View style={s.container}>
      <Stack.Screen />
      <Text style={s.title}>Jogo da Memória</Text>
      <View style={s.header}>
        <Text>Jogadas: {attempts}</Text>
        <Text>Tempo restante: {remainingTime}s</Text>
      </View>

      <View style={s.cardsContainer}>
        {cards.map((card) => (
          <TouchableOpacity key={card.id} disabled={blockMove || remainingTime <= 0} onPress={() => handleCardPress(card)} style={s.cardWrapper}>
            {card.isFlipped || card.matched ? (
              <Image source={card.image} style={s.card} />
            ) : (
              <View style={s.hiddenCard} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={s.startButton} onPress={startNewGame}>
        <Text style={s.startText}>INICIAR</Text>
      </TouchableOpacity>

      <Modal visible={gameFinished} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalText}>Parabéns! Você ganhou!</Text>
            <Text style={s.modalText}>Tempo: {TIME_LIMIT - remainingTime}s</Text>
            <Text style={s.modalText}>Jogadas: {attempts}</Text>
            <TouchableOpacity style={s.modalButton} onPress={resetGameState}>
              <Text>Jogar novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 'auto',
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
    width: '100%',
    gap: 16,
    justifyContent: 'center',
  },
  cardWrapper: {
    height: 100,
    width: '30%',
  },
  card: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  hiddenCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#72abff',
    borderRadius: 10,
  },
  startButton: {
    padding: 16,
    backgroundColor: '#ddd',
    borderRadius: 5,
    width: '100%',
    fontWeight: '700',
    marginVertical: 'auto',
  },
  startText: {
    textAlign: 'center',
    fontSize: 16,
  },
  modalButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 10,
  },
});