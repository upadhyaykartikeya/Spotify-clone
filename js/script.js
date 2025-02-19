console.log("Hey guys");
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) 
{
    if(isNaN(seconds) || seconds < 0)
    {
        return "00:00";
    }

    // Ensure seconds is a number
    seconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad minutes and seconds with leading zeros if necessary
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage
console.log(formatTime(12));  // Output: "00:12"
console.log(formatTime(125)); // Output: "02:05"
console.log(formatTime(3600)); // Output: "60:00"


async function getSongs(folder) 
{
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
       // Show all the songs in the playlist
       let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
       songUL.innerHTML = "";
       for (const song of songs) {
           songUL.innerHTML = songUL.innerHTML + `<li> 
                               <img src="music.svg" alt="">
                               <div class="info">
                                   <div>${song.replaceAll("%20", " ")} </div>
                                   <div>Kartikeya Upadhyay</div>
                               </div>
                               <div class="playnow">
                                   <span>Play now</span>
                                   <img src="play.svg" alt="">
                               </div>
           </li>`;
       }
   
       //Attach an event listner to each song
       Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
           e.addEventListener("click", element=>{
               playMusic(e.querySelector(".info").firstElementChild.innerHTML)
           })
       })

}

const playMusic = (track, pause=false) =>
{
    currentSong.src = `/${currFolder}/` + track;
    if(!pause) 
    {
        currentSong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];

        if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
            let folder = e.href.split("/").slice(-2)[0]
            // Get the meta data of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder = "cs" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <!-- Green background circle -->
                                <circle cx="12" cy="12" r="12" fill="green" />
                                <!-- Scaled down path for padding -->
                                <g transform="scale(0.8) translate(3,3)">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                </g>
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title} </h2>
                        <p>${response.description} </p>
                    </div>`
        }
    }

    //Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            console.log("fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}

async function main() 
{
    //Get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    //Display all the albums on the page
    displayAlbums()

    //Attach an event listner to play, next and previous
    play.addEventListener("click", ()=>
    {
        if(currentSong.paused)
        {
            currentSong.play()
            play.src = "pause.svg"
        }
        else
        {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)* 100 + "%";
    })

    //Add a event listner into seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle ").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration)* percent/100
    })

    //Add an event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>
    {
        document.querySelector(".left").style.left = "0";
    })

    //Add an event listner to close button
    document.querySelector(".close").addEventListener("click", ()=>
    {
        document.querySelector(".left").style.left = "-120%";
    })
    //Add an event listner to previous 
    previous.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("Previous clicked")

        let index = songs.indexOf((currentSong.src.split("/").slice(-1))[0])
        if(index+1 >= 0 )
        {
            playMusic(songs[index-1])
        }
    })
    //Add an event listner to next
    next.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf((currentSong.src.split("/").slice(-1))[0])
        if(index+1 < songs.length )
        {
            playMusic(songs[index+1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting volume to", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value)/100
    })

}

main() 