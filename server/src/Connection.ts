import { ProposedFeatures, createConnection } from "vscode-languageserver/node";

export class ConnectionSingleton {
  private static instance: ReturnType<typeof createConnection>;

  private constructor() {}

  public static getInstance(): ReturnType<typeof createConnection> {
    if (!ConnectionSingleton.instance) {
      ConnectionSingleton.instance = createConnection(ProposedFeatures.all);
    }
    return ConnectionSingleton.instance;
  }
}
