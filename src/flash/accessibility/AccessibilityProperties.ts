
	export class AccessibilityProperties extends Object
	{
		/**
		 * Provides a description for this display object in the accessible presentation.
		 * If you have a lot of information to present about the object, it is
		 * best to choose a concise name and put most of your content in the
		 * description property. 
		 * Applies to whole SWF files, containers, buttons, and text. The default value
		 * is an empty string.
		 * In Flash Professional, this property corresponds to the Description field in the Accessibility panel.
		 * @langversion	3.0
		 * @playerversion	Flash 9
		 */
		public description:string;

		/**
		 * If true, causes Flash Player to exclude child objects within this
		 * display object from the accessible presentation.  
		 * The default is false. Applies to whole SWF files and containers.
		 * @playerversion	Flash 9
		 */
		public forceSimple:boolean;

		/**
		 * Provides a name for this display object in the accessible presentation. 
		 * Applies to whole SWF files, containers, buttons, and text.  Do not confuse with
		 * DisplayObject.name, which is unrelated. The default value
		 * is an empty string.
		 * In Flash Professional, this property corresponds to the Name field in the Accessibility panel.
		 * @langversion	3.0
		 * @playerversion	Flash 9
		 */
		public name:string;

		/**
		 * If true, disables the Flash Player default auto-labeling system.
		 * Auto-labeling causes text objects inside buttons to be treated as button names,
		 * and text objects near text fields to be treated as text field names.
		 * The default is false. Applies only to whole SWF files.
		 * The noAutoLabeling property value is ignored unless you specify it before the
		 * first time an accessibility aid examines your SWF file. If you plan to set 
		 * noAutoLabeling to true, you should do so as early as 
		 * possible in your code.
		 * @playerversion	Flash 9
		 */
		public noAutoLabeling:boolean;

		/**
		 * Indicates a keyboard shortcut associated with this display object. 
		 * Supply this string only for UI controls that you have associated with a shortcut key. 
		 * Applies to containers, buttons, and text.  The default value
		 * is an empty string.
		 * 
		 *   Note: Assigning this property does not automatically assign the specified key
		 * combination to this object; you must do that yourself, for example, by
		 * listening for a KeyboardEvent.The syntax for this string uses long names for modifier keys, and
		 * the plus(+) character to indicate key combination. Examples of valid strings are
		 * "Ctrl+F", "Ctrl+Shift+Z", and so on.
		 * @langversion	3.0
		 * @playerversion	Flash 9
		 */
		public shortcut:string;

		/**
		 * If true, excludes this display object from accessible presentation.
		 * The default is false. Applies to whole SWF files, containers, buttons, and text.
		 * @langversion	3.0
		 * @playerversion	Flash 9
		 */
		public silent:boolean;

		/**
		 * Creates a new AccessibilityProperties object.
		 * @langversion	3.0
		 * @playerversion	Flash 9
		 */
		constructor()
		{
			super();
		}
	}

