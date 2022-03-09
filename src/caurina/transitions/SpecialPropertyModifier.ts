

	/**
	 * SpecialPropertyModifier
	 * A special property which actually acts on other properties
	 *
	 * @author		Zeh Fernando
	 * @version		1.0.0
	 * @private
	 */

	export class SpecialPropertyModifier {

		public modifyValues:Function;
		public getValue:Function;

		/**
		 * Builds a new special property modifier object.
		 * 
		 * @param		p_modifyFunction		Function		Function that returns the modifider parameters.
		 */
		constructor (p_modifyFunction:Function, p_getFunction:Function){
			this.modifyValues = p_modifyFunction;
			this.getValue = p_getFunction;
		}

	/**
	 * Converts the instance to a string that can be used when trace()ing the object
	 */
	public toString():string {
		var value:string = "";
		value += "[SpecialPropertyModifier ";
		value += "modifyValues:" + this.modifyValues.toString();
		value += ", ";
		value += "getValue:" + this.getValue.toString();
		value += "]";
		return value;
	}

	}


