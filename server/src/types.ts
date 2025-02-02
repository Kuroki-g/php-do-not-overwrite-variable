interface ExampleSettings {
	maxNumberOfProblems: number;
}

const defaultSettings: ExtensionSettings = { maxNumberOfProblems: 1000 };

export type ExtensionSettings = ExampleSettings;
export { defaultSettings };