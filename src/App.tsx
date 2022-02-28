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
  position: number | null,
  word: string | null,
  nextTo: number[]
}

function App() {
  const { data: boardB, isFetching: fetchingB } = useFetch<IBoard>('./test-board-2.json')
  const { data: dictionaryData } = useFetch<IDictionary>('./dictionary.json')
  const [letters, setLetters] = useState<string[] | null>(null)
  const [word, setWord] = useState<string>('')
  const [selectedTile, setSelectedTile] = useState<ITile>({ position: null, word: null, nextTo: [] })
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
      position: index,
      word: letter,
      nextTo: getAvailablesTiles(index)
    })
    setSelectedWords([...selectedWords, index])
  }
  const getAvailablesTiles = (n: number) => {
    let enabledTiles = []
    if ([0, 4, 8, 12].includes(n)) {
      enabledTiles = [n + 1, n - 4, n + 4]
    }
    if ([3, 7, 11, 15].includes(n)) {
      enabledTiles = [n - 1, n - 4, n + 4]
    } else {
      enabledTiles = [n - 1, n + 1, n + 4, n - 4]
    }
    return enabledTiles.filter(num => num >= 0 && num < 16)
  }
  const getDisabledTile = (index: number) => {
    if (selectedWords.length === 0) {
      return false
    }
    const { nextTo } = selectedTile;

    return !nextTo.includes(index) || selectedWords.includes(index)
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
            disabled={getDisabledTile(index)}
            action={() => setWordArr(letter, index)} />
        )
      }
    </Grid>
    <WordCreator word={word} valid={isValidWord} />
  </Layout>)
}

export default App
