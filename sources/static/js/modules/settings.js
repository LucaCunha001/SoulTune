export class Settings {
    constructor(app) {
        this.app = app;
    }

    loadSettings() {
        fetch('/api/settings')
            .then(response => response.json())
            .then(settings => {
                this.app.settings = { ...this.app.settings, ...settings };
                this.displaySettings();
            })
            .catch(error => {
                console.error('Erro ao carregar configurações:', error);
                this.displaySettings();
            });
    }

    saveSettings() {
        fetch('/api/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.app.settings)
        })
            .catch(error => {
                console.error('Erro ao salvar configurações:', error);
            });
    }

    setupSettingsListeners() {
        document.addEventListener("click", (e) => {
            switch (e.target.id) {
                case 'undertale-browse':
                    window.api?.selectFolder().then(path => {
                        if (path) {
                            this.app.settings.undertaleFolder = path;
                            document.getElementById('undertale-path').value = path;
                            this.saveSettings();
                        }
                    });
                    break;
                case 'deltarune-browse':
                    window.api?.selectFolder().then(path => {
                        if (path) {
                            this.app.settings.deltaruneFolder = path;
                            document.getElementById('deltarune-path').value = path;
                            this.saveSettings();
                        }
                    });
                    break;
            }
        })

        document.addEventListener("change", (e) => {
            switch (e.target.id) {
                case 'discord-rpc':
                    this.app.settings.discordRpc = e.target.checked;
                    this.saveSettings();
                    break;
                case 'auto-start':
                    this.app.settings.autoStart = e.target.checked;
                    this.saveSettings();
                    break;
                case 'ui-theme':
                    this.app.settings.uiTheme = e.target.value;
                    this.saveSettings();
                    break;
            }
        })
    }

    displaySettings() {
        document.getElementById('discord-rpc').checked = this.app.settings.discordRpc;
        document.getElementById('auto-start').checked = this.app.settings.autoStart;
        document.getElementById('undertale-path').value = this.app.settings.undertaleFolder;
        document.getElementById('deltarune-path').value = this.app.settings.deltaruneFolder;
        document.getElementById('ui-theme').value = this.app.settings.uiTheme;
    }

    showSettings() {
        this.app.ui.clearMainContent();
        document.getElementById('settings-view').style.display = 'block';
        document.getElementById("secao-titulo").innerHTML = '';
        this.displaySettings();
    }
}