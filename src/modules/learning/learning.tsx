import React, { useState, useEffect } from 'react';

const Learning = () => {
  const extraWords = [
    'perro',
    'casa',
    'sol',
    'luz',
    'agua',
    'comida',
    'camino',
    'libro',
    'mesa',
    'silla',
    'ventana',
    'puerta',
    'cielo',
    'nube',
    'estrella',
    'lago',
    'rio',
    'montaña',
    'bosque',
    'playa',
    'mar',
    'arena',
    'barco',
    'pájaro',
    'flor',
    'árbol',
    'nieve',
    'invierno',
    'verano',
    'otoño',
    'perro',
    'casa',
    'sol',
    'luz',
    'agua',
    'comida',
    'camino',
    'libro',
    'mesa',
    'silla',
    'ventana',
    'puerta',
    'cielo',
    'nube',
    'estrella',
    'lago',
    'rio',
    'montaña',
    'bosque',
    'playa',
    'mar',
    'arena',
    'barco',
    'pájaro',
    'flor',
    'árbol',
    'nieve',
    'invierno',
    'verano',
    'otoño',
  ];

  const currentSentence = {
    text: 'El gato negro corre rápido por el parque',
    translation: 'The black cat runs quickly through the park',
    words: [
      { id: 1, word: 'El', translation: 'The', pos: 'article', isNew: false },
      { id: 2, word: 'gato', translation: 'cat', pos: 'noun', isNew: true },
      {
        id: 3,
        word: 'negro',
        translation: 'black',
        pos: 'adjective',
        isNew: false,
      },
      { id: 4, word: 'corre', translation: 'runs', pos: 'verb', isNew: true },
      {
        id: 5,
        word: 'rápido',
        translation: 'quickly',
        pos: 'adverb',
        isNew: false,
      },
      {
        id: 6,
        word: 'por',
        translation: 'through',
        pos: 'preposition',
        isNew: false,
      },
      { id: 7, word: 'el', translation: 'the', pos: 'article', isNew: false },
      { id: 8, word: 'parque', translation: 'park', pos: 'noun', isNew: false },
    ],
    isReview: false,
  };

  const [selectedWord, setSelectedWord] = useState(null);
  const [checkedWords, setCheckedWords] = useState({});
  const [showFullTranslation, setShowFullTranslation] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setCheckedWords({
      ...checkedWords,
      [word.id]: true,
    });
  };

  const closePopup = () => {
    setSelectedWord(null);
    setShowFullTranslation(false);
  };

  // Distribute words into 4 rows based on shortest row
  const distributeWords = (words) => {
    const rows = [[], [], [], [], [], []];

    words.forEach((word) => {
      // Find the row with the least total characters
      const shortestRow = rows.reduce((min, current) => {
        const minLength = min.reduce((sum, w) => sum + w.length, 0);
        const currentLength = current.reduce((sum, w) => sum + w.length, 0);
        return currentLength < minLength ? current : min;
      });

      shortestRow.push(word);
    });

    return rows;
  };

  const distributedRows = distributeWords(extraWords);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-blue-50 border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center p-3 relative">
          {isMobile && (
            <div className="p-3 w-full overflow-x-auto">
              <div className="flex flex-col gap-2 min-w-fit">
                {distributedRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2 whitespace-nowrap">
                    {row.map((word, index) => (
                      <span
                        key={`${rowIndex}-${index}`}
                        className="inline-flex items-center shrink-0 px-3 h-7 bg-blue-200 text-blue-800 rounded-full text-sm cursor-pointer leading-none"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-xl  overflow-auto">
            <div className="text-center text-lg mb-3 leading-relaxed">
              {currentSentence.words.map((word) => (
                <span
                  key={word.id}
                  className={`cursor-pointer mx-0.5 inline-block ${
                    word.isNew ? 'text-blue-600 font-medium' : ''
                  } ${
                    checkedWords[word.id]
                      ? 'border-b-2 border-green-400'
                      : 'border-b border-dashed border-gray-300'
                  }`}
                  onClick={() => handleWordClick(word)}
                >
                  {word.word}
                </span>
              ))}
            </div>
            <div className="flex justify-center mb-3 gap-2">
              <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm">
                <span className="mr-1">●</span> Listen
              </button>
              <button
                className="text-blue-600"
                onClick={() => setShowFullTranslation(true)}
              >
                Translate
              </button>
            </div>
            <div className="flex justify-between items-center">
              <button className="text-gray-500 hover:text-gray-700 p-2 text-xl">
                ←
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md">
                Next
              </button>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="w-1/4 max-w-xs bg-white p-3 overflow-y-auto h-full hidden md:flex flex-wrap gap-2 fixed right-0">
            {extraWords.map((word, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 h-7 bg-blue-200 text-blue-800 rounded-full text-sm cursor-pointer leading-none"
              >
                {word}
              </span>
            ))}
          </div>
        )}
        <div className="bg-white border-t border-gray-200 px-3 py-1 text-center text-gray-600 text-xs">
          Tap on any word to see its translation
        </div>
      </div>
      {(selectedWord || showFullTranslation) && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closePopup}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-xs min-w-[200px] min-h-[150px] flex flex-col justify-center items-center text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closePopup}
            >
              ✕
            </button>
            {selectedWord && (
              <>
                <div className="font-bold text-lg">{selectedWord.word}</div>
                <div className="text-gray-600 text-sm mb-2">
                  {selectedWord.pos}
                </div>
                <div className="text-base">{selectedWord.translation}</div>
              </>
            )}
            {showFullTranslation && <p>{currentSentence.translation}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;
