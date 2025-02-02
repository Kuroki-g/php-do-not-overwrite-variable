import { defaultSettings, type ExtensionSettings } from "./types";
import { ConnectionSingleton } from "./Connection";

export class GlobalState {
	private static instance: GlobalState;

	public hasConfigurationCapability = false;

	public hasWorkspaceFolderCapability = false;

	public hasDiagnosticRelatedInformationCapability = false;

	public documentSettings: Map<string, Thenable<ExtensionSettings>> = new Map();

	private constructor() {}

	public static getInstance(): GlobalState {
		if (!GlobalState.instance) {
			GlobalState.instance = new GlobalState();
		}
		return GlobalState.instance;
	}

	public static getDocumentSettings(
		resource: string,
	): Thenable<ExtensionSettings> {
		if (!GlobalState.getInstance().hasConfigurationCapability) {
			return Promise.resolve(defaultSettings);
		}

		const currentSetting =
			GlobalState.getInstance().documentSettings.get(resource);
		if (currentSetting) {
			return currentSetting;
		}

		const newSetting =
			ConnectionSingleton.getInstance().workspace.getConfiguration({
				scopeUri: resource,
				section: "phpDoNotOverwriteVariable",
			});
		GlobalState.getInstance().documentSettings.set(resource, newSetting);

		return newSetting;
	}
}
