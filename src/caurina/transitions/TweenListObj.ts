
    import { AuxFunctions } from "./AuxFunctions";
	/**
	 * The tween list object. Stores all of the properties and information that pertain to individual tweens.
	 *
	 * @author		Nate Chatellier, Zeh Fernando
	 * @version		1.0.4
	 * @private
	 */

	export class TweenListObj {
		
		public scope					:any;	// Object affected by this tweening
		public properties				:any;	// List of properties that are tweened (PropertyInfoObj instances)
			// .valueStart					:number		// Initial value of the property
			// .valueComplete				:number		// The value the property should have when completed
		public timeStart				:number;	// Time when this tweening should start
		public timeComplete				:number;	// Time when this tweening should end
		public useFrames				:boolean;	// Whether or not to use frames instead of time
		public transition				:Function;	// Equation to control the transition animation
		public transitionParams			:any;	// Additional parameters for the transition
		public onStart					:Function;	// Function to be executed on the object when the tween starts (once)
		public onUpdate					:Function;	// Function to be executed on the object when the tween updates (several times)
		public onComplete				:Function;	// Function to be executed on the object when the tween completes (once)
		public onOverwrite				:Function;	// Function to be executed on the object when the tween is overwritten
		public onError					:Function;	// Function to be executed if an error is thrown when tweener exectues a callback (onComplete, onUpdate etc)
		public onStartParams			:any[];		// Array of parameters to be passed for the event
		public onUpdateParams			:any[];		// Array of parameters to be passed for the event
		public onCompleteParams			:any[];		// Array of parameters to be passed for the event
		public onOverwriteParams		:any[];		// Array of parameters to be passed for the event
		public onStartScope				:any;	// Scope in which the event function is ran
		public onUpdateScope			:any;	// Scope in which the event function is ran
		public onCompleteScope			:any;	// Scope in which the event function is ran
		public onOverwriteScope			:any;	// Scope in which the event function is ran
		public onErrorScope				:any;	// Scope in which the event function is ran
		public rounded					:boolean;	// Use rounded values when updating
		public isPaused					:boolean;	// Whether or not this tween is paused
		public timePaused				:number;	// Time when this tween was paused
		public isCaller					:boolean;	// Whether or not this tween is a "caller" tween
		public count					:number;	// Number of times this caller should be called
		public timesCalled				:number;	// How many times the caller has already been called ("caller" tweens only)
		public waitFrames				:boolean;	// Whether or not this caller should wait at least one frame for each call execution ("caller" tweens only)
		public skipUpdates				:number;	// How many updates should be skipped (default = 0; 1 = update-skip-update-skip...)
		public updatesSkipped			:number;	// How many updates have already been skipped
		public hasStarted				:boolean;	// Whether or not this tween has already started
		public isComplete				:boolean;	// Whether or not this tween has completed.

		// ==================================================================================================================================
		// CONSTRUCTOR function -------------------------------------------------------------------------------------------------------------

		/**
		 * Initializes the basic TweenListObj.
		 *
		 * @param	p_scope				Object		Object affected by this tweening
		 * @param	p_timeStart			Number		Time when this tweening should start
		 * @param	p_timeComplete		Number		Time when this tweening should end
		 * @param	p_useFrames			Boolean		Whether or not to use frames instead of time
		 * @param	p_transition		Function	Equation to control the transition animation
		 */
		constructor(p_scope:any, p_timeStart:number, p_timeComplete:number, p_useFrames:boolean, p_transition:Function, p_transitionParams:any){
			this.scope				=	p_scope;
			this.timeStart			=	p_timeStart;
			this.timeComplete		=	p_timeComplete;
			this.useFrames			=	p_useFrames;
			this.transition			=	p_transition;
			this.transitionParams	=	p_transitionParams;

			// Other default information
			this.properties		=	new Object();
			this.isPaused		=	false;
			this.timePaused		=	undefined;
			this.isCaller		=	false;
			this.updatesSkipped	=	0;
			this.timesCalled		=	0;
			this.skipUpdates		=	0;
			this.hasStarted		=	false;
		}


		// ==================================================================================================================================
		// OTHER functions ------------------------------------------------------------------------------------------------------------------
	
		/**
		 * Clones this tweening and returns the new TweenListObj
		 *
		 * @param	omitEvents		Boolean			Whether or not events such as onStart (and its parameters) should be omitted
		 * @return					TweenListObj	A copy of this object
		 */
		public clone(omitEvents:boolean):TweenListObj {
			var nTween:TweenListObj = new TweenListObj(this.scope, this.timeStart, this.timeComplete, this.useFrames, this.transition, this.transitionParams);
			nTween.properties = new Array();
			for (var pName in this.properties) {
				nTween.properties[pName] = this.properties[pName].clone();
			}
			nTween.skipUpdates = this.skipUpdates;
			nTween.updatesSkipped = this.updatesSkipped;
			if (!omitEvents) {
				nTween.onStart = this.onStart;
				nTween.onUpdate = this.onUpdate;
				nTween.onComplete = this.onComplete;
				nTween.onOverwrite = this.onOverwrite;
				nTween.onError = this.onError;
				nTween.onStartParams = this.onStartParams;
				nTween.onUpdateParams = this.onUpdateParams;
				nTween.onCompleteParams = this.onCompleteParams;
				nTween.onOverwriteParams = this.onOverwriteParams;
				nTween.onStartScope = this.onStartScope;
				nTween.onUpdateScope = this.onUpdateScope;
				nTween.onCompleteScope = this.onCompleteScope;
				nTween.onOverwriteScope = this.onOverwriteScope;
				nTween.onErrorScope = this.onErrorScope;
			}
			nTween.rounded = this.rounded;
			nTween.isPaused = this.isPaused;
			nTween.timePaused = this.timePaused;
			nTween.isCaller = this.isCaller;
			nTween.count = this.count;
			nTween.timesCalled = this.timesCalled;
			nTween.waitFrames = this.waitFrames;
			nTween.hasStarted = this.hasStarted;

			return nTween;
		}

		/**
		 * Returns this object described as a String.
		 *
		 * @return					String		The description of this object.
		 */
		public toString():string {
			var returnStr:string = "\n[TweenListObj ";
			returnStr += "scope:" + String(this.scope);
			returnStr += ", properties:";
			var isFirst:boolean = true;
			for (var i in this.properties) {
				if (!isFirst) returnStr += ",";
				returnStr += "[name:"+this.properties[i].name;
				returnStr += ",valueStart:"+this.properties[i].valueStart;
				returnStr += ",valueComplete:"+this.properties[i].valueComplete;
				returnStr += "]";
				isFirst = false;
			}
			returnStr += ", timeStart:" + String(this.timeStart);
			returnStr += ", timeComplete:" + String(this.timeComplete);
			returnStr += ", useFrames:" + String(this.useFrames);
			returnStr += ", transition:" + String(this.transition);
			returnStr += ", transitionParams:" + String(this.transitionParams);

			if (this.skipUpdates)		returnStr += ", skipUpdates:"		+ String(this.skipUpdates);
			if (this.updatesSkipped)		returnStr += ", updatesSkipped:"	+ String(this.updatesSkipped);

			if (Boolean(this.onStart))			returnStr += ", onStart:"			+ String(this.onStart);
			if (Boolean(this.onUpdate))			returnStr += ", onUpdate:"			+ String(this.onUpdate);
			if (Boolean(this.onComplete))		returnStr += ", onComplete:"		+ String(this.onComplete);
			if (Boolean(this.onOverwrite))		returnStr += ", onOverwrite:"		+ String(this.onOverwrite);
			if (Boolean(this.onError))			returnStr += ", onError:"			+ String(this.onError);
			
			if (this.onStartParams)		returnStr += ", onStartParams:"		+ String(this.onStartParams);
			if (this.onUpdateParams)		returnStr += ", onUpdateParams:"	+ String(this.onUpdateParams);
			if (this.onCompleteParams)	returnStr += ", onCompleteParams:"	+ String(this.onCompleteParams);
			if (this.onOverwriteParams)	returnStr += ", onOverwriteParams:" + String(this.onOverwriteParams);

			if (this.onStartScope)		returnStr += ", onStartScope:"		+ String(this.onStartScope);
			if (this.onUpdateScope)		returnStr += ", onUpdateScope:"		+ String(this.onUpdateScope);
			if (this.onCompleteScope)	returnStr += ", onCompleteScope:"	+ String(this.onCompleteScope);
			if (this.onOverwriteScope)	returnStr += ", onOverwriteScope:"	+ String(this.onOverwriteScope);
			if (this.onErrorScope)		returnStr += ", onErrorScope:"		+ String(this.onErrorScope);

			if (this.rounded)			returnStr += ", rounded:"			+ String(this.rounded);
			if (this.isPaused)			returnStr += ", isPaused:"			+ String(this.isPaused);
			if (this.timePaused)			returnStr += ", timePaused:"		+ String(this.timePaused);
			if (this.isCaller)			returnStr += ", isCaller:"			+ String(this.isCaller);
			if (this.count)				returnStr += ", count:"				+ String(this.count);
			if (this.timesCalled)		returnStr += ", timesCalled:"		+ String(this.timesCalled);
			if (this.waitFrames)			returnStr += ", waitFrames:"		+ String(this.waitFrames);
			if (this.hasStarted)			returnStr += ", hasStarted:"		+ String(this.hasStarted);
			
			returnStr += "]\n";
			return returnStr;
		}
		
		/**
		 * Checks if p_obj "inherits" properties from other objects, as set by the "base" property. Will create a new object, leaving others intact.
		 * o_bj.base can be an object or an array of objects. Properties are collected from the first to the last element of the "base" filed, with higher
		 * indexes overwritting smaller ones. Does not modify any of the passed objects, but makes a shallow copy of all properties.
		 *
		 * @param		p_obj		Object				Object that should be tweened: a movieclip, textfield, etc.. OR an array of objects
		 * @return					Object				A new object with all properties from the p_obj and p_obj.base.
		 */

		public static makePropertiesChain(p_obj : any) : any{
			// Is this object inheriting properties from another object?
			var baseObject : Object = p_obj.base;
			if(baseObject){
				// object inherits. Are we inheriting from an object or an array
				var chainedObject : Object = {};
				var chain : Array<any>;
				if (baseObject instanceof Array){
					// Inheritance chain is the base array
					chain = [];
					// make a shallow copy
					for (var k : number = 0 ; k< baseObject.length; k++) chain.push(baseObject[k]);
				}else{
					// Only one object to be added to the array
					chain = [baseObject];
				}
				// add the final object to the array, so it's properties are added last
				chain.push(p_obj);
				var currChainObj : Object;
				// Loops through each object adding it's property to the final object
				var len : number = chain.length;
				for(var i : number = 0; i < len ; i ++){
					if(chain[i]["base"]){
						// deal with recursion: watch the order! "parent" base must be concatenated first!
						currChainObj = AuxFunctions.concatObjects( TweenListObj.makePropertiesChain(chain[i]["base"] ), chain[i]);
					}else{
						currChainObj = chain[i] ;
					}
					chainedObject = AuxFunctions.concatObjects(chainedObject, currChainObj );
				}
				if( chainedObject["base"]){
				    delete chainedObject["base"];
				}
				return chainedObject;
			}else{
				// No inheritance, just return the object it self
				return p_obj;
			}
		}
		

	}
	
	

	

