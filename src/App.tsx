import { useState, useEffect } from 'react';
import Tile from './components/Tile';
import WordCreator from './components/WordCreator';
import Restart from './components/Restart';
import Layout from './components/Layout';
import Grid from './components/styled/Grid';
import useFetch from './hooks/useFetch';
interface IBoard {
  board: string[]
}
interface IDictionary {
  words: string[]
}
interface ITile {
  position: number,
  word: string,
  nextTo: number[]
}

function App() {
  const { data: boardB, isFetching: fetchingB } = useFetch<IBoard>('./test-board-2.json')
  const { data: dictionaryData } = useFetch<IDictionary>('./dictionary.json')
  const [letters, setLetters] = useState<string[] | null>(null)
  const [word, setWord] = useState<string>('')
  const [selectedTile, setSelectedTile] = useState<ITile>()
  const [selectedWords, setSelectedWords] = useState<number[]>([])
  const [isValidWord, setIsValidWord] = useState<boolean | null>(null)
  useEffect(() => {

    if (!fetchingB) {
      setLetters(boardB!.board)
    }
    if (word.length > 0) {
      setIsValidWord(wordChecker())
    }
  })
  if (fetchingB) {
    return (<span>Loading board...</span>)
  }
  const wordChecker = (): boolean => {
    if (!dictionaryData?.words) {
      return false
    }
    return dictionaryData.words.includes(word.toLowerCase());
  }
  const restart = () => {
    setWord('')
    setIsValidWord(null)
    setSelectedWords([])
  }
  const setWordArr = (letter: string, index: number) => {
    setWord(word.concat('', letter))
    setSelectedTile({
      position: index + 1,
      word: letter,
      nextTo: getAvailablesTiles(index + 1)
    })
    getAvailablesTiles(index + 1);
    setSelectedWords([...selectedWords, index])
  }
  const getAvailablesTiles = (n: number) => {
    let enabledTiles = []
    if ([1, 5, 9, 13].includes(n)) {
      enabledTiles = [n, n + 1, n - 4, n + 4]
    }
    if ([4, 8, 12, 16].includes(n)) {
      enabledTiles = [n, n - 1, n - 4, n + 4]
    } else {
      enabledTiles = [n, n - 1, n + 1, n + 4, n - 4]
    }
    return enabledTiles.filter(num => num > 0 && num <= 16)

  }
  return (<Layout>
    <Restart cleanAll={restart} isDisabled={word.length === 0} />
    <Grid>
      {
        letters?.map((letter: string, index) =>
          <Tile
            key={index}
            letter={letter}
            valid={isValidWord}
            disabled={selectedWords.includes(index)}
            action={() => setWordArr(letter, index)} />
        )
      }
    </Grid>
    <WordCreator word={word} valid={isValidWord} />
  </Layout>)
}

export default App
