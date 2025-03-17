import React, { useState, useEffect } from 'react';

interface Word {
  id: number;
  word: string;
  translation: string;
  pos: string;
  isNew: boolean;
  status: 'mastered' | 'learning' | 'unknown'; // Add status property
}

interface Sentence {
  text: string;
  translation: string;
  words: Word[];
  isReview: boolean;
}

interface ExtraWord {
  word: string;
  status: 'mastered' | 'learning' | 'unknown';
}


export const useLearningModel = () => {
  const extraWords: ExtraWord[] = [
    { word: 'perro', status: 'learning' },
    { word: 'casa', status: 'mastered' },
    { word: 'sol', status: 'unknown' },
    { word: 'luz', status: 'learning' },
    { word: 'agua', status: 'mastered' },
    { word: 'comida', status: 'unknown' },
    { word: 'camino', status: 'learning' },
    { word: 'libro', status: 'mastered' },
    { word: 'mesa', status: 'unknown' },
    { word: 'silla', status: 'learning' },
    // ... continue for all words
    // For this example, I'll assign statuses to the first few and leave the rest as 'unknown'
    ...[
      'ventana', 'puerta', 'cielo', 'nube', 'estrella', 'lago', 'rio', 'montaña',
      'bosque', 'playa', 'mar', 'arena', 'barco', 'pájaro', 'flor', 'árbol', 
      'nieve', 'invierno', 'verano', 'otoño', 'perro', 'casa', 'sol', 'luz', 
      'agua', 'comida', 'camino', 'libro', 'mesa', 'silla', 'ventana', 'puerta',
      'cielo', 'nube', 'estrella', 'lago', 'rio', 'montaña', 'bosque', 'playa',
      'mar', 'arena', 'barco', 'pájaro', 'flor', 'árbol', 'nieve', 'invierno',
      'verano', 'otoño'
    ].map(word => ({ word, status: 'unknown' as const }))
  ];

  const sentences: Sentence[] = [
    {
      text: 'El gato negro corre rápido por el parque',
      translation: 'The black cat runs quickly through the park',
      words: [
        { id: 1, word: 'El', translation: 'The', pos: 'article', isNew: false, status: 'mastered' },
        { id: 2, word: 'gato', translation: 'cat', pos: 'noun', isNew: true, status: 'learning' },
        { id: 3, word: 'negro', translation: 'black', pos: 'adjective', isNew: false, status: 'unknown' },
        // ... add status to other words
      ],
      isReview: false
    },
    // ... other sentences
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [checkedWords, setCheckedWords] = useState<Record<number, boolean>>({});
  const [showFullTranslation, setShowFullTranslation] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const currentSentence = sentences[currentIndex];
  const minSwipeDistance = 50;
  const maxSwipeDistance = 300; // Maximum distance for card to move off-screen

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWordClick = (word: Word) => {
    setSelectedWord(word);
    setCheckedWords((prev) => ({
      ...prev,
      [word.id]: true
    }));
  };

  const closePopup = () => {
    setSelectedWord(null);
    setShowFullTranslation(false);
  };

  const distributeWords = (words: ExtraWord[]): ExtraWord[][] => {
    const rows: ExtraWord[][] = [[], [], []];
    words.forEach((extraWord) => {
      const shortestRow = rows.reduce((min, current) => {
        const minLength = min.reduce((sum, w) => sum + w.word.length, 0);
        const currentLength = current.reduce((sum, w) => sum + w.word.length, 0);
        return currentLength < minLength ? current : min;
      });
      shortestRow.push(extraWord);
    });
    return rows;
  };

  // Add function to update extra word status
  const updateExtraWordStatus = (word: string, newStatus: 'mastered' | 'learning' | 'unknown') => {
    const newExtraWords = extraWords.map(extra => 
      extra.word === word ? { ...extra, status: newStatus } : extra
    );
    // Note: Since extraWords is a constant, you'll need to make it a state if you want to update it
    // Alternatively, you could maintain a separate status map
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAnimating(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    if (touchStart !== null) {
      const offset = touchStart - currentX;
      setSwipeOffset(Math.min(Math.max(offset, -maxSwipeDistance), maxSwipeDistance));
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < sentences.length - 1) {
      setDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setCheckedWords({});
        setSelectedWord(null);
        setShowFullTranslation(false);
        setSwipeOffset(0);
        setIsAnimating(false);
        setDirection(null);
      }, 300); // Match animation duration
    } else if (isRightSwipe && currentIndex > 0) {
      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setCheckedWords({});
        setSelectedWord(null);
        setShowFullTranslation(false);
        setSwipeOffset(0);
        setIsAnimating(false);
        setDirection(null);
      }, 300); // Match animation duration
    } else {
      // Return to center if swipe wasn't far enough
      setIsAnimating(true);
      setSwipeOffset(0);
      setTimeout(() => setIsAnimating(false), 300);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleListen = () => {
    const utterance = new SpeechSynthesisUtterance(currentSentence.text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return {
    currentSentence,
    distributeWords,
    updateExtraWordStatus,
    extraWords,
    swipeOffset,
    maxSwipeDistance,
    isAnimating,
    isMobile,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    checkedWords,
    setShowFullTranslation,
    currentIndex,
    handleListen,
    handleWordClick,
    sentences,
    direction,
    selectedWord,
    showFullTranslation,
    closePopup
  }
};