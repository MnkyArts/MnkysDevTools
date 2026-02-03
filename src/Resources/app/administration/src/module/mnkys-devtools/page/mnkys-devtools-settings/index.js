/**
 * MnkysDevTools Settings Page Component
 */
import template from './mnkys-devtools-settings.html.twig';

const { Component, Mixin } = Shopware;

Component.register('mnkys-devtools-settings', {
    template,

    inject: ['systemConfigApiService'],

    mixins: [
        Mixin.getByName('notification'),
    ],

    data() {
        return {
            isLoading: false,
            isSaveSuccessful: false,
            config: {
                enabled: false,
                editor: 'vscode',
                execOpen: true,
                maxVariableDepth: 3,
            },
        };
    },

    computed: {
        editorOptions() {
            return [
                { value: 'vscode', label: 'Visual Studio Code' },
                { value: 'phpstorm', label: 'PhpStorm' },
                { value: 'sublime', label: 'Sublime Text' },
                { value: 'idea', label: 'IntelliJ IDEA' },
                { value: 'atom', label: 'Atom' },
            ];
        },

        depthOptions() {
            return [
                { value: 1, label: '1 (Shallow)' },
                { value: 2, label: '2' },
                { value: 3, label: '3 (Recommended)' },
                { value: 4, label: '4' },
                { value: 5, label: '5 (Deep)' },
            ];
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        async createdComponent() {
            await this.loadConfig();
        },

        async loadConfig() {
            this.isLoading = true;

            try {
                const values = await this.systemConfigApiService.getValues('MnkysDevTools.config');
                
                this.config.enabled = values['MnkysDevTools.config.enabled'] ?? false;
                this.config.editor = values['MnkysDevTools.config.editor'] ?? 'vscode';
                this.config.execOpen = values['MnkysDevTools.config.execOpen'] ?? true;
                this.config.maxVariableDepth = values['MnkysDevTools.config.maxVariableDepth'] ?? 3;
            } catch (error) {
                this.createNotificationError({
                    title: this.$tc('mnkys-devtools.settings.errorTitle'),
                    message: error.message,
                });
            } finally {
                this.isLoading = false;
            }
        },

        async saveConfig() {
            this.isLoading = true;
            this.isSaveSuccessful = false;

            try {
                await this.systemConfigApiService.saveValues({
                    'MnkysDevTools.config.enabled': this.config.enabled,
                    'MnkysDevTools.config.editor': this.config.editor,
                    'MnkysDevTools.config.execOpen': this.config.execOpen,
                    'MnkysDevTools.config.maxVariableDepth': this.config.maxVariableDepth,
                });

                this.isSaveSuccessful = true;
                
                this.createNotificationSuccess({
                    title: this.$tc('mnkys-devtools.settings.successTitle'),
                    message: this.$tc('mnkys-devtools.settings.successMessage'),
                });
            } catch (error) {
                this.createNotificationError({
                    title: this.$tc('mnkys-devtools.settings.errorTitle'),
                    message: error.message,
                });
            } finally {
                this.isLoading = false;
            }
        },

        onToggleEnabled(value) {
            this.config.enabled = value;
        },
    },
});
