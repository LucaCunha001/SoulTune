export class Lyrics {
    constructor(app) {
        this.app = app;
    }

    showLyricsPanel() {
        const panel = document.getElementById('right-panel');
        const content = document.getElementById('lyrics-content');
        content.innerHTML = '<h3>Letras</h3>';

        this.app.visibleLyricsIndices = [];

        this.app.lyricsLines.forEach((line, index) => {
            if (line.trim() !== '') {
                const div = document.createElement('div');
                div.className = 'lyrics-line';
                div.textContent = line;
                div.dataset.index = index;
                content.appendChild(div);
                this.app.visibleLyricsIndices.push(index);
            }
        });

        panel.classList.add('active');
        content.classList.add('active');
        document.querySelector(".app").classList.add("right-panel-open");
    }

    hideLyricsPanel() {
        if (!document.querySelector("#album-content.active")) {
            document.querySelector(".app").classList.remove("right-panel-open");
            document.getElementById('right-panel').classList.remove('active');
        }
        
        const content = document.getElementById('lyrics-content');
        content.classList.remove('active');
        content.innerHTML = '';
        this.app.lyricsLines = [];
        this.app.lyricsCumulTimes = [];
        this.app.lyricsIndex = 0;
        this.app.visibleLyricsIndices = [];
    }

    displayLyricsLine(index) {
        const lines = document.querySelectorAll('.lyrics-line');
        lines.forEach((line, i) => {
            if (i === index) {
                line.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }
}