

/**
 * SpecialPropertySplitter
 * A proxy setter for special properties
 *
 * @author		Zeh Fernando
 * @version		1.0.0
 * @private
 */

export class SpecialPropertySplitter {

	public parameters:any[];
	public splitValues:Function;

	/**
	 * Builds a new group special property object.
	 *
	 * @param		p_splitFunction		Function	Reference to the function used to split a value
	 */
	constructor (p_splitFunction:Function, p_parameters:any[]){
		this.splitValues = p_splitFunction;
		this.parameters = p_parameters;
	}

	/**
	 * Converts the instance to a string that can be used when trace()ing the object
	 */
	public toString = ():string =>
	{
		var value:string = "";
		value += "[SpecialPropertySplitter ";
		value += "splitValues:"+this.splitValues.toString();
		value += ", ";
		value += "parameters:" + this.parameters.toString();
		value += "]";
		return value;
	}
}