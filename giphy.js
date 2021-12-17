const myApiKey = 'quLCnQNkRWpS16ImGVPMQ1DTVhWvXjs5';
const url = 'https://api.giphy.com/v1/gifs/trending';
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
let stepInKonamiCode = 0;
const konamiCodeGif = 'https://media1.giphy.com/media/4hnQDVKVARZ6w/200.gif'

async function getGifs(url = '', apiKey, numberOfGifs) {
    const urlWithParams = `${url}?api_key=${apiKey}&limit=${numberOfGifs}`
    const response = await fetch(urlWithParams);
    return response.json();
};

const addGifToPage = (url, container) => {
    const image = document.createElement('img');
    image.src = url;
    container.appendChild(image);
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementsByClassName('gif-container')[0];
    getGifs(url, myApiKey, 10)
        .then(data => data.data.forEach(gif => {
            addGifToPage(gif.images.fixed_height.url, container);

        }))
    document.addEventListener('keydown', checkKonamiStep);
    function checkKonamiStep(e) {
        console.log(e.code);
        if (e.code === konamiCode[stepInKonamiCode]) {
            if (stepInKonamiCode === 9) {
                while (container.hasChildNodes()) {
                    container.removeChild(container.lastChild);
                }
                addGifToPage(konamiCodeGif, container);
            }
            else {
                stepInKonamiCode++
            }
        }
        else {
            stepInKonamiCode = 0;
        }
    }
}
);

