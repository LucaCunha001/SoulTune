const BackgroundType = {
    NONE: 'none',
    PRESET: 'preset',
    CUSTOM: 'custom'
};

export class Background {
    constructor(app) {
        this.app = app;
    }

    getCurrentBackground() {
        const background = this.app.settings.background;
        if (!background || !background.type || background.type === BackgroundType.NONE) {
            return { type: BackgroundType.NONE, value: null };
        }
        return background;
    }

    setBackground(type, value) {
        this.app.settings.background = { type, value };

        if (this.app.settingsManager && this.app.settingsManager.saveSettings) {
            this.app.settingsManager.saveSettings();
        }

        this.applyBackground();
    }

    applyBackground() {
        const appRoot = document.querySelector('.app');
        if (!appRoot) return;

        const background = this.getCurrentBackground();

        if (background.type === BackgroundType.NONE || !background.value) {
            appRoot.style.backgroundImage = '';
            appRoot.style.backgroundColor = 'var(--bg)';
            appRoot.style.backgroundSize = '';
            appRoot.style.backgroundRepeat = '';
            appRoot.style.backgroundPosition = '';
        } else {
            appRoot.style.backgroundImage = `url('${background.value}')`;
            appRoot.style.backgroundSize = 'cover';
            appRoot.style.backgroundRepeat = 'no-repeat';
            appRoot.style.backgroundPosition = 'center';
            appRoot.style.backgroundColor = 'rgba(0,0,0,0.35)';
            // Overlay next layers done via CSS, so themes still apply.
        }
    }

    getBackground() {
        return this.getCurrentBackground();
    }
}

export { BackgroundType };