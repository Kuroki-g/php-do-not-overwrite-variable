export class GlobalState {
	private static instance: GlobalState;

	public hasConfigurationCapability: boolean = false;

	public hasWorkspaceFolderCapability: boolean = false;

	public hasDiagnosticRelatedInformationCapability: boolean = false;

	private constructor() {}

	public static getInstance(): GlobalState {
		if (!GlobalState.instance) {
			GlobalState.instance = new GlobalState();
		}
		return GlobalState.instance;
	}
}
