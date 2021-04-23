import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';


import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext();
        } else if (hasPrevious) {
            playPrevious();
        } else {
            clearPlayerState();
        }
    }

 
    const {
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        clearPlayerState,
        toggleLoop,
        togglePlay,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail}
                        objectFit="cover"    
                    />
                    <strong> {episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>
                        {convertDurationToTimeString(progress)}
                    </span>
                    <div className={styles.slider}>
                       {episode ? (
                         <Slider
                            max={episode.duration}
                            value={progress}
                            onChange={handleSeek}
                            trackStyle={{backgroundColor: '#04d361'}}
                            railStyle={{backgroundColor: '#9f75ff'}}
                            handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                         />
                       ) : (
                         <div className={styles.emptySlider}/> 
                       )}
                    </div>
                    {/* se não tive ep ele coloca 0 e o interrogação 
                    evita que ele tente carregar sem dados */}
                    <span> {convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio 
                        autoPlay
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                        >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode || !hasPrevious}
                        onClick={playPrevious}
                        >
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={togglePlay}
                        >
                        { isPlaying ? 
                            <img src="/pause.svg" alt="Pausar"/>: 
                            <img src="/play.svg" alt="Tocar"/>
                        }                       
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode || !hasNext}
                        onClick={playNext}
                        > 
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : '' }
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}