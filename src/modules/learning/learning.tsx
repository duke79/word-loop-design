import React, { useState, useEffect } from 'react';
import { FaVolumeUp, FaLanguage } from 'react-icons/fa';
import { useLearningModel } from './learning-model';

// In useLearningModel hook
const statusColors = {
  mastered: 'bg-green-200',
  learning: 'bg-yellow-200',
  unknown: 'bg-red-200'
};

const statusTextColors = {
  mastered: 'text-green-800',
  learning: 'text-yellow-800',
  unknown: 'text-red-800'
};

const Learning: React.FC = () => {
  const {
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
  } = useLearningModel();

  const distributedRows = distributeWords(extraWords);

  const getCardStyle = (isCurrent: boolean) => {
    if (isCurrent) {
      return {
        transform: `translateX(${-swipeOffset}px) rotate(${swipeOffset * 0.05}deg)`,
        opacity: 1 - Math.abs(swipeOffset) / maxSwipeDistance,
        transition: isAnimating ? 'all 0.3s ease-out' : 'none',
        zIndex: 2,
        position: 'absolute' as const,
      };
    }
    // Next card style (slightly scaled down and behind)
    return {
      transform: 'scale(0.95)',
      opacity: 0.9,
      zIndex: 1,
      transition: 'all 0.3s ease-out',
      position: 'absolute' as const,
    };
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-blue-50 border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-between items-center p-3 relative">
          {isMobile && (
            <div className="p-3 w-full overflow-x-auto">
              <div className="flex flex-col gap-2 min-w-fit">
                {distributedRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2 whitespace-nowrap">
                    {row.map((extraWord, index) => (
                      <span
                        key={`${rowIndex}-${index}`}
                        className={`inline-flex items-center shrink-0 px-3 h-7 ${statusColors[extraWord.status]} ${statusTextColors[extraWord.status]} rounded-full text-lg cursor-pointer leading-none`}
                        onClick={() => {
                          // Optional: Cycle through statuses on click
                          const nextStatus = 
                            extraWord.status === 'unknown' ? 'learning' :
                            extraWord.status === 'learning' ? 'mastered' : 'unknown';
                          updateExtraWordStatus(extraWord.word, nextStatus);
                        }}
                      >
                        {extraWord.word}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="relative w-full max-w-xl" style={{ height: '200px' }}>
            {/* Current card */}
            <div
              className="bg-white rounded-lg shadow-lg p-3 w-full overflow-auto"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={getCardStyle(true)}
            >
              <div className="text-center text-2xl mb-3 leading-relaxed">
                {currentSentence.words.map((word) => (
                  <span
                    key={word.id}
                    className={`cursor-pointer mx-0.5 inline-block ${word.isNew ? 'text-blue-600 font-medium' : ''
                      } ${checkedWords[word.id]
                        ? 'border-b-2 border-green-400'
                        : 'border-b border-dashed border-gray-300'
                      }`}
                    onClick={() => handleWordClick(word)}
                  >
                    {word.word}
                  </span>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-blue-200 transition-colors"
                  title="Listen"
                  onClick={handleListen}
                >
                  <FaVolumeUp />
                  <span className="hidden sm:inline">Listen</span>
                </button>
                <button
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:bg-blue-200 transition-colors"
                  onClick={() => setShowFullTranslation(true)}
                  title="Translate"
                >
                  <FaLanguage />
                  <span className="hidden sm:inline">Translate</span>
                </button>
              </div>
              <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
                {currentIndex + 1} / {sentences.length}
              </div>
            </div>
            {/* Next card (preview) */}
            {(direction === 'left' || direction === null) && currentIndex < sentences.length - 1 && (
              <div
                className="bg-white rounded-lg shadow-lg p-3 w-full overflow-auto"
                style={getCardStyle(false)}
              >
                <div className="text-center text-2xl mb-3 leading-relaxed">
                  {sentences[currentIndex + 1].words.map((word) => (
                    <span key={word.id} className="mx-0.5 inline-block">
                      {word.word}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
                  {currentIndex + 2} / {sentences.length}
                </div>
              </div>
            )}
            {(direction === 'right' || direction === null) && currentIndex > 0 && (
              <div
                className="bg-white rounded-lg shadow-lg p-3 w-full overflow-auto"
                style={getCardStyle(false)}
              >
                <div className="text-center text-2xl mb-3 leading-relaxed">
                  {sentences[currentIndex - 1].words.map((word) => (
                    <span key={word.id} className="mx-0.5 inline-block">
                      {word.word}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
                  {currentIndex} / {sentences.length}
                </div>
              </div>
            )}
          </div>
        </div>
        {!isMobile && (
          <div className="w-1/4 max-w-xs bg-white p-3 overflow-y-auto hidden md:flex flex-wrap gap-2 fixed right-0">
            {extraWords.map((extraWord, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 h-7 ${statusColors[extraWord.status]} ${statusTextColors[extraWord.status]} rounded-full text-sm cursor-pointer leading-none`}
                onClick={() => {
                  const nextStatus = 
                    extraWord.status === 'unknown' ? 'learning' :
                    extraWord.status === 'learning' ? 'mastered' : 'unknown';
                  updateExtraWordStatus(extraWord.word, nextStatus);
                }}
              >
                {extraWord.word}
              </span>
            ))}
          </div>
        )}
        <div className="bg-white border-t border-gray-200 px-3 py-1 text-center text-gray-600 text-xs">
          Tap on any word to see its translation • Swipe left/right to navigate
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