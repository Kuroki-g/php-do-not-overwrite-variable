import assert from "node:assert";
import { GlobalState } from "../GlobalState";

describe("GlobalState", () => {
    it("should return an instance of phpParser.Engine", () => {
        const instance = GlobalState.getInstance();
        assert(instance instanceof GlobalState);
    });

    it("should return the same instance on multiple calls", () => {
        const instance1 = GlobalState.getInstance();
        const instance2 = GlobalState.getInstance();
        assert.strictEqual(instance1, instance2);
    });

    it("can change global status", () => {
        const instance1 = GlobalState.getInstance();
        instance1.hasConfigurationCapability = true;
        instance1.hasWorkspaceFolderCapability = true;
        instance1.hasDiagnosticRelatedInformationCapability = true;

        const instance2 = GlobalState.getInstance();
        assert.strictEqual(instance2.hasConfigurationCapability, true);
        assert.strictEqual(instance2.hasWorkspaceFolderCapability, true);
        assert.strictEqual(instance2.hasDiagnosticRelatedInformationCapability, true);
    });
});