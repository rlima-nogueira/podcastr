export function convertDurationToTimeString(duration: number) {
    
    const hours = Math.floor(duration / 3600) ;
    const minutes = Math.floor((duration % 3600)/60)
    const seconds = duration % 60;

    const timeString = [hours, minutes, seconds]
    //o padStart sempre retorna dois digitos
        .map ((unit) => String(unit).padStart(2, '0'))
        .join(':');

    return timeString;
}


// numero em segundos para horas 
// primeiro divide por 60 pra converter em minutos e depois 60 de novo pra dividir em horas
// Math.floor: arrendoda para o menor numero que sobra da divisão