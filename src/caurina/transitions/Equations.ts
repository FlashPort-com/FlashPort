import { Tweener } from "./Tweener";
﻿/**
 * Equations
 * Main equations for the Tweener class
 *
 * @author		Zeh Fernando, Nate Chatellier
 * @version		1.0.2
 */

/*
Disclaimer for Robert Penner's Easing Equations license:

TERMS OF USE - EASING EQUATIONS

Open source under the BSD License.

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


	
	export class Equations {
	
		/**
		 * There's no constructor.
		 * @private
		 */
		constructor (){
			console.log("Equations is a static class and should not be instantiated.")
		}
	
		/**
		 * Registers all the equations to the Tweener class, so they can be found by the direct string parameters.
		 * This method doesn't actually have to be used - equations can always be referenced by their full function
		 * names. But "registering" them make them available as their shorthand string names.
		 */
		public static init = ():void =>
		{
			Tweener.registerTransition("easenone",			Equations.easeNone);
			Tweener.registerTransition("linear",			Equations.easeNone);		// mx.transitions.easing.None.easeNone
			
			Tweener.registerTransition("easeinquad",		Equations.easeInQuad);	// mx.transitions.easing.Regular.easeIn
			Tweener.registerTransition("easeoutquad",		Equations.easeOutQuad);	// mx.transitions.easing.Regular.easeOut
			Tweener.registerTransition("easeinoutquad",		Equations.easeInOutQuad);	// mx.transitions.easing.Regular.easeInOut
			Tweener.registerTransition("easeoutinquad",		Equations.easeOutInQuad);
			
			Tweener.registerTransition("easeincubic",		Equations.easeInCubic);
			Tweener.registerTransition("easeoutcubic",		Equations.easeOutCubic);
			Tweener.registerTransition("easeinoutcubic",	Equations.easeInOutCubic);
			Tweener.registerTransition("easeoutincubic",	Equations.easeOutInCubic);
			
			Tweener.registerTransition("easeinquart",		Equations.easeInQuart);
			Tweener.registerTransition("easeoutquart",		Equations.easeOutQuart);
			Tweener.registerTransition("easeinoutquart",	Equations.easeInOutQuart);
			Tweener.registerTransition("easeoutinquart",	Equations.easeOutInQuart);
			
			Tweener.registerTransition("easeinquint",		Equations.easeInQuint);
			Tweener.registerTransition("easeoutquint",		Equations.easeOutQuint);
			Tweener.registerTransition("easeinoutquint",	Equations.easeInOutQuint);
			Tweener.registerTransition("easeoutinquint",	Equations.easeOutInQuint);
			
			Tweener.registerTransition("easeinsine",		Equations.easeInSine);
			Tweener.registerTransition("easeoutsine",		Equations.easeOutSine);
			Tweener.registerTransition("easeinoutsine",		Equations.easeInOutSine);
			Tweener.registerTransition("easeoutinsine",		Equations.easeOutInSine);
			
			Tweener.registerTransition("easeincirc",		Equations.easeInCirc);
			Tweener.registerTransition("easeoutcirc",		Equations.easeOutCirc);
			Tweener.registerTransition("easeinoutcirc",		Equations.easeInOutCirc);
			Tweener.registerTransition("easeoutincirc",		Equations.easeOutInCirc);
			
			Tweener.registerTransition("easeinexpo",		Equations.easeInExpo);		// mx.transitions.easing.Strong.easeIn
			Tweener.registerTransition("easeoutexpo", 		Equations.easeOutExpo);		// mx.transitions.easing.Strong.easeOut
			Tweener.registerTransition("easeinoutexpo", 	Equations.easeInOutExpo);		// mx.transitions.easing.Strong.easeInOut
			Tweener.registerTransition("easeoutinexpo", 	Equations.easeOutInExpo);
			
			Tweener.registerTransition("easeinelastic", 	Equations.easeInElastic);		// mx.transitions.easing.Elastic.easeIn
			Tweener.registerTransition("easeoutelastic", 	Equations.easeOutElastic);	// mx.transitions.easing.Elastic.easeOut
			Tweener.registerTransition("easeinoutelastic", 	Equations.easeInOutElastic);	// mx.transitions.easing.Elastic.easeInOut
			Tweener.registerTransition("easeoutinelastic", 	Equations.easeOutInElastic);
			
			Tweener.registerTransition("easeinback", 		Equations.easeInBack);		// mx.transitions.easing.Back.easeIn
			Tweener.registerTransition("easeoutback", 		Equations.easeOutBack);		// mx.transitions.easing.Back.easeOut
			Tweener.registerTransition("easeinoutback", 	Equations.easeInOutBack);		// mx.transitions.easing.Back.easeInOut
			Tweener.registerTransition("easeoutinback", 	Equations.easeOutInBack);
			
			Tweener.registerTransition("easeinbounce", 		Equations.easeInBounce);		// mx.transitions.easing.Bounce.easeIn
			Tweener.registerTransition("easeoutbounce", 	Equations.easeOutBounce);		// mx.transitions.easing.Bounce.easeOut
			Tweener.registerTransition("easeinoutbounce", 	Equations.easeInOutBounce);	// mx.transitions.easing.Bounce.easeInOut
			Tweener.registerTransition("easeoutinbounce", 	Equations.easeOutInBounce);
		}

	// ==================================================================================================================================
	// TWEENING EQUATIONS functions -----------------------------------------------------------------------------------------------------
	// (the original equations are Robert Penner's work as mentioned on the disclaimer)

		/**
		 * Easing equation function for a simple linear tweening, with no easing.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeNone = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c*t/d + b;
		}
	
		/**
		 * Easing equation function for a quadratic (t^2) easing in: accelerating from zero velocity.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInQuad = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c*(t/=d)*t + b;
		}
	
		/**
		 * Easing equation function for a quadratic (t^2) easing out: decelerating to zero velocity.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutQuad = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return -c *(t/=d)*(t-2) + b;
		}
	
		/**
		 * Easing equation function for a quadratic (t^2) easing in/out: acceleration until halfway, then deceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInOutQuad = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	
		/**
		 * Easing equation function for a quadratic (t^2) easing out/in: deceleration until halfway, then acceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutInQuad = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutQuad (t*2, b, c/2, d, p_params);
			return Equations.easeInQuad((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for a cubic (t^3) easing in: accelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInCubic = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c*(t/=d)*t*t + b;
		}
	
		/**
		 * Easing equation function for a cubic (t^3) easing out: decelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutCubic = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c*((t=t/d-1)*t*t + 1) + b;
		}
	
		/**
		 * Easing equation function for a cubic (t^3) easing in/out: acceleration until halfway, then deceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInOutCubic = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		}
	
		/**
		 * Easing equation function for a cubic (t^3) easing out/in: deceleration until halfway, then acceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutInCubic = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutCubic (t*2, b, c/2, d, p_params);
			return Equations.easeInCubic((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for a quartic (t^4) easing in: accelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInQuart = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c*(t/=d)*t*t*t + b;
		}
	
		/**
		 * Easing equation function for a quartic (t^4) easing out: decelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutQuart = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		}
	
		/**
		 * Easing equation function for a quartic (t^4) easing in/out: acceleration until halfway, then deceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInOutQuart = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		}
	
		/**
		 * Easing equation function for a quartic (t^4) easing out/in: deceleration until halfway, then acceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutInQuart = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutQuart (t*2, b, c/2, d, p_params);
			return Equations.easeInQuart((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for a quintic (t^5) easing in: accelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInQuint = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c*(t/=d)*t*t*t*t + b;
		}
	
		/**
		 * Easing equation function for a quintic (t^5) easing out: decelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutQuint = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		}
	
		/**
		 * Easing equation function for a quintic (t^5) easing in/out: acceleration until halfway, then deceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInOutQuint = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		}
	
		/**
		 * Easing equation function for a quintic (t^5) easing out/in: deceleration until halfway, then acceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutInQuint = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutQuint (t*2, b, c/2, d, p_params);
			return Equations.easeInQuint((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for a sinusoidal (sin(t)) easing in: accelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInSine = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		}
	
		/**
		 * Easing equation function for a sinusoidal (sin(t)) easing out: decelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutSine = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		}
	
		/**
		 * Easing equation function for a sinusoidal (sin(t)) easing in/out: acceleration until halfway, then deceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInOutSine = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		}
	
		/**
		 * Easing equation function for a sinusoidal (sin(t)) easing out/in: deceleration until halfway, then acceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutInSine = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutSine (t*2, b, c/2, d, p_params);
			return Equations.easeInSine((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for an exponential (2^t) easing in: accelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInExpo = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
		}
	
		/**
		 * Easing equation function for an exponential (2^t) easing out: decelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutExpo = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
		}
	
		/**
		 * Easing equation function for an exponential (2^t) easing in/out: acceleration until halfway, then deceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInOutExpo = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
			return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
		}
	
		/**
		 * Easing equation function for an exponential (2^t) easing out/in: deceleration until halfway, then acceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutInExpo = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutExpo (t*2, b, c/2, d, p_params);
			return Equations.easeInExpo((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for a circular (sqrt(1-t^2)) easing in: accelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInCirc = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		}
	
		/**
		 * Easing equation function for a circular (sqrt(1-t^2)) easing out: decelerating from zero velocity.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutCirc = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		}
	
		/**
		 * Easing equation function for a circular (sqrt(1-t^2)) easing in/out: acceleration until halfway, then deceleration.
 		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInOutCirc = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		}
	
		/**
		 * Easing equation function for a circular (sqrt(1-t^2)) easing out/in: deceleration until halfway, then acceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutInCirc = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutCirc (t*2, b, c/2, d, p_params);
			return Equations.easeInCirc((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for an elastic (exponentially decaying sine wave) easing in: accelerating from zero velocity.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @param a		Amplitude.
		 * @param p		Period.
		 * @return		The correct value.
		 */
		public static easeInElastic = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t==0) return b;
			if ((t/=d)==1) return b+c;
			var p:number = !Boolean(p_params) || isNaN(p_params.period) ? d*.3 : p_params.period;
			var s:number;
			var a:number = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
			if (!Boolean(a) || a < Math.abs(c)) {
				a = c;
				s = p/4;
			} else {
				s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
	
		/**
		 * Easing equation function for an elastic (exponentially decaying sine wave) easing out: decelerating from zero velocity.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @param a		Amplitude.
		 * @param p		Period.
		 * @return		The correct value.
		 */
		public static easeOutElastic = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t==0) return b;
			if ((t/=d)==1) return b+c;
			var p:number = !Boolean(p_params) || isNaN(p_params.period) ? d*.3 : p_params.period;
			var s:number;
			var a:number = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
			if (!Boolean(a) || a < Math.abs(c)) {
				a = c;
				s = p/4;
			} else {
				s = p/(2*Math.PI) * Math.asin (c/a);
			}
			return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
		}
	
		/**
		 * Easing equation function for an elastic (exponentially decaying sine wave) easing in/out: acceleration until halfway, then deceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @param a		Amplitude.
		 * @param p		Period.
		 * @return		The correct value.
		 */
		public static easeInOutElastic = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t==0) return b;
			if ((t/=d/2)==2) return b+c;
			var p:number = !Boolean(p_params) || isNaN(p_params.period) ? d*(.3*1.5) : p_params.period;
			var s:number;
			var a:number = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
			if (!Boolean(a) || a < Math.abs(c)) {
				a = c;
				s = p/4;
			} else {
				s = p/(2*Math.PI) * Math.asin (c/a);
			}
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		}
	
		/**
		 * Easing equation function for an elastic (exponentially decaying sine wave) easing out/in: deceleration until halfway, then acceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @param a		Amplitude.
		 * @param p		Period.
		 * @return		The correct value.
		 */
		public static easeOutInElastic = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutElastic (t*2, b, c/2, d, p_params);
			return Equations.easeInElastic((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing in: accelerating from zero velocity.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @param s		Overshoot ammount: higher s means greater overshoot (0 produces cubic easing with no overshoot, and the default value of 1.70158 produces an overshoot of 10 percent).
		 * @return		The correct value.
		 */
		public static easeInBack = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			var s:number = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		}
	
		/**
		 * Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing out: decelerating from zero velocity.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @param s		Overshoot ammount: higher s means greater overshoot (0 produces cubic easing with no overshoot, and the default value of 1.70158 produces an overshoot of 10 percent).
		 * @return		The correct value.
		 */
		public static easeOutBack = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			var s:number = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		}
	
		/**
		 * Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing in/out: acceleration until halfway, then deceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @param s		Overshoot ammount: higher s means greater overshoot (0 produces cubic easing with no overshoot, and the default value of 1.70158 produces an overshoot of 10 percent).
		 * @return		The correct value.
		 */
		public static easeInOutBack = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			var s:number = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		}
	
		/**
		 * Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing out/in: deceleration until halfway, then acceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @param s		Overshoot ammount: higher s means greater overshoot (0 produces cubic easing with no overshoot, and the default value of 1.70158 produces an overshoot of 10 percent).
		 * @return		The correct value.
		 */
		public static easeOutInBack = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutBack (t*2, b, c/2, d, p_params);
			return Equations.easeInBack((t*2)-d, b+c/2, c/2, d, p_params);
		}
	
		/**
		 * Easing equation function for a bounce (exponentially decaying parabolic bounce) easing in: accelerating from zero velocity.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInBounce = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			return c - Equations.easeOutBounce (d-t, 0, c, d) + b;
		}
	
		/**
		 * Easing equation function for a bounce (exponentially decaying parabolic bounce) easing out: decelerating from zero velocity.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutBounce = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		}
	
		/**
		 * Easing equation function for a bounce (exponentially decaying parabolic bounce) easing in/out: acceleration until halfway, then deceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeInOutBounce = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeInBounce (t*2, 0, c, d) * .5 + b;
			else return Equations.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	
		/**
		 * Easing equation function for a bounce (exponentially decaying parabolic bounce) easing out/in: deceleration until halfway, then acceleration.
		 *
		 * @param t		Current time (in frames or seconds).
		 * @param b		Starting value.
		 * @param c		Change needed in value.
		 * @param d		Expected easing duration (in frames or seconds).
		 * @return		The correct value.
		 */
		public static easeOutInBounce = (t:number, b:number, c:number, d:number, p_params:any = null):number =>
		{
			if (t < d/2) return Equations.easeOutBounce (t*2, b, c/2, d, p_params);
			return Equations.easeInBounce((t*2)-d, b+c/2, c/2, d, p_params);
		}
	}

