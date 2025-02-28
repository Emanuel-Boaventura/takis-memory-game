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

export default function Index() {
  const [cards, setCards] = useState<Card[]>(shuffleCards(GAME_CARDS));
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [blockMove, setBlockMove] = useState<boolean>(true);

  const formattedTime = new Date(gameTime * 1000).toISOString().slice(14, 19);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!gameFinished && gameStartTime) {
      timer = setInterval(() => {
        setGameTime(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStartTime, gameFinished]);

  const startNewGame = () => {
    setCards(shuffleCards(GAME_CARDS));
    setSelectedCards([]);
    setAttempts(0);
    setGameTime(0);
    setGameStartTime(Date.now());
    setGameFinished(false);
    setBlockMove(false);
  };

  const handleCardPress = (card: Card) => {
    if (selectedCards.length < 2 && !card.isFlipped && !gameFinished) {
      const updatedCards = cards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c);
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
      // If the cards match
      const updatedCards = cards.map(c => (selected.some(s => s.id === c.id) ? { ...c, matched: true } : c));
      setCards(updatedCards);

      // Check if all cards are matched
      if (updatedCards.every(c => c.matched)) {
        setGameFinished(true);
        // Flip all cards to show their images
        setCards(updatedCards.map(c => ({ ...c, isFlipped: true })));
      }
    } else {
      // If the cards don't match, flip them back after a delay
      setBlockMove(true);
      setTimeout(() => {
        setCards(cards.map(c => (selected.some(s => s.id === c.id) ? { ...c, isFlipped: false } : c)));
        setBlockMove(false);
      }, 1000); // 1-second delay
    }
    setSelectedCards([]);
  };

  return (
    <View style={s.container}>
      <Stack.Screen />
      <Text style={s.title}>Jogo da Memória</Text>
      <View style={s.header}>
        <Text>Jogadas: {attempts}</Text>
        <Text>Tempo: {formattedTime}</Text>
      </View>


      <View style={s.cardsContainer}>
        {cards.map(card => (
          <TouchableOpacity key={card.id} disabled={blockMove} onPress={() => handleCardPress(card)} style={s.cardWrapper}>
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
            <Text style={s.modalText}>Tempo: {formattedTime}</Text>
            <Text style={s.modalText}>Jogadas: {attempts}</Text>
            <TouchableOpacity style={s.modalButton} onPress={startNewGame}>
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
    marginTop: 'auto'
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
    justifyContent: 'center'
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
    fontWeight: 700,
    marginVertical: 'auto'
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