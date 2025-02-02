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
