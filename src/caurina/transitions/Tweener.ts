import { TweenListObj } from "./TweenListObj";
import { PropertyInfoObj } from "./PropertyInfoObj";
import { AuxFunctions } from "./AuxFunctions";
import { SpecialPropertySplitter } from "./SpecialPropertySplitter";
import { Equations } from "./Equations";
import { SpecialProperty } from "./SpecialProperty";
import { SpecialPropertyModifier } from "./SpecialPropertyModifier";
import { Error } from "../../Error";
/**
 * Tweener
 * Transition controller for movieclips, sounds, textfields and other objects
 *
 * @author		Zeh Fernando, Nate Chatellier, Arthur Debert, Francis Turmel
 * @version		1.33.74
 */

/*
Licensed under the MIT License

Copyright (c) 2006-2008 Zeh Fernando, Nate Chatellier, Arthur Debert and Francis
Turmel

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

http://code.google.com/p/tweener/
http://code.google.com/p/tweener/wiki/License
*/


	
	import { DisplayObject } from "../../flash/display/DisplayObject";
	import { MovieClip } from "../../flash/display/MovieClip";
	import { AEvent } from "../../flash/events/AEvent";
	import { getTimer } from "../../flash/utils/getTimer";

	export class Tweener {
	
		private static _mainTimeline:DisplayObject;
		private static __tweener_controller__:DisplayObject;	// Used to ensure the stage copy is always accessible (garbage collection)
		
		private static _engineExists:boolean = false;		// Whether or not the engine is currently running
		private static _inited:boolean = false;				// Whether or not the class has been initiated
		private static _currentTime:number;					// The current time. This is generic for all tweenings for a "time grid" based update
		private static _currentTimeFrame:number;			// The current frame. Used on frame-based tweenings
	
		private static _tweenList:any[];					// List of active tweens
	
		private static _timeScale:number = 1;				// Time scale (default = 1)
	
		private static _transitionList:any;				// List of "pre-fetched" transition functions
		private static _specialPropertyList:any;			// List of special properties
		private static _specialPropertyModifierList:any;	// List of special property modifiers
		private static _specialPropertySplitterList:any;	// List of special property splitters

		public static autoOverwrite:boolean = true;			// If true, auto overwrite on new tweens is on unless declared as false
	
		/**
		 * There's no constructor.
		 * @private
		 */
		constructor (){
			console.log("Tweener is a static class and should not be instantiated.");
		}

		// ==================================================================================================================================
		// TWEENING CONTROL functions -------------------------------------------------------------------------------------------------------

		/**
		 * Adds a new tweening.
		 *
		 * @param		(first-n param)		Object				Object that should be tweened: a movieclip, textfield, etc.. OR an array of objects
		 * @param		(last param)		Object				Object containing the specified parameters in any order, as well as the properties that should be tweened and their values
		 * @param		.time				Number				Time in seconds or frames for the tweening to take (defaults 2)
		 * @param		.delay				Number				Delay time (defaults 0)
		 * @param		.useFrames			Boolean				Whether to use frames instead of seconds for time control (defaults false)
		 * @param		.transition			String/Function		Type of transition equation... (defaults to "easeoutexpo")
		 * @param		.onStart			Function			* Direct property, See the TweenListObj class
		 * @param		.onUpdate			Function			* Direct property, See the TweenListObj class
		 * @param		.onComplete			Function			* Direct property, See the TweenListObj class
		 * @param		.onOverwrite		Function			* Direct property, See the TweenListObj class
		 * @param		.onStartParams		Array				* Direct property, See the TweenListObj class
		 * @param		.onUpdateParams		Array				* Direct property, See the TweenListObj class
		 * @param		.onCompleteParams	Array				* Direct property, See the TweenListObj class
		 * @param		.onOverwriteParams	Array				* Direct property, See the TweenListObj class
		 * @param		.rounded			Boolean				* Direct property, See the TweenListObj class
		 * @param		.skipUpdates		Number				* Direct property, See the TweenListObj class
		 * @return							Boolean				TRUE if the tween was successfully added, FALSE if otherwise
		 */
		public static addTween (p_scopes:any = null, p_parameters:any = null):boolean {
			if (!Boolean(p_scopes)) return false;

			var i:number, j:number, istr:string;

			var rScopes:any[]; // List of objects to tween
			if (p_scopes instanceof Array) {
				// The first argument is an array
				rScopes = p_scopes.concat();
			} else {
				// The first argument(s) is(are) object(s)
				rScopes = [p_scopes];
			}
		
			// make properties chain ("inheritance")
    		var p_obj:any = TweenListObj.makePropertiesChain(p_parameters);
	
			// Creates the main engine if it isn't active
			if (!Tweener._inited) Tweener.init();
			if (!Tweener._engineExists || !Boolean(Tweener.__tweener_controller__)) Tweener.startEngine(); // Quick fix for Flash not resetting the vars on double ctrl+enter...
			
			// Creates a "safer", more strict tweening object
			var rTime:number = (isNaN(p_obj.time) ? 0 : p_obj.time); // Real time
			var rDelay:number = (isNaN(p_obj.delay) ? 0 : p_obj.delay); // Real delay
	
			// Creates the property list; everything that isn't a hardcoded variable
			var rProperties:any[] = new Array(); // Object containing a list of PropertyInfoObj instances
			var restrictedWords:any = {overwrite:true, time:true, delay:true, useFrames:true, skipUpdates:true, transition:true, transitionParams:true, onStart:true, onUpdate:true, onComplete:true, onOverwrite:true, onError:true, rounded:true, onStartParams:true, onUpdateParams:true, onCompleteParams:true, onOverwriteParams:true, onStartScope:true, onUpdateScope:true, onCompleteScope:true, onOverwriteScope:true, onErrorScope:true};
			var modifiedProperties:any = new Object();
			for (istr in p_obj) {
				if (!restrictedWords[istr]) {
					// It's an additional pair, so adds
					if (Tweener._specialPropertySplitterList[istr]) {
						// Special property splitter
						var splitProperties:any[] = Tweener._specialPropertySplitterList[istr].splitValues(p_obj[istr], Tweener._specialPropertySplitterList[istr].parameters);
						for (i = 0; i < splitProperties.length; i++) {
							if (Tweener._specialPropertySplitterList[splitProperties[i].name]) {
								var splitProperties2:any[] = Tweener._specialPropertySplitterList[splitProperties[i].name].splitValues(splitProperties[i].value, Tweener._specialPropertySplitterList[splitProperties[i].name].parameters);
								for (j = 0; j < splitProperties2.length; j++) {
									rProperties[splitProperties2[j].name] = {valueStart:undefined, valueComplete:splitProperties2[j].value, arrayIndex:splitProperties2[j].arrayIndex, isSpecialProperty:false};
								}
							} else {
								rProperties[splitProperties[i].name] = {valueStart:undefined, valueComplete:splitProperties[i].value, arrayIndex:splitProperties[i].arrayIndex, isSpecialProperty:false};
							}
						}
					} else if (Tweener._specialPropertyModifierList[istr] != undefined) {
						// Special property modifier
						var tempModifiedProperties:any[] = Tweener._specialPropertyModifierList[istr].modifyValues(p_obj[istr]);
						for (i = 0; i < tempModifiedProperties.length; i++) {
							modifiedProperties[tempModifiedProperties[i].name] = {modifierParameters:tempModifiedProperties[i].parameters, modifierFunction:Tweener._specialPropertyModifierList[istr].getValue};
						}
					} else {
						// Regular property or special property, just add the property normally
						rProperties[istr] = {valueStart:undefined, valueComplete:p_obj[istr]};
					}
				}
			}

			// Verifies whether the properties exist or not, for warning messages
			for (istr in rProperties) {
				if (Tweener._specialPropertyList[istr] != undefined) {
					rProperties[istr].isSpecialProperty = true;
				} else {
					if (rScopes[0][istr] == undefined) {
						Tweener.printError("The property '" + istr + "' doesn't seem to be a normal object property of " + String(rScopes[0]) + " or a registered special property.");
					}
				}
			}

			// Adds the modifiers to the list of properties
			for (istr in modifiedProperties) {
				if (rProperties[istr] != undefined) {
					rProperties[istr].modifierParameters = modifiedProperties[istr].modifierParameters;
					rProperties[istr].modifierFunction = modifiedProperties[istr].modifierFunction;
				}
				
			}

			var rTransition:Function; // Real transition
	
			if (typeof p_obj.transition == "string") {
				// String parameter, transition names
				var trans:string = p_obj.transition.toLowerCase();
				rTransition = Tweener._transitionList[trans];
			} else {
				// Proper transition function
				rTransition = p_obj.transition;
			}
			if (!Boolean(rTransition)) rTransition = Tweener._transitionList["easeoutexpo"];
	
			var nProperties:any;
			var nTween:TweenListObj;
			var myT:number;
	
			for (i = 0; i < rScopes.length; i++) {
				// Makes a copy of the properties
				nProperties = new Object();
				for (istr in rProperties) {
					nProperties[istr] = new PropertyInfoObj(rProperties[istr].valueStart, rProperties[istr].valueComplete, rProperties[istr].valueComplete, rProperties[istr].arrayIndex, {}, rProperties[istr].isSpecialProperty, rProperties[istr].modifierFunction, rProperties[istr].modifierParameters);
				}
				
				if (p_obj.useFrames == true) {
					nTween = new TweenListObj(
						/* scope			*this./* scope			*/rScopes[i],
						/* timeStart		*this./* timeStart		*/Tweener._currentTimeFrame + (rDelay / Tweener._timeScale),
						/* timeComplete		*this./* timeComplete		*/Tweener._currentTimeFrame + ((rDelay + rTime) / Tweener._timeScale),
						/* useFrames		*this./* useFrames		*/true,
						/* transition		*this./* transition		*/rTransition,
												p_obj.transitionParams
					);
				} else {
					nTween = new TweenListObj(
						/* scope			*this./* scope			*/rScopes[i],
						/* timeStart		*this./* timeStart		*/Tweener._currentTime + ((rDelay * 1000) / Tweener._timeScale),
						/* timeComplete		*this./* timeComplete		*/Tweener._currentTime + (((rDelay * 1000) + (rTime * 1000)) / Tweener._timeScale),
						/* useFrames		*this./* useFrames		*/false,
						/* transition		*this./* transition		*/rTransition,
												p_obj.transitionParams
					);
				}
				
				nTween.isComplete			=	false;
				nTween.properties			=	nProperties;
				nTween.onStart				=	p_obj.onStart;
				nTween.onUpdate				=	p_obj.onUpdate;
				nTween.onComplete			=	p_obj.onComplete;
				nTween.onOverwrite			=	p_obj.onOverwrite;
				nTween.onError			    =	p_obj.onError;
				nTween.onStartParams		=	p_obj.onStartParams;
				nTween.onUpdateParams		=	p_obj.onUpdateParams;
				nTween.onCompleteParams		=	p_obj.onCompleteParams;
				nTween.onOverwriteParams	=	p_obj.onOverwriteParams;
				nTween.onStartScope			=	p_obj.onStartScope;
				nTween.onUpdateScope		=	p_obj.onUpdateScope;
				nTween.onCompleteScope		=	p_obj.onCompleteScope;
				nTween.onOverwriteScope		=	p_obj.onOverwriteScope;
				nTween.onErrorScope			=	p_obj.onErrorScope;
				nTween.rounded				=	p_obj.rounded;
				nTween.skipUpdates			=	p_obj.skipUpdates;

				// Remove other tweenings that occur at the same time
				if (p_obj.overwrite == undefined ? Tweener.autoOverwrite : p_obj.overwrite) Tweener.removeTweensByTime(nTween.scope, nTween.properties, nTween.timeStart, nTween.timeComplete); // Changed on 1.32.74
	
				// And finally adds it to the list
				Tweener._tweenList.push(nTween);
				
				// Immediate update and removal if it's an immediate tween -- if not deleted, it executes at the end of this frame execution
				if (rTime == 0 && rDelay == 0) {
					myT = Tweener._tweenList.length - 1;
					Tweener.updateTweenByIndex(myT);
					Tweener.removeTweenByIndex(myT);
				}
			}
	
			return true;
		}
	
		// A "caller" is like this: [          |     |  | ||] got it? :)
		// this function is crap - should be fixed later/extend on addTween()
	
		/**
		 * Adds a new caller tweening.
		 *
		 * @param		(first-n param)		Object that should be tweened: a movieclip, textfield, etc.. OR an array of objects
		 * @param		(last param)		Object containing the specified parameters in any order, as well as the properties that should be tweened and their values
		 * @param		.time				Number				Time in seconds or frames for the tweening to take (defaults 2)
		 * @param		.delay				Number				Delay time (defaults 0)
		 * @param		.count				Number				Number of times this caller should be called
		 * @param		.transition			String/Function		Type of transition equation... (defaults to "easeoutexpo")
		 * @param		.onStart			Function			Event called when tween starts
		 * @param		.onUpdate			Function			Event called when tween updates
		 * @param		.onComplete			Function			Event called when tween ends
		 * @param		.waitFrames			Boolean				Whether to wait (or not) one frame for each call
		 * @return							<code>true</code> if the tween was successfully added, <code>false</code> if otherwise.
		 */
		public static addCaller (p_scopes:any = null, p_parameters:any = null):boolean {
			if (!Boolean(p_scopes)) return false;
	
			var i:number;
	
			var rScopes:any[]; // List of objects to tween
			if (p_scopes instanceof Array) {
				// The first argument is an array
				rScopes = p_scopes.concat();
			} else {
				// The first argument(s) is(are) object(s)
				rScopes = [p_scopes];
			}

			var p_obj:any = p_parameters;
	
			// Creates the main engine if it isn't active
			if (!Tweener._inited) Tweener.init();
			if (!Tweener._engineExists || !Boolean(Tweener.__tweener_controller__)) Tweener.startEngine(); // Quick fix for Flash not resetting the vars on double ctrl+enter...
	
			// Creates a "safer", more strict tweening object
			var rTime:number = (isNaN(p_obj.time) ? 0 : p_obj.time); // Real time
			var rDelay:number = (isNaN(p_obj.delay) ? 0 : p_obj.delay); // Real delay
	
			var rTransition:Function; // Real transition
			if (typeof p_obj.transition == "string") {
				// String parameter, transition names
				var trans:string = p_obj.transition.toLowerCase();
				rTransition = Tweener._transitionList[trans];
			} else {
				// Proper transition function
				rTransition = p_obj.transition;
			}
			if (!Boolean(rTransition)) rTransition = Tweener._transitionList["easeoutexpo"];
	
			var nTween:TweenListObj;
			var myT:number;
			for (i = 0; i < rScopes.length; i++) {
				
				if (p_obj.useFrames == true) {
					nTween = new TweenListObj(
						/* scope			*this./* scope			*/rScopes[i],
						/* timeStart		*this./* timeStart		*/Tweener._currentTimeFrame + (rDelay / Tweener._timeScale),
						/* timeComplete		*this./* timeComplete		*/Tweener._currentTimeFrame + ((rDelay + rTime) / Tweener._timeScale),
						/* useFrames		*this./* useFrames		*/true,
						/* transition		*this./* transition		*/rTransition,
												p_obj.transitionParams
					);
				} else {
					nTween = new TweenListObj(
						/* scope			*this./* scope			*/rScopes[i],
						/* timeStart		*this./* timeStart		*/Tweener._currentTime + ((rDelay * 1000) / Tweener._timeScale),
						/* timeComplete		*this./* timeComplete		*/Tweener._currentTime + (((rDelay * 1000) + (rTime * 1000)) / Tweener._timeScale),
						/* useFrames		*this./* useFrames		*/false,
						/* transition		*this./* transition		*/rTransition,
												p_obj.transitionParams
					);
				}

				nTween.properties			=	null;
				nTween.onStart				=	p_obj.onStart;
				nTween.onUpdate				=	p_obj.onUpdate;
				nTween.onComplete			=	p_obj.onComplete;
				nTween.onOverwrite			=	p_obj.onOverwrite;
				nTween.onStartParams		=	p_obj.onStartParams;
				nTween.onUpdateParams		=	p_obj.onUpdateParams;
				nTween.onCompleteParams		=	p_obj.onCompleteParams;
				nTween.onOverwriteParams	=	p_obj.onOverwriteParams;
				nTween.onStartScope			=	p_obj.onStartScope;
				nTween.onUpdateScope		=	p_obj.onUpdateScope;
				nTween.onCompleteScope		=	p_obj.onCompleteScope;
				nTween.onOverwriteScope		=	p_obj.onOverwriteScope;
				nTween.onErrorScope			=	p_obj.onErrorScope;
				nTween.isCaller				=	true;
				nTween.count				=	p_obj.count;
				nTween.waitFrames			=	p_obj.waitFrames;

				// And finally adds it to the list
				Tweener._tweenList.push(nTween);
	
				// Immediate update and removal if it's an immediate tween -- if not deleted, it executes at the end of this frame execution
				if (rTime == 0 && rDelay == 0) {
					myT = Tweener._tweenList.length-1;
					Tweener.updateTweenByIndex(myT);
					Tweener.removeTweenByIndex(myT);
				}
			}
	
			return true;
		}
	
		/**
		 * Remove an specified tweening of a specified object the tweening list, if it conflicts with the given time.
		 *
		 * @param		p_scope				Object						List of objects affected
		 * @param		p_properties		Object 						List of properties affected (PropertyInfoObj instances)
		 * @param		p_timeStart			Number						Time when the new tween starts
		 * @param		p_timeComplete		Number						Time when the new tween ends
		 * @return							Boolean						Whether or not it actually deleted something
		 */
		public static removeTweensByTime (p_scope:any, p_properties:any, p_timeStart:number, p_timeComplete:number):boolean {
			var removed:boolean = false;
			var removedLocally:boolean;
	
			var i:number;
			var tl:number = Tweener._tweenList.length;
			var pName:string;

			for (i = 0; i < tl; i++) {
				if (Boolean(Tweener._tweenList[i]) && p_scope == Tweener._tweenList[i].scope) {
					// Same object...
					if (p_timeComplete > Tweener._tweenList[i].timeStart && p_timeStart < Tweener._tweenList[i].timeComplete) {
						// New time should override the old one...
						removedLocally = false;
						for (pName in Tweener._tweenList[i].properties) {
							if (Boolean(p_properties[pName])) {
								// Same object, same property
								// Finally, remove this old tweening and use the new one
								if (Boolean(Tweener._tweenList[i].onOverwrite)) {
									var eventScope:any = Boolean(Tweener._tweenList[i].onOverwriteScope) ? Tweener._tweenList[i].onOverwriteScope : Tweener._tweenList[i].scope;
									try {
										Tweener._tweenList[i].onOverwrite.apply(eventScope, Tweener._tweenList[i].onOverwriteParams);
									} catch(e) {
										Tweener.handleError(Tweener._tweenList[i], e, "onOverwrite");
									}
								}
								Tweener._tweenList[i].properties[pName] = undefined;
								delete Tweener._tweenList[i].properties[pName];
								removedLocally = true;
								removed = true;
							}
						}
						if (removedLocally) {
							// Verify if this can be deleted
							if (AuxFunctions.getObjectLength(Tweener._tweenList[i].properties) == 0) Tweener.removeTweenByIndex(i);
						}
					}
				}
			}

			return removed;
		}
	
		/*
		public static function removeTweens (p_scope:any, ...args):Boolean {
			// Create the property list
			var properties:Array = new Array();
			var i:uint;
			for (i = 0; i < args.length; i++) {
				if (typeof(args[i]) == "string" && properties.indexOf(args[i]) == -1) properties.push(args[i]);
			}
			// Call the affect function on the specified properties
			return affectTweens(removeTweenByIndex, p_scope, properties);
		}
		*/

		/**
		 * Remove tweenings from a given object from the tweening list.
		 *
		 * @param		p_tween				Object		Object that must have its tweens removed
		 * @param		(2nd-last params)	Object		Property(ies) that must be removed
		 * @return							Boolean		Whether or not it successfully removed this tweening
		 */
		public static removeTweens (p_scope:any, ...args):boolean {
			// Create the property list
			var properties:any[] = new Array();
			var i:number;
			for (i = 0; i < args.length; i++) {
				if (typeof(args[i]) == "string" && properties.indexOf(args[i]) == -1){
					if (Tweener._specialPropertySplitterList[args[i]]){
						//special property, get splitter array first
						var sps:SpecialPropertySplitter = Tweener._specialPropertySplitterList[args[i]];
						var specialProps:any[] = sps.splitValues(p_scope, null);
						for (var j:number = 0; j<specialProps.length; j++){
						//trace(specialProps[j].name);
							properties.push(specialProps[j].name);
						}
					} else {
						properties.push(args[i]);
					}
				}
			}

			// Call the affect function on the specified properties
			return Tweener.affectTweens(Tweener.removeTweenByIndex, p_scope, properties);
		}

		/**
		 * Remove all tweenings from the engine.
		 *
		 * @return					<code>true</code> if it successfully removed any tweening, <code>false</code> if otherwise.
		 */
		public static removeAllTweens ():boolean {
			if (!Boolean(Tweener._tweenList)) return false;
			var removed:boolean = false;
			var i:number;
			for (i = 0; i<Tweener._tweenList.length; i++) {
				Tweener.removeTweenByIndex(i);
				removed = true;
			}
			return removed;
		}

		/**
		 * Pause tweenings for a given object.
		 *
		 * @param		p_scope				Object that must have its tweens paused
		 * @param		(2nd-last params)	Property(ies) that must be paused
		 * @return					<code>true</code> if it successfully paused any tweening, <code>false</code> if otherwise.
		 */
		public static pauseTweens (p_scope:any, ...args):boolean {
			// Create the property list
			var properties:any[] = new Array();
			var i:number;
			for (i = 0; i < args.length; i++) {
				if (typeof(args[i]) == "string" && properties.indexOf(args[i]) == -1) properties.push(args[i]);
			}
			// Call the affect function on the specified properties
			return Tweener.affectTweens(Tweener.pauseTweenByIndex, p_scope, properties);
		}

		/**
		 * Pause all tweenings on the engine.
		 *
		 * @return					<code>true</code> if it successfully paused any tweening, <code>false</code> if otherwise.
		 * @see #resumeAllTweens()
		 */
		public static pauseAllTweens ():boolean {
			if (!Boolean(Tweener._tweenList)) return false;
			var paused:boolean = false;
			var i:number;
			for (i = 0; i < Tweener._tweenList.length; i++) {
				Tweener.pauseTweenByIndex(i);
				paused = true;
			}
			return paused;
		}

		/**
		 * Resume tweenings from a given object.
		 *
		 * @param		p_scope				Object		Object that must have its tweens resumed
		 * @param		(2nd-last params)	Object		Property(ies) that must be resumed
		 * @return							Boolean		Whether or not it successfully resumed something
		 */
		public static resumeTweens (p_scope:any, ...args):boolean {
			// Create the property list
			var properties:any[] = new Array();
			var i:number;
			for (i = 0; i < args.length; i++) {
				if (typeof(args[i]) == "string" && properties.indexOf(args[i]) == -1) properties.push(args[i]);
			}
			// Call the affect function on the specified properties
			return Tweener.affectTweens(Tweener.resumeTweenByIndex, p_scope, properties);
		}

		/**
		 * Resume all tweenings on the engine.
		 *
		 * @return <code>true</code> if it successfully resumed any tweening, <code>false</code> if otherwise.
		 * @see #pauseAllTweens()
		 */
		public static resumeAllTweens ():boolean {
			if (!Boolean(Tweener._tweenList)) return false;
			var resumed:boolean = false;
			var i:number;
			for (i = 0; i < Tweener._tweenList.length; i++) {
				Tweener.resumeTweenByIndex(i);
				resumed = true;
			}
			return resumed;
		}

		/**
		 * Do some generic action on specific tweenings (pause, resume, remove, more?)
		 *
		 * @param		p_function			Function	Function to run on the tweenings that match
		 * @param		p_scope				Object		Object that must have its tweens affected by the function
		 * @param		p_properties		Array		Array of strings that must be affected
		 * @return							Boolean		Whether or not it successfully affected something
		 */
		private static affectTweens (p_affectFunction:Function, p_scope:any, p_properties:any[]):boolean {
			var affected:boolean = false;
			var i:number;

			if (!Boolean(Tweener._tweenList)) return false;

			for (i = 0; i < Tweener._tweenList.length; i++) {
				if (Tweener._tweenList[i] && Tweener._tweenList[i].scope == p_scope) {
					if (p_properties.length == 0) {
						// Can affect everything
						p_affectFunction(i);
						affected = true;
					} else {
						// Must check whether this tween must have specific properties affected
						var affectedProperties:any[] = new Array();
						var j:number;
						for (j = 0; j < p_properties.length; j++) {
							if (Boolean(Tweener._tweenList[i].properties[p_properties[j]])) {
								affectedProperties.push(p_properties[j]);
							}
						}
						if (affectedProperties.length > 0) {
							// This tween has some properties that need to be affected
							var objectProperties:number = AuxFunctions.getObjectLength(Tweener._tweenList[i].properties);
							if (objectProperties == affectedProperties.length) {
								// The list of properties is the same as all properties, so affect it all
								p_affectFunction(i);
								affected = true;
							} else {
								// The properties are mixed, so split the tween and affect only certain specific properties
								var slicedTweenIndex:number = Tweener.splitTweens(i, affectedProperties);
								p_affectFunction(slicedTweenIndex);
								affected = true;
							}
						}
					}
				}
			}
			return affected;
		}

		/**
		 * Splits a tweening in two
		 *
		 * @param		p_tween				Number		Object that must have its tweens split
		 * @param		p_properties		Array		Array of strings containing the list of properties that must be separated
		 * @return							Number		The index number of the new tween
		 */
		public static splitTweens (p_tween:number, p_properties:any[]):number {
			// First, duplicates
			var originalTween:TweenListObj = Tweener._tweenList[p_tween];
			var newTween:TweenListObj = originalTween.clone(false);

			// Now, removes tweenings where needed
			var i:number;
			var pName:string;

			// Removes the specified properties from the old one
			for (i = 0; i < p_properties.length; i++) {
				pName = p_properties[i];
				if (Boolean(originalTween.properties[pName])) {
					originalTween.properties[pName] = undefined;
					delete originalTween.properties[pName];
				}
			}

			// Removes the unspecified properties from the new one
			var found:boolean;
			for (pName in newTween.properties) {
				found = false;
				for (i = 0; i < p_properties.length; i++) {
					if (p_properties[i] == pName) {
						found = true;
						break;
					}
				}
				if (!found) {
					newTween.properties[pName] = undefined;
					delete newTween.properties[pName];
				}
			}

			// If there are empty property lists, a cleanup is done on the next updateTweens() cycle
			Tweener._tweenList.push(newTween);
			return (Tweener._tweenList.length - 1);
			
		}

		// ==================================================================================================================================
		// ENGINE functions -----------------------------------------------------------------------------------------------------------------
	
		/**
		 * Updates all existing tweenings.
		 *
		 * @return							Boolean		FALSE if no update was made because there's no tweening (even delayed ones)
		 */
		private static updateTweens ():boolean {
			if (Tweener._tweenList.length == 0) return false;
			var i:number;
			for (i = 0; i < Tweener._tweenList.length; i++) {
				// Looping throught each Tweening and updating the values accordingly
				if (Tweener._tweenList[i] == undefined || !Tweener._tweenList[i].isPaused) {
					if (!Tweener.updateTweenByIndex(i)) Tweener.removeTweenByIndex(i);
					if (Tweener._tweenList[i] == null) {
						Tweener.removeTweenByIndex(i, true);
						i--;
					}
				}
			}
	
			return true;
		}
	
		/**
		 * Remove a specific tweening from the tweening list.
		 *
		 * @param		p_tween				Number		Index of the tween to be removed on the tweenings list
		 * @return							Boolean		Whether or not it successfully removed this tweening
		 */
		public static removeTweenByIndex (i:number, p_finalRemoval:boolean = false):boolean {
			Tweener._tweenList[i] = null;
			if (p_finalRemoval) Tweener._tweenList.splice(i, 1);
			return true;
		}
	
		/**
		 * Pauses a specific tween.
		 *
		 * @param		p_tween				Number		Index of the tween to be paused
		 * @return							Boolean		Whether or not it successfully paused this tweening
		 */
		public static pauseTweenByIndex (p_tween:number):boolean {
			var tTweening:TweenListObj = Tweener._tweenList[p_tween];	// Shortcut to this tweening
			if (tTweening == null || tTweening.isPaused) return false;
			tTweening.timePaused = Tweener.getCurrentTweeningTime(tTweening);
			tTweening.isPaused = true;
	
			return true;
		}
	
		/**
		 * Resumes a specific tween.
		 *
		 * @param		p_tween				Number		Index of the tween to be resumed
		 * @return							Boolean		Whether or not it successfully resumed this tweening
		 */
		public static resumeTweenByIndex (p_tween:number):boolean {
			var tTweening:TweenListObj = Tweener._tweenList[p_tween];	// Shortcut to this tweening
			if (tTweening == null || !tTweening.isPaused) return false;
			var cTime:number = Tweener.getCurrentTweeningTime(tTweening);
			tTweening.timeStart += cTime - tTweening.timePaused;
			tTweening.timeComplete += cTime - tTweening.timePaused;
			tTweening.timePaused = undefined;
			tTweening.isPaused = false;
	
			return true;
		}
	
		/**
		 * Updates a specific tween.
		 *
		 * @param		i					Number		Index (from the tween list) of the tween that should be updated
		 * @return							Boolean		FALSE if it's already finished and should be deleted, TRUE if otherwise
		 */
		private static updateTweenByIndex (i:number):boolean {

			var tTweening:TweenListObj = Tweener._tweenList[i];	// Shortcut to this tweening

			if (tTweening == null || !Boolean(tTweening.scope)) return false;

			var isOver:boolean = false;		// Whether or not it's over the update time
			var mustUpdate:boolean;			// Whether or not it should be updated (skipped if false)
	
			var nv:number;					// New value for each property
	
			var t:number;					// current time (frames, seconds)
			var b:number;					// beginning value
			var c:number;					// change in value
			var d:number; 					// duration (frames, seconds)
	
			var pName:string;				// Property name, used in loops
			var eventScope:any;			// Event scope, used to call functions
	
			// Shortcut stuff for speed
			var tScope:any;				// Current scope
			var cTime:number = Tweener.getCurrentTweeningTime(tTweening);
			var tProperty:any;			// Property being checked
			
			if (cTime >= tTweening.timeStart) {
				// Can already start
				tScope = tTweening.scope;
	
				if (tTweening.isCaller) {
					// It's a 'caller' tween
					if (!tTweening.hasStarted) {
						if (Boolean(tTweening.onStart)) {
							eventScope = Boolean(tTweening.onStartScope) ? tTweening.onStartScope : tScope;
							try {
								tTweening.onStart.apply(eventScope, tTweening.onStartParams);
							} catch(e2) {
								Tweener.handleError(tTweening, e2, "onStart");
							}
						}
						tTweening.hasStarted = true;
					}
					do {
						t = ((tTweening.timeComplete - tTweening.timeStart)/tTweening.count) * (tTweening.timesCalled+1);
						b = tTweening.timeStart;
						c = tTweening.timeComplete - tTweening.timeStart;
						d = tTweening.timeComplete - tTweening.timeStart;
						nv = tTweening.transition(t, b, c, d);
	
						if (cTime >= nv) {
							if (Boolean(tTweening.onUpdate)) {
								eventScope = Boolean(tTweening.onUpdateScope) ? tTweening.onUpdateScope : tScope;
								try {
									tTweening.onUpdate.apply(eventScope, tTweening.onUpdateParams);
								} catch(e1) {
									Tweener.handleError(tTweening, e1, "onUpdate");
								}
							}

							tTweening.timesCalled++;
							if (tTweening.timesCalled >= tTweening.count) {
								isOver = true;
								break;
							}
							if (tTweening.waitFrames) break;
						}
	
					} while (cTime >= nv);
				} else {
					// It's a normal transition tween

					mustUpdate = tTweening.skipUpdates < 1 || !tTweening.skipUpdates || tTweening.updatesSkipped >= tTweening.skipUpdates;

					if (cTime >= tTweening.timeComplete) {
						isOver = true;
						mustUpdate = true;
					}

					if (!tTweening.hasStarted) {
						// First update, read all default values (for proper filter tweening)
						if (Boolean(tTweening.onStart)) {
							eventScope = Boolean(tTweening.onStartScope) ? tTweening.onStartScope : tScope;
							try {
								tTweening.onStart.apply(eventScope, tTweening.onStartParams);
							} catch(e2) {
								Tweener.handleError(tTweening, e2, "onStart");
							}
						}
						var pv:number;
						for (pName in tTweening.properties) {
							if (tTweening.properties[pName].isSpecialProperty) {
								// It's a special property, tunnel via the special property function
								if (Boolean(Tweener._specialPropertyList[pName].preProcess)) {
									tTweening.properties[pName].valueComplete = Tweener._specialPropertyList[pName].preProcess(tScope, Tweener._specialPropertyList[pName].parameters, tTweening.properties[pName].originalValueComplete, tTweening.properties[pName].extra);
								}
								pv = Tweener._specialPropertyList[pName].getValue(tScope, Tweener._specialPropertyList[pName].parameters, tTweening.properties[pName].extra);
							} else {
								// Directly read property
								pv = tScope[pName];
							}
							tTweening.properties[pName].valueStart = isNaN(pv) ? tTweening.properties[pName].valueComplete : pv;
						}
						mustUpdate = true;
						tTweening.hasStarted = true;
					}

					if (mustUpdate) {
						for (pName in tTweening.properties) {
							tProperty = tTweening.properties[pName];

							if (isOver) {
								// Tweening time has finished, just set it to the final value
								nv = tProperty.valueComplete;
							} else {
								if (tProperty.hasModifier) {
									// Modified
									t = cTime - tTweening.timeStart;
									d = tTweening.timeComplete - tTweening.timeStart;
									nv = tTweening.transition(t, 0, 1, d, tTweening.transitionParams);
									nv = tProperty.modifierFunction(tProperty.valueStart, tProperty.valueComplete, nv, tProperty.modifierParameters);
								} else {
									// Normal update
									t = cTime - tTweening.timeStart;
									b = tProperty.valueStart;
									c = tProperty.valueComplete - tProperty.valueStart;
									d = tTweening.timeComplete - tTweening.timeStart;
									nv = tTweening.transition(t, b, c, d, tTweening.transitionParams);
								}
							}

							if (tTweening.rounded) nv = Math.round(nv);
							if (tProperty.isSpecialProperty) {
								// It's a special property, tunnel via the special property method
								Tweener._specialPropertyList[pName].setValue(tScope, nv, Tweener._specialPropertyList[pName].parameters, tTweening.properties[pName].extra);
							} else {
								// Directly set property
								tScope[pName] = nv;
							}
						}

						tTweening.updatesSkipped = 0;

						if (Boolean(tTweening.onUpdate)) {
							eventScope = Boolean(tTweening.onUpdateScope) ? tTweening.onUpdateScope : tScope;
							try {
								tTweening.onUpdate.apply(eventScope, tTweening.onUpdateParams);
							} catch(e3) {
								Tweener.handleError(tTweening, e3, "onUpdate");
							}
						}
					} else {
						tTweening.updatesSkipped++;
					}
				}
	
				if (isOver && Boolean(tTweening.onComplete)) {
					eventScope = Boolean(tTweening.onCompleteScope) ? tTweening.onCompleteScope : tScope;
					try {
						tTweening.isComplete = true;
						tTweening.onComplete.apply(eventScope, tTweening.onCompleteParams);
					} catch(e4) {
						Tweener.handleError(tTweening, e4, "onComplete");
					}
				}

				return (!isOver);
			}
	
			// On delay, hasn't started, so returns true
			return (true);
	
		}
		
	
		/**
		 * Initiates the Tweener--should only be ran once.
		 */
		public static init(...rest):void {
			Tweener._inited = true;

			// Registers all default equations
			Tweener._transitionList = new Object();
			Equations.init();

			// Registers all default special properties
			Tweener._specialPropertyList = new Object();
			Tweener._specialPropertyModifierList = new Object();
			Tweener._specialPropertySplitterList = new Object();
		}
	
		/**
		 * Adds a new function to the available transition list "shortcuts".
		 *
		 * @param		p_name				String		Shorthand transition name
		 * @param		p_function			Function	The proper equation function
		 */
		public static registerTransition(p_name:string, p_function:Function): void {
			if (!Tweener._inited) Tweener.init();
			Tweener._transitionList[p_name] = p_function;
		}
	
		/**
		 * Adds a new special property to the available special property list.
		 *
		 * @param		p_name				Name of the "special" property.
		 * @param		p_getFunction		Function that gets the value.
		 * @param		p_setFunction		Function that sets the value.
		 */
		public static registerSpecialProperty(p_name:string, p_getFunction:Function, p_setFunction:Function, p_parameters:any[] = null, p_preProcessFunction:Function = null): void {
			if (!Tweener._inited) Tweener.init();
			var sp:SpecialProperty = new SpecialProperty(p_getFunction, p_setFunction, p_parameters, p_preProcessFunction);
			Tweener._specialPropertyList[p_name] = sp;
		}

		/**
		 * Adds a new special property modifier to the available modifier list.
		 *
		 * @param		p_name				Name of the "special" property modifier.
		 * @param		p_modifyFunction	Function that modifies the value.
		 * @param		p_getFunction		Function that gets the value.
		 */
		public static registerSpecialPropertyModifier(p_name:string, p_modifyFunction:Function, p_getFunction:Function): void {
			if (!Tweener._inited) Tweener.init();
			var spm:SpecialPropertyModifier = new SpecialPropertyModifier(p_modifyFunction, p_getFunction);
			Tweener._specialPropertyModifierList[p_name] = spm;
		}

		/**
		 * Adds a new special property splitter to the available splitter list.
		 *
		 * @param		p_name				Name of the "special" property splitter.
		 * @param		p_splitFunction		Function that splits the value.
		 */
		public static registerSpecialPropertySplitter(p_name:string, p_splitFunction:Function, p_parameters:any[] = null): void {
			if (!Tweener._inited) Tweener.init();
			var sps:SpecialPropertySplitter = new SpecialPropertySplitter(p_splitFunction, p_parameters);
			Tweener._specialPropertySplitterList[p_name] = sps;
		}

		/**
		 * Starts the Tweener class engine. It is supposed to be running every time a tween exists.
		 */
		private static startEngine():void {
			Tweener._engineExists = true;
			Tweener._tweenList = new Array();
			
			Tweener.__tweener_controller__ = new MovieClip();
			Tweener.__tweener_controller__.addEventListener(AEvent.ENTER_FRAME, Tweener.onEnterFrame);
			
			Tweener._currentTimeFrame = 0;
			Tweener.updateTime();
		}
	
		/**
		 * Stops the Tweener class engine.
		 */
		private static stopEngine():void {
			Tweener._engineExists = false;
			Tweener._tweenList = null;
			Tweener._currentTime = 0;
			Tweener._currentTimeFrame = 0;
			Tweener.__tweener_controller__.removeEventListener(AEvent.ENTER_FRAME, Tweener.onEnterFrame);
			Tweener.__tweener_controller__ = null;
		}
	
		/**
		 * Updates the time to enforce time grid-based updates.
		 */
		public static updateTime():void {
			Tweener._currentTime = getTimer();
		}
	
		/**
		 * Updates the current frame count
		 */
		public static updateFrame():void {
			Tweener._currentTimeFrame++;
		}

		/**
		 * Ran once every frame. It's the main engine; updates all existing tweenings.
		 */
		public static onEnterFrame(e:Event):void {
			Tweener.updateTime();
			Tweener.updateFrame();
			var hasUpdated:boolean = false;
			hasUpdated = Tweener.updateTweens();
			if (!hasUpdated) Tweener.stopEngine();	// There's no tweening to update or wait, so it's better to stop the engine
		}
	
		/**
		 * Sets the new time scale.
		 *
		 * @param		p_time				Number		New time scale (0.5 = slow, 1 = normal, 2 = 2x fast forward, etc)
		 */
		public static setTimeScale(p_time:number):void {
			var i:number;
			var cTime:number;
	
			if (isNaN(p_time)) p_time = 1;
			if (p_time < 0.00001) p_time = 0.00001;
			if (p_time != Tweener._timeScale) {
				if (Tweener._tweenList != null) {
					// Multiplies all existing tween times accordingly
					for (i = 0; i<Tweener._tweenList.length; i++) {
						cTime = Tweener.getCurrentTweeningTime(Tweener._tweenList[i]);
						Tweener._tweenList[i].timeStart = cTime - ((cTime - Tweener._tweenList[i].timeStart) * Tweener._timeScale / p_time);
						Tweener._tweenList[i].timeComplete = cTime - ((cTime - Tweener._tweenList[i].timeComplete) * Tweener._timeScale / p_time);
						if (Tweener._tweenList[i].timePaused != undefined) Tweener._tweenList[i].timePaused = cTime - ((cTime - Tweener._tweenList[i].timePaused) * Tweener._timeScale / p_time);
					}
				}
				// Sets the new timescale value (for new tweenings)
				Tweener._timeScale = p_time;
			}
		}


		// ==================================================================================================================================
		// AUXILIARY functions --------------------------------------------------------------------------------------------------------------

		/**
		 * Finds whether or not an object has any tweening.
		 *
		 * @param		p_scope		Target object.
		 * @return					<code>true</code> if there's a tweening occuring on this object (paused, delayed, or active), <code>false</code> if otherwise.
		 */
		public static isTweening (p_scope:any):boolean {
			if (!Boolean(Tweener._tweenList)) return false;
			var i:number;

			for (i = 0; i<Tweener._tweenList.length; i++) {
				if (Boolean(Tweener._tweenList[i]) && Tweener._tweenList[i].scope == p_scope && !Tweener._tweenList[i].isComplete) {
					return true;
				}
			}
			return false;
		}

		/**
		 * Returns an array containing a list of the properties being tweened for this object.
		 *
		 * @param		p_scope		Target object.
		 * @return					Total number of properties being tweened (including delayed or paused tweens).
		 */
		public static getTweens (p_scope:any):any[] {
			if (!Boolean(Tweener._tweenList)) return [];
			var i:number;
			var pName:string;
 			var tList:any[] = new Array();

			for (i = 0; i<Tweener._tweenList.length; i++) {
				if (Boolean(Tweener._tweenList[i]) && Tweener._tweenList[i].scope == p_scope) {
					for (pName in Tweener._tweenList[i].properties) tList.push(pName);
				}
			}
			return tList;
		}

		/**
		 * Returns the number of properties being tweened for a given object.
		 *
		 * @param		p_scope		Target object.
		 * @return					Total number of properties being tweened (including delayed or paused tweens).
		 */
		public static getTweenCount (p_scope:any):number {
			if (!Boolean(Tweener._tweenList)) return 0;
			var i:number;
			var c:number = 0;

			for (i = 0; i<Tweener._tweenList.length; i++) {
				if (Boolean(Tweener._tweenList[i]) && Tweener._tweenList[i].scope == p_scope) {
					c += AuxFunctions.getObjectLength(Tweener._tweenList[i].properties);
				}
			}
			return c;
		}


        /* Handles errors when Tweener executes any callbacks (onStart, onUpdate, etc)
        *  If the TweenListObj specifies an <code>onError</code> callback it well get called, passing the <code>Error</code> object and the current scope as parameters. If no <code>onError</code> callback is specified, it will trace a stackTrace.
        */
        private static handleError(pTweening : TweenListObj, pError : any, pCallBackName : string) : void{
            // do we have an error handler?
            if (Boolean(pTweening.onError) && (pTweening.onError instanceof Function)){
                // yup, there's a handler. Wrap this in a try catch in case the onError throws an error itself.
				var eventScope:any = Boolean(pTweening.onErrorScope) ? pTweening.onErrorScope : pTweening.scope;
                try {
                    pTweening.onError.apply(eventScope, [pTweening.scope, pError]);
                } catch (metaError){
					Tweener.printError(String(pTweening.scope) + " raised an error while executing the 'onError' handler. Original error:\n " + pError.stack +  "\nonError error: " + metaError['stack']);
                }
            } else {
                // no handler, simply trace the stack trace:
                if (!Boolean(pTweening.onError)){
					Tweener.printError(String(pTweening.scope) + " raised an error while executing the '" + pCallBackName + "'handler. \n" + pError.stack );
                }
            }
        }

		/**
		 * Get the current tweening time (no matter if it uses frames or time as basis), given a specific tweening
		 *
		 * @param		p_tweening				TweenListObj		Tween information
		 */
		public static getCurrentTweeningTime(p_tweening:any):number {
			return p_tweening.useFrames ? Tweener._currentTimeFrame : Tweener._currentTime;
		}

		/**
		 * Return the current tweener version
		 *
		 * @return							String		The number of the current Tweener version
		 */
		public static getVersion():string {
			return "AS3 1.33.74";
		}


		// ==================================================================================================================================
		// DEBUG functions ------------------------------------------------------------------------------------------------------------------

		/**
		 * Output an error message
		 *
		 * @param		p_message				String		The error message to output
		 */
		public static printError(p_message:string): void {
			//
			console.log("## [Tweener] Error: "+p_message);
		}

	}

