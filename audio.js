
/*Audio play feature*/

/*
1-This portion gets the songs from the url that requests the folder from the development server.
2-We then parse the response which is an entire HTML string page to a DOM HTML page.
3-After that we get the HTML collection of a tags and convert it to an Array.
4-Finally we return the Array
*/
songUrl = "http://127.0.0.1:3000/songs/"
cachedSongsArray = null;
async function getSongs() {
    const parser = new DOMParser()
    let response = await fetch(songUrl)
    let htmlString = await response.text()
    let htmlDOM = parser.parseFromString(htmlString, "text/html")
    let cachedSongsArray = Array.from(htmlDOM.getElementsByTagName("a"))
    cachedSongsArray.shift()
    return cachedSongsArray
}

/*
1-This function is for performance
2-This function calls the getSongs function if it is never called and updates the cachedSongsArray*/
async function loadSongs() {
    if (!cachedSongsArray) {
        cachedSongsArray = await getSongs();
    }
}

/*This function is modular approach towards the working of onended callback,play,prev,next buttons and card working*/
function playSong(i) {
    document.getElementById(`card-${n}`).firstElementChild.classList.remove("cardPlay");
    song.pause();
    song.src = cachedSongsArray[i].href;
    song.play();
    document.getElementById(`card-${i}`).firstElementChild.classList.add("cardPlay");
    n = i;
}
/*Key global declaration to manage the states*/
let song = new Audio();

/*
The function below are for syncing the play-bar to the song state
*/
let seekBar = document.querySelector(".seekBar")

song.ontimeupdate = () => {
    seekBar.value = song.currentTime;
};
song.onloadedmetadata = () => {
    seekBar.max = song.duration;
}

seekBar.addEventListener("input", () => {
    song.currentTime = seekBar.value;
});

seekBar.addEventListener("mousedown", () => {
    song.volume = 0
})
seekBar.addEventListener("mouseup", () => {
    song.volume = 1
})


/*The value of n is to manage the working regardless of card touch or button touch*/
let n = 0;

/*
1-This function creates song cards from the cachedSongsArray and then appends in the cardContainer.
2-It is also responsible for adding eventListeners to each card to listen for clicks and play the corespoding music.
*/
(async function addSongs() {
    await loadSongs();
    cachedSongsArray.forEach((item, index) => {
        let card = document.createElement("div");
        card.classList.add("cards")
        card.style.width = "160px"
        card.id = `card-${index}`
        card.innerHTML = `<img src="assets/cardImage.png" alt="">
                        <button><h4>${item.innerHTML}</h4></button>`;
        document.querySelector(".cardContainer").append(card)

        card.addEventListener("click", () => {
            playSong(index)
            hidePlay()  //Function definition below
        })
    });
})();

/*
1-This function adds eventListeners to the buttons
2-Adds the onended function.
*/
let btnPlay = document.querySelector(".btnPlay");
let btnPause = document.querySelector(".btnPause")
let btnNext = document.querySelector(".btnNext");
let btnPrev = document.querySelector(".btnPrev");

//Removes the play button and adds the pause button
function hidePlay() {
    btnPlay.classList.add("display-none")
    btnPause.classList.remove("display-none")
}

//Removes the pause button and adds the play button
function hidePause() {
    btnPause.classList.add("display-none")
    btnPlay.classList.remove("display-none")
}

(async function songFunctionality() {
    await loadSongs();

    song.onended = () => {
        if (n < cachedSongsArray.length - 1) {
            playSong(n + 1)
        }
        else {
            playSong(0)
        }
    }
    btnPlay.addEventListener("click", (e) => {
        if (!song.src) {
            playSong(n)
            hidePlay()
        }
        else {
            song.play()
            hidePlay()
        }
    })

    btnPause.addEventListener("click", () => {
        song.pause()
        hidePause()

    })

    //Plays the next song, working in both the keys and the buttons
    function next(){
        if (n < cachedSongsArray.length - 1) {
            playSong(n + 1)
        }
        else {
            playSong(0)
        }
        hidePlay()
    }
    
    //Plays the previous song, working in both the keys and the buttons
    function prev(){
        if (n != 0) {
            playSong(n - 1)
        }
        else {
            playSong(cachedSongsArray.length - 1)
        }        
        hidePlay()
    }


    btnNext.addEventListener("click", next)


    btnPrev.addEventListener("click", prev)

    window.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key == " ") {

            if (!song.src) {
                playSong(n)
                hidePlay()

            }
            else if (song.paused) {
                song.play()
                hidePlay()
            }
            else {
                song.pause()
                hidePause()
            }

        }

        else if(e.key=="ArrowLeft"){
            prev()
        }
        
        else if(e.key=="ArrowRight"){
            next()
        }
    })
})();
