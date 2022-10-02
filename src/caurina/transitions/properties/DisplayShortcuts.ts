

	/**
	 * properties.DisplayShortcuts.as
	 * List of default special MovieClip properties (normal and splitter properties) for the Tweener class
	 * The function names are strange/inverted because it makes for easier debugging (alphabetic order). They're only for internal use (on this class) anyways.
	 *
	 * @author		Zeh Fernando, Nate Chatellier, Arthur Debert
	 * @version		1.0.0
	 */

	import { Rectangle } from "../../../flash/geom/Rectangle";

	import { Tweener } from "../Tweener";

	export class DisplayShortcuts {

		/**
		 * There's no constructor.
		 */
		constructor (){
			console.log("This is an static class and should not be instantiated.")
		}

		/**
		 * Registers all the special properties to the Tweener class, so the Tweener knows what to do with them.
		 */
		public static init = (): void =>
		{
			// Normal properties
			Tweener.registerSpecialProperty("_frame", DisplayShortcuts._frame_get, DisplayShortcuts._frame_set);
			Tweener.registerSpecialProperty("_autoAlpha", DisplayShortcuts._autoAlpha_get, DisplayShortcuts._autoAlpha_set);

			// Scale splitter properties
			Tweener.registerSpecialPropertySplitter("_scale", DisplayShortcuts._scale_splitter);

			// scrollRect splitter properties
			Tweener.registerSpecialPropertySplitter("_scrollRect", DisplayShortcuts._scrollRect_splitter);
			
			// scrollrect normal properties
			Tweener.registerSpecialProperty("_scrollRect_x",		DisplayShortcuts._scrollRect_property_get, DisplayShortcuts._scrollRect_property_set, ["x"]);
			Tweener.registerSpecialProperty("_scrollRect_y",		DisplayShortcuts._scrollRect_property_get, DisplayShortcuts._scrollRect_property_set, ["y"]);
			Tweener.registerSpecialProperty("_scrollRect_left",		DisplayShortcuts._scrollRect_property_get, DisplayShortcuts._scrollRect_property_set, ["left"]);
			Tweener.registerSpecialProperty("_scrollRect_right",	DisplayShortcuts._scrollRect_property_get, DisplayShortcuts._scrollRect_property_set, ["right"]);
			Tweener.registerSpecialProperty("_scrollRect_top",		DisplayShortcuts._scrollRect_property_get, DisplayShortcuts._scrollRect_property_set, ["top"]);
			Tweener.registerSpecialProperty("_scrollRect_bottom",	DisplayShortcuts._scrollRect_property_get, DisplayShortcuts._scrollRect_property_set, ["bottom"]);
			Tweener.registerSpecialProperty("_scrollRect_width",	DisplayShortcuts._scrollRect_property_get, DisplayShortcuts._scrollRect_property_set, ["width"]);
			Tweener.registerSpecialProperty("_scrollRect_height",	DisplayShortcuts._scrollRect_property_get, DisplayShortcuts._scrollRect_property_set, ["height"]);

		}


		// ==================================================================================================================================
		// PROPERTY GROUPING/SPLITTING functions --------------------------------------------------------------------------------------------

		// ----------------------------------------------------------------------------------------------------------------------------------
		// scale
		public static _scale_splitter = (p_value:number, p_parameters:any[]) : any[] =>
		{
			var nArray:any[] = new Array();
			nArray.push({name:"scaleX", value: p_value});
			nArray.push({name:"scaleY", value: p_value});
			return nArray;
		}

		// ----------------------------------------------------------------------------------------------------------------------------------
		// _scrollRect

		/**
		 * Splits the _scrollRect parameter into specific scrollRect variables
		 *
		 * @param		p_value				Rectangle	The original _scrollRect rectangle
		 * @return							Array		An array containing the .name and .value of all new properties
		 */
		public static _scrollRect_splitter = (p_value:Rectangle, p_parameters:any[], p_extra:any = null):any[] =>
		{
			var nArray:any[] = new Array();
			if (p_value == null) {
				// No parameter passed, so try any rectangle :/
				nArray.push({name:"_scrollRect_x", value:0});
				nArray.push({name:"_scrollRect_y", value:0});
				nArray.push({name:"_scrollRect_width", value:100});
				nArray.push({name:"_scrollRect_height", value:100});
			} else {
				// A rectangle is passed, so just return the properties
				nArray.push({name:"_scrollRect_x", value:p_value.x});
				nArray.push({name:"_scrollRect_y", value:p_value.y});
				nArray.push({name:"_scrollRect_width", value:p_value.width});
				nArray.push({name:"_scrollRect_height", value:p_value.height});
			}
			return nArray;
		}


		// ==================================================================================================================================
		// NORMAL SPECIAL PROPERTY functions ------------------------------------------------------------------------------------------------

		// ----------------------------------------------------------------------------------------------------------------------------------
		// _frame

		/**
		 * Returns the current frame number from the movieclip timeline
		 *
		 * @param		p_obj				Object		MovieClip object
		 * @return							Number		The current frame
		 */
		public static _frame_get = (p_obj:any, p_parameters:any[], p_extra:any = null):number =>
		{
			return p_obj.currentFrame;
		}

		/**
		 * Sets the timeline frame
		 *
		 * @param		p_obj				Object		MovieClip object
		 * @param		p_value				Number		New frame number
		 */
		public static _frame_set = (p_obj:any, p_value:number, p_parameters:any[], p_extra:any = null): void =>
		{
			p_obj.gotoAndStop(Math.round(p_value));
		}

		
		// ----------------------------------------------------------------------------------------------------------------------------------
		// _autoAlpha

		/**
		 * Returns the current alpha
		 *
		 * @param		p_obj				Object		MovieClip or Textfield object
		 * @return							Number		The current alpha
		 */
		public static _autoAlpha_get = (p_obj:any, p_parameters:any[], p_extra:any = null):number =>
		{
			return p_obj.alpha;
		}

		/**
		 * Sets the current autoAlpha
		 *
		 * @param		p_obj				Object		MovieClip or Textfield object
		 * @param		p_value				Number		New alpha
		 */
		public static _autoAlpha_set = (p_obj:any, p_value:number, p_parameters:any[], p_extra:any = null): void =>
		{
			p_obj.alpha = p_value;
			p_obj.visible = p_value > 0;
		}

		// ----------------------------------------------------------------------------------------------------------------------------------
		// _scrollRect_*

		/**
		 * _scrollRect_*
		 * Generic function for the properties of the scrollRect object
		 */
		public static _scrollRect_property_get = (p_obj:any, p_parameters:any[], p_extra:any = null):number =>
		{
			return p_obj.scrollRect[p_parameters[0]];
		}

		public static _scrollRect_property_set = (p_obj:any, p_value:number, p_parameters:any[], p_extra:any = null): void =>
		{
			var rect:Rectangle = p_obj.scrollRect;
			rect[p_parameters[0]] = Math.round(p_value);
			p_obj.scrollRect = rect;
		}
	}

