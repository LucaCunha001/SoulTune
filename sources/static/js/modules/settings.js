export class Settings {
    constructor(app) {
        this.app = app;
    }

    loadSettings() {
        fetch('/api/settings')
            .then(response => response.json())
            .then(settings => {
                this.app.settings = {
                    discordRpc: false,
                    autoStart: false,
                    uiTheme: '0',
                    undertaleFolder: '',
                    deltaruneFolder: '',
                    background: { type: 'none', value: null },
                    ...settings
                };
                this.applyTheme(this.app.settings.uiTheme);
                if (this.app.background && this.app.background.applyBackground) {
                    this.app.background.applyBackground();
                }
                this.displaySettings();
            })
            .catch(error => {
                console.error('Erro ao carregar configurações:', error);
                this.app.settings = {
                    discordRpc: false,
                    autoStart: false,
                    uiTheme: '0',
                    undertaleFolder: '',
                    deltaruneFolder: '',
                    background: { type: 'none', value: null }
                };
                if (this.app.background && this.app.background.applyBackground) {
                    this.app.background.applyBackground();
                }
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
                case 'background-upload-btn':
                    const fileInput = document.getElementById('background-file-input');
                    if (fileInput) {
                        fileInput.click();
                    }
                    break;
            }
        })

        document.addEventListener("change", (e) => {
            switch (e.target.id) {
                case 'discord-rpc':
                    this.app.settings.discordRpc = e.target.checked;
                    window.api?.setDiscordRpc(e.target.checked);
                    this.saveSettings();
                    break;
                case 'auto-start':
                    this.app.settings.autoStart = e.target.checked;
                    window.api?.setAutoStart(e.target.checked);
                    this.saveSettings();
                    break;
                case 'ui-theme':
                    this.app.settings.uiTheme = e.target.value;
                    this.applyTheme(e.target.value);
                    this.saveSettings();
                    break;
                case 'background-option':
                    if (e.target.value === 'none') {
                        this.app.background.setBackground('none', null);
                    } else {
                        this.app.background.setBackground('preset', e.target.value);
                    }
                    this.updateBackgroundPreview();
                    break;
                case 'background-file-input':
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const url = event.target.result;
                            this.app.background.setBackground('custom', url);
                            this.updateBackgroundPreview();
                        };
                        reader.readAsDataURL(file);
                    }
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

        const bgOpt = document.getElementById('background-option');
        const bgPreview = document.getElementById('background-preview');
        if (bgOpt) {
            const bg = this.app.settings.background || { type: 'none', value: null };
            if (bg.type === 'none') {
                bgOpt.value = 'none';
                if (bgPreview) {
                    bgPreview.style.backgroundImage = '';
                    bgPreview.innerText = 'Plano de fundo padrão';
                }
            } else {
                bgOpt.value = bg.value || 'none';
                if (bgPreview) {
                    bgPreview.style.backgroundImage = `url('${bg.value}')`;
                    bgPreview.innerText = '';
                }
            }
        }
    }

    updateBackgroundPreview() {
        const bg = this.app.settings.background || { type: 'none', value: null };
        const preview = document.getElementById('background-preview');

        if (!preview) return;

        if (bg.type === 'none' || !bg.value) {
            preview.style.backgroundImage = '';
            preview.innerText = 'Plano de fundo padrão';
        } else {
            preview.style.backgroundImage = `url('${bg.value}')`;
            preview.innerText = '';
        }
    }


    showSettings() {
        this.app.ui.clearMainContent();
        document.getElementById('settings-view').style.display = 'block';
        document.getElementById("secao-titulo").innerHTML = '';
        this.displaySettings();
    }

    applyTheme(themeValue) {
        const themes = {
            '0': 'moderno',
            '1': 'undertale',
            0: 'moderno',
            1: 'undertale'
        };

        const selectedTheme = themes[themeValue] || 'moderno';

        const stylesheets = document.querySelectorAll('link[data-theme]');

        stylesheets.forEach(link => {
            if (link.dataset.theme === selectedTheme) {
                link.disabled = false;
            } else {
                link.disabled = true;
            }
        });

        if (this.app.background && this.app.background.applyBackground) {
            this.app.background.applyBackground();
        }
    }
}