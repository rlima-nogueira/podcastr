import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;
}

type PlayerContextProviderProps = {
  children: ReactNode;
}

//objeto do tipo PlayerContextData
export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

  
    function play(episode: Episode) {
      setEpisodeList([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
    }

    function playList(list: Episode[], indexEpisode: number) {
      setEpisodeList(list);
      setCurrentEpisodeIndex(indexEpisode);
      setIsPlaying(true);

    }

    function clearPlayerState() {
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
    }

  
    function togglePlay() {
      setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
      setIsLooping(!isLooping);
    }

    function toggleShuffle() {
      setIsShuffling(!isShuffling);
    }
  
    function setPlayingState(state: boolean) {
      setIsPlaying(state);
    }

    const hasPrevious = isShuffling || currentEpisodeIndex >= 1;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext() {
      if (isShuffling) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
      } else if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
    }

    function playPrevious () {
      if (isShuffling) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
      } else if (hasPrevious) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
    }

    return (
      <PlayerContext.Provider 
        value={
          {
            episodeList, 
            currentEpisodeIndex, 
            hasNext,
            hasPrevious,
            isPlaying, 
            isLooping,
            isShuffling,
            play, 
            playNext,
            playList,
            playPrevious,
            setPlayingState,
            toggleLoop,
            togglePlay, 
            toggleShuffle,
            clearPlayerState,
          }
        }>
        {children}
      </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}