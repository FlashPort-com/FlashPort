

	/**
	 * Generic, auxiliary functions
	 *
	 * @author		Zeh Fernando
	 * @version		1.0.0
	 * @private
	 */

	export class AuxFunctions {

		/**
		 * Gets the R (xx0000) bits from a number
		 *
		 * @param		p_num				Number		Color number (ie, 0xffff00)
		 * @return							Number		The R value
		 */
		public static numberToR(p_num:number):number {
			// The initial & is meant to crop numbers bigger than 0xffffff
			return (p_num & 0xff0000) >> 16;
		}

		/**
		 * Gets the G (00xx00) bits from a number
		 *
		 * @param		p_num				Number		Color number (ie, 0xffff00)
		 * @return							Number		The G value
		 */
		public static numberToG(p_num:number):number {
			return (p_num & 0xff00) >> 8;
		}

		/**
		 * Gets the B (0000xx) bits from a number
		 *
		 * @param		p_num				Number		Color number (ie, 0xffff00)
		 * @return							Number		The B value
		 */
		public static numberToB(p_num:number):number {
			return (p_num & 0xff);
		}

		/**
		 * Returns the number of properties an object has
		 *
		 * @param		p_object			Object		Target object with a number of properties
		 * @return							Number		Number of total properties the object has
		 */
		public static getObjectLength(p_object:any):number {
			var totalProperties:number = 0;
			for (let pName in p_object) totalProperties ++;
			return totalProperties;
		}

        /* Takes a variable number of objects as parameters and "adds" their properties, from left to right. If a latter object defines a property as null, it will be removed from the final object
    	* @param		args				Object(s)	A variable number of objects
    	* @return							Object		An object with the sum of all paremeters added as properties.
    	*/
    	public static concatObjects(...args) : Object{
    		var finalObject : Object = {};
    		var currentObject : Object;
    		for (var i : number = 0; i < args.length; i++){
    			currentObject = args[i];
    			for (let prop in currentObject){
    				if (currentObject[prop] == null){
    				    // delete in case is null
    					delete finalObject[prop];
    				}else{
    					finalObject[prop] = currentObject[prop];
    				}
    			}
    		}
    		return finalObject;
    	}
	}

