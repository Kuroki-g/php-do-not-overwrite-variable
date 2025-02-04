import assert from "node:assert";
import { TextDocument } from "vscode-languageserver-textdocument";
import { validatePHPDocument } from "../validatePHPDocument";

describe("validatePHPDocument", () => {
  it("should return an empty array for a valid PHP document", async () => {
    const textDocument = TextDocument.create(
      "file:///test.php",
      "php",
      1,
      "<?php echo 'Hello, world!'; ?>",
    );
    const result = await validatePHPDocument(textDocument);

    assert(Array.isArray(result) && result.length === 0);
  });

  it("should return an empty array for an empty PHP document", async () => {
    const textDocument = TextDocument.create("file:///empty.php", "php", 1, "");

    const result = await validatePHPDocument(textDocument);

    assert(Array.isArray(result) && result.length === 0);
  });

  it("should return an empty array for a PHP document with syntax errors", async () => {
    const textDocument = TextDocument.create(
      "file:///syntax-error.php",
      "php",
      1,
      "<?php echo 'Hello, world!'",
    );

    const result = await validatePHPDocument(textDocument);

    assert(Array.isArray(result) && result.length === 0);
  });
});
