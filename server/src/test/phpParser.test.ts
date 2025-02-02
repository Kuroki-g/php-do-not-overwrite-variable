import * as phpParser from "php-parser";
import PhpParserSingleton from "../phpParser";
import assert from "node:assert";

describe("PhpParserSingleton", () => {
    it("should return an instance of phpParser.Engine", () => {
        const instance = PhpParserSingleton.getInstance();
        assert(instance instanceof phpParser.Engine);
    });

    it("should return the same instance on multiple calls", () => {
        const instance1 = PhpParserSingleton.getInstance();
        const instance2 = PhpParserSingleton.getInstance();
        assert.strictEqual(instance1, instance2);
    });
});