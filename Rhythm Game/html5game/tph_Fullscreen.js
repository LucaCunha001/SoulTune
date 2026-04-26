function toggleFullscreen() {
    var fullscreen = isFullscreen();
    const tela = document.getElementById("canvas");

    if (fullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    } else {
        if (tela.requestFullscreen) {
            tela.requestFullscreen();
        } else if (tela.webkitRequestFullscreen) {
            tela.webkitRequestFullscreen();
        } else if (tela.msRequestFullscreen) {
            tela.msRequestFullscreen();
        }
    }
}

function isFullscreen() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement);
}

async function saveScore(key, value) {
    console.log(`Salvando chave: ${key} - ${value}`);
    await fetch(`/api/lightners/save-flag`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key, value
        })
    });
}

async function loadAllScores() {
    const res = await fetch(`/api/lightners/scores`);
    const data = await res.json();

    for (const [key, value] of Object.entries(data.scores)) {
        console.log(`Atualizando flag ${key}: ${value}`);
        gml_Script_gmcallback_set_flag(null, null, key, value);
    };

    gml_Script_gmcallback_room_goto_next();
}