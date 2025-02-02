import * as phpParser from 'php-parser';

class PhpParserSingleton {
	private static instance: phpParser.Engine;

	private constructor() {}

	public static getInstance(): phpParser.Engine {
		if (!PhpParserSingleton.instance) {
			PhpParserSingleton.instance = new phpParser.Engine({
				// PHP parser options
			});
		}
		return PhpParserSingleton.instance;
	}
}

export default PhpParserSingleton;


// const parser = PhpParserSingleton.getInstance();
// const phpFile = fs.readFileSync(document.fileName) ;

// // Perform your analysis on the text using the parser
// const ast = parser.parseCode(phpFile.toString(), document.fileName);
// console.log('AST:', ast);
