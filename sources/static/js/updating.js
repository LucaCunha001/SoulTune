const statusEl = document.getElementById("status");
const progressEl = document.getElementById("progress");

function setStatus(text, progress) {
    statusEl.innerText = text;
    progressEl.style.width = progress + "%";
}

async function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function checkServer() {
    try {
        await fetch("http://127.0.0.1:5000/api/albums");
        return true;
    } catch {
        return false;
    }
}

let updateAvailable = false;

function formatNotes(notes) {
    return notes
        .split("\n")
        .filter(line => line.trim())
        .map(line => `<li>${line.replace(/^-\s*/, "")}</li>`)
        .join("");
}

function createupdateUI(data) {
    const container = document.querySelector(".container");

    const box = document.createElement("div");
    box.style.marginTop = "20px";

    box.innerHTML = `
                <p><strong>Nova versão: ${data.version}</strong></p>
                <ul style="text-align:left; font-size:13px; opacity:0.9;">
                    ${formatNotes(data.notes)}
                </ul>
                <div style="margin-top:10px; display:flex; justify-content:center; gap:10px;">
                    <button id="updateBtn" class="btn btn-primary">Atualizar</button>
                    <button id="skipBtn" class="btn btn-secondary">Agora não</button>
                </div>
            `;

    container.appendChild(box);

    const updateBtn = document.getElementById("updateBtn");
    const skipBtn = document.getElementById("skipBtn");

    const setLoading = (loading) => {
        updateBtn.disabled = loading;
        skipBtn.disabled = loading;
    };

    updateBtn.onclick = () => {
        setStatus("Baixando atualização...", 0);
        setLoading(true);
        window.updater.download();
    };

    skipBtn.onclick = () => {
        continueApp();
    };
}

function continueApp() {
    setStatus("Carregando aplicação...", 90);
    setTimeout(() => {
        window.api.startApp();
    }, 500);
}

async function init() {
    const v = await window.env.getVersion();
    const version = document.createElement("div");
    version.innerText = "v" + (v || "Dev");
    version.style.position = "absolute";
    version.style.bottom = "10px";
    version.style.right = "15px";
    version.style.fontSize = "12px";
    version.style.opacity = "0.5";

    document.body.appendChild(version);


    setStatus("Verificando servidor...", 20);

    let ok = false;
    for (let i = 0; i < 10; i++) {
        if (await checkServer()) {
            ok = true;
            break;
        }
        await wait(300);
    }

    if (!ok) {
        setStatus("Erro ao iniciar servidor", 100);
        return;
    }

    setStatus("Verificando atualizações...", 40);

    window.updater.onAvailable((data) => {
        updateAvailable = true;
        setStatus("Atualização disponível!", 50);
        createupdateUI(data);
    });

    window.updater.onNotAvailable(() => {
        continueApp();
    });

    window.updater.onProgress((p) => {
        setStatus("Baixando atualização...", p);
    });

    window.updater.onDownloaded(() => {
        setStatus("Pronto! Reiniciando...", 100);
        setTimeout(() => {
            window.updater.install();
        }, 1000);
    });

    window.updater.onError(() => {
        setStatus("Erro ao atualizar", 100);
        setLoading(false);

        const retry = document.createElement("button");
        retry.innerText = "Tentar novamente";
        retry.className = "btn btn-secondary";
        retry.style.marginTop = "10px";

        retry.onclick = () => {
            retry.remove();
            setStatus("Tentando novamente...", 40);
            window.updater.check();
        };

        document.querySelector(".container").appendChild(retry);

        setTimeout(() => {
            continueApp();
        }, 3000);
    });

    if (window.env?.isDev) {
        setStatus("Modo desenvolvedor", 30);
        await wait(500);
        continueApp();
    } else {
        window.updater.check();
    }
}

init();