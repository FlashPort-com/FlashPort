
	
	/**
	 * SpecialProperty
	 * A kind of a getter/setter for special properties
	 *
	 * @author		Zeh Fernando
	 * @version		1.0.0
	 * @private
	 */

	export class SpecialProperty {
	
		public getValue:Function; // (p_obj:any, p_parameters:Array, p_extra:any): Number
		public setValue:Function; // (p_obj:any, p_value:number, p_parameters:Array, p_extra:any): Void
		public parameters:any[];
		public preProcess:Function; // (p_obj:any, p_parameters:Array, p_originalValueComplete:any, p_extra:any): Number

		/**
		 * Builds a new special property object.
		 *
		 * @param		p_getFunction		Function	Reference to the function used to get the special property value
		 * @param		p_setFunction		Function	Reference to the function used to set the special property value
		 */
		constructor (p_getFunction:Function, p_setFunction:Function, p_parameters:any[] = null, p_preProcessFunction:Function = null){
			this.getValue = p_getFunction;
			this.setValue = p_setFunction;
			this.parameters = p_parameters;
			this.preProcess = p_preProcessFunction;
		}
	
		/**
		 * Converts the instance to a string that can be used when trace()ing the object
		 */
		public toString():string {
			var value:string = "";
			value += "[SpecialProperty ";
			value += "getValue:"+String(this.getValue);
			value += ", ";
			value += "setValue:"+String(this.setValue);
			value += ", ";
			value += "parameters:"+String(this.parameters);
			value += ", ";
			value += "preProcess:"+String(this.preProcess);
			value += "]";
			return value;
		}
	}

