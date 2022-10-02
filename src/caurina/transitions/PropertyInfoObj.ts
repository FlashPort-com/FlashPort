

	/**
	 * PropertyInfoObj
	 * An object containing the updating info for a given property (its starting value, and its final value)
	 *
	 * @author		Zeh Fernando
	 * @version		1.0.0
	 * @private
	 */

	export class PropertyInfoObj {
		
		public valueStart				:number;	// Starting value of the tweening (null if not started yet)
		public valueComplete			:number;	// Final desired value
		public originalValueComplete	:any;	// Final desired value as declared initially
		public arrayIndex				:number;	// Index (if this is an array item)
		public extra					:any;	// Additional parameters, used by some special properties
		public isSpecialProperty		:boolean;	// Whether or not this is a special property instead of a direct one
		public hasModifier				:boolean;	// Whether or not it has a modifier function
		public modifierFunction		:Function;	// Modifier function, if any
		public modifierParameters		:any[];		// Additional array of modifier parameters

		// ==================================================================================================================================
		// CONSTRUCTOR function -------------------------------------------------------------------------------------------------------------

		/**
		 * Initializes the basic PropertyInfoObj.
		 *
		 * @param	p_valueStart		Number		Starting value of the tweening (null if not started yet)
		 * @param	p_valueComplete		Number		Final (desired) property value
		 */
		constructor(p_valueStart:number, p_valueComplete:number, p_originalValueComplete:any, p_arrayIndex:number, p_extra:any, p_isSpecialProperty:boolean, p_modifierFunction:Function, p_modifierParameters:any[]){
			this.valueStart			=	p_valueStart;
			this.valueComplete		=	p_valueComplete;
			this.originalValueComplete	=	p_originalValueComplete;
			this.arrayIndex				=	p_arrayIndex;
			this.extra					=	p_extra;
			this.isSpecialProperty		=	p_isSpecialProperty;
			this.hasModifier			=	Boolean(p_modifierFunction);
			this.modifierFunction 	=	p_modifierFunction;
			this.modifierParameters	=	p_modifierParameters;
		}


		// ==================================================================================================================================
		// OTHER functions ------------------------------------------------------------------------------------------------------------------

		/**
		 * Clones this property info and returns the new PropertyInfoObj
		 *
		 * @param	omitEvents		Boolean			Whether or not events such as onStart (and its parameters) should be omitted
		 * @return 					TweenListObj	A copy of this object
		 */
		public clone = ():PropertyInfoObj =>
		{
			var nProperty:PropertyInfoObj = new PropertyInfoObj(this.valueStart, this.valueComplete, this.originalValueComplete, this.arrayIndex, this.extra, this.isSpecialProperty, this.modifierFunction, this.modifierParameters);
			return nProperty;
		}

		/**
		 * Returns this object described as a String.
		 *
		 * @return 					String		The description of this object.
		 */
		public toString = ():string =>
		{
			var returnStr:string = "\n[PropertyInfoObj ";
			returnStr += "valueStart:" + String(this.valueStart);
			returnStr += ", ";
			returnStr += "valueComplete:" + String(this.valueComplete);
			returnStr += ", ";
			returnStr += "originalValueComplete:" + String(this.originalValueComplete);
			returnStr += ", ";
			returnStr += "arrayIndex:" + String(this.arrayIndex);
			returnStr += ", ";
			returnStr += "extra:" + String(this.extra);
			returnStr += ", ";
			returnStr += "isSpecialProperty:" + String(this.isSpecialProperty);
			returnStr += ", ";
			returnStr += "hasModifier:" + String(this.hasModifier);
			returnStr += ", ";
			returnStr += "modifierFunction:" + String(this.modifierFunction);
			returnStr += ", ";
			returnStr += "modifierParameters:" + String(this.modifierParameters);
			returnStr += "]\n";
			return returnStr;
		}
		
	}


