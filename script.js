
//TODO: FUNCTIONALITES TO ADD - 
//*1.Dynamic albums
//*2.seekbar in playbar section
//*3.View more button in card-containers

const currentSong = new Audio();
const play = document.getElementById('playSong');
let songs = []

async function getSongs() {
    //Get songs from local storage
    const a = await fetch("http://127.0.0.1:5500/songs/")

    const response = await a.text()

    const div = document.createElement('div')
    div.innerHTML = response

    const anchors = div.getElementsByTagName('a')
  

    // Loops through each anchor tag
    for (let i = 0; i < anchors.length; i++) {
        const element = anchors[i];
        // Checks if the anchor tag's href attribute ends with '.mp3' (indicating an MP3 file)
        if (element.href.endsWith('.mp3')) {
            // If it is an MP3 file, adds the URL to the songs array
            songs.push(element.href)
        }
    }
    // Returns the array containing all the MP3 song URLs
    return songs;
}

// Limits songName characters in .songName box
//*AI GENERATED
function limitSongName(songName, limit) {
    if (songName.length > limit) {
        return songName.substring(0, limit) + '...';
    }
    return songName;
}

function decodeURL(url) {
    //*AI GENERATED*
    return decodeURIComponent(url.split("/").pop().split(".")[0])
}

function viewMore() {
    const cardContainers = document.getElementsByClassName('.card-container')

}

viewMore()

async function main() {
    // Calls the getSongs function to get a list of songs
    let songs = await getSongs()

    // Gets a reference to the HTML element with the ID 'songsList' (likely an unordered list)
    const songsList = document.querySelector('#songsList')

    // Loops through each song URL in the songs array
    for (const song of songs) {
        let songName = decodeURL(song)
        const songListItem = ` 
        <li>
            <img src="music.svg" alt="music" class="invert">
            <div class="info">
                <div>${songName}</div>
                <div>- Zeus</div>
            </div>
        </li>
    `;

        songsList.innerHTML += songListItem;
        //Attach eventlistener to each song (in the library)
        Array.from(songsList.getElementsByTagName('li')).forEach(e => {
            e.addEventListener('click', () => {
                playMusic(e.querySelector('.info').firstElementChild.innerHTML);
            });
        });
    }

    // Automatically play the first song when the website loads
    if (songs.length > 0) {
        const firstSong = decodeURL(songs[3]);
        playMusic(firstSong);
    }

    //eventlistener to play, next and previous button
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = 'pause.svg'
        } else {
            currentSong.pause()
            play.src = 'play.svg'
        }
    })

    //Converts time of the song from seconds:milliseconds to minutes:seconds format
    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };//*AI GENERATED*

    // Listen for timeupdate event - when song will update its timings
    currentSong.addEventListener('timeupdate', (e) => {
        let songCurrentTime = document.querySelector('.currentTime')
        let songDuration = document.querySelector('.songTime')
        songCurrentTime.innerHTML = `${formatTime(currentSong.currentTime)}`
        songDuration.innerHTML = formatTime(currentSong.duration)
    })

}

const playMusic = (track) => {
    const baseUrl = "http://127.0.0.1:5500/songs/";
    const music = baseUrl + encodeURIComponent(track).replace(/%20/g, "%20") + ".mp3";

    play.src = 'pause.svg'
    currentSong.src = music
    currentSong.play();

    // Change the contents of songInfo
    document.querySelector('.songName').innerHTML = limitSongName(track, 20)

    // Event listener for hamburger menu
    const hamburger = document.querySelector('#hamburger')
    const close = document.querySelector('#close')
    const leftSec = document.querySelector('.left')
    const heart = document.querySelector('#heart')
    const heartActive = document.querySelector('#heart-active')
    const prevSong = document.querySelector('#prevSong')
    const nextSong = document.querySelector('#nextSong')

    hamburger.addEventListener('click', () => {
        leftSec.style.left = '0'
        document.querySelector('.home').classList.add('glass')
        hamburger.style.display = 'none'
        close.style.display = 'block'
    })

    close.addEventListener('click', () => {
        leftSec.style.left = '-100%'
        document.querySelector('.home').classList.remove('glass')
        hamburger.style.display = 'block'
        close.style.display = 'none'
    })

    // Event listener for heart button
    heart.addEventListener('click', () => {
        heart.style.display = 'none'
        heartActive.style.display = 'block'
        heart.classList.toggle('active');
        heartActive.classList.toggle('active');
    })
    heartActive.addEventListener('click', () => {
        heart.style.display = 'block'
        heartActive.style.display = 'none'
        heart.classList.toggle('active');
    heartActive.classList.toggle('active');
    })

    // Event listener for previous and next buttons
    prevSong.addEventListener('click', () => {
        const index = songs.indexOf(currentSong.src)
        const prevSong = decodeURL(songs[index-1])
        playMusic(prevSong)
    })
    nextSong.addEventListener('click', () => {
        const index = songs.indexOf(currentSong.src)
        const nextSong = decodeURL(songs[index+1])
        if (index+1 <= songs.length) {
            playMusic(nextSong)
        }
    })
}

main();
