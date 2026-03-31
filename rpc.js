const { Client } = require("@xhayper/discord-rpc");
const { ActivityType } = require("discord-api-types/v10");

const CLIENT_ID = "1403051221136179330";

const rpc = new Client({ clientId: CLIENT_ID, transport: "ipc" });

let connected = false;

const repositorio = "https://github.com/LucaCunha001/SoulTune";
const buttons = [
    {
        label: "Ver repositório",
        url: repositorio
    },
    {
        label: "Baixar última versão",
        url: `${repositorio}/releases/latest`
    }
];

rpc.on("ready", () => {
    connected = true;

    rpc.user.setActivity({
        details: "SoulTune",
        buttons: buttons,
        type: 2
    });
});

rpc.on("error", (err) => {
    console.error("RPC erro:", err);
});

rpc.on("disconnected", () => {
    connected = false;
});

function loadRPC(enabled = true) {
    if (!enabled || connected) return;

    rpc.login().catch((err) => {
        console.error("RPC erro:", err);
    });
}

function updateMusic(track, start, end) {
    if (!connected) return;
    let cover = "icone";

    if (track.album?.cover) {
        cover = track.album.cover.split("/");
        cover = cover[cover.length-1].split(".");
        cover = cover[0];
    }
    
    rpc.user.setActivity({
        type: ActivityType.Listening,
        details: track.title,
        startTimestamp: start,
        endTimestamp: end,
        buttons: buttons,
        largeImageKey: cover,
        instance: false
    });
}


module.exports = { loadRPC, updateMusic, getConnected: () => connected, disconnectRPC: () => { if (connected) { rpc.destroy(); connected = false; } } }