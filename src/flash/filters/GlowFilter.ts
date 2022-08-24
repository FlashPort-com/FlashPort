import { DisplayObject } from "../display/DisplayObject";
import { BitmapFilter } from "./BitmapFilter";
import { Rectangle } from "../geom/Rectangle";
import { TextField } from "../text/TextField";

/**
 * The GlowFilter class lets you apply a glow effect to display objects.
 * You have several options for the style of the 
 * glow, including inner or outer glow and knockout mode. 
 * The glow filter is similar to the drop shadow filter with the <codeph class="+ topic/ph pr-d/codeph ">distance</codeph>
 * and <codeph class="+ topic/ph pr-d/codeph ">angle</codeph> properties of the drop shadow filter set to 0. 
 * You can apply the filter to any display object (that is, objects that inherit from the DisplayObject class), 
 * such as MovieClip, SimpleButton, TextField, and Video objects, as well as to BitmapData objects.
 * 
 *   <p class="- topic/p ">The use of filters depends on the object to which you apply the filter:</p><ul class="- topic/ul "><li class="- topic/li ">To apply filters to display objects, use the
 * <codeph class="+ topic/ph pr-d/codeph ">filters</codeph> property (inherited from DisplayObject). Setting the <codeph class="+ topic/ph pr-d/codeph ">filters</codeph> 
 * property of an object does not modify the object, and you can remove the filter by clearing the
 * <codeph class="+ topic/ph pr-d/codeph ">filters</codeph> property. </li><li class="- topic/li ">To apply filters to BitmapData objects, use the <codeph class="+ topic/ph pr-d/codeph ">BitmapData.applyFilter()</codeph> method.
 * Calling <codeph class="+ topic/ph pr-d/codeph ">applyFilter()</codeph> on a BitmapData object takes the source BitmapData object 
 * and the filter object and generates a filtered image as a result.</li></ul><p class="- topic/p ">If you apply a filter to a display object, the <codeph class="+ topic/ph pr-d/codeph ">cacheAsBitmap</codeph> property of the 
 * display object is set to <codeph class="+ topic/ph pr-d/codeph ">true</codeph>. If you clear all filters, the original value of 
 * <codeph class="+ topic/ph pr-d/codeph ">cacheAsBitmap</codeph> is restored.</p><p class="- topic/p ">This filter supports Stage scaling. However, it does not support general scaling, rotation, and 
 * skewing. If the object itself is scaled (if <codeph class="+ topic/ph pr-d/codeph ">scaleX</codeph> and <codeph class="+ topic/ph pr-d/codeph ">scaleY</codeph> are 
 * set to a value other than 1.0), the filter is not scaled. It is scaled only when the user zooms
 * in on the Stage.</p><p class="- topic/p ">A filter is not applied if the resulting image exceeds the maximum dimensions.
 * In  AIR 1.5 and Flash Player 10, the maximum is 8,191 pixels in width or height, 
 * and the total number of pixels cannot exceed 16,777,215 pixels. (So, if an image is 8,191 pixels 
 * wide, it can only be 2,048 pixels high.) In Flash Player 9 and earlier and AIR 1.1 and earlier, 
 * the limitation is 2,880 pixels in height and 2,880 pixels in width.
 * For example, if you zoom in on a large movie clip with a filter applied, the filter is 
 * turned off if the resulting image exceeds the maximum dimensions.</p>
 * 
 *   EXAMPLE:
 * 
 *   The following example draws a square and applies a blur filter to it.
 * The general workflow of the example is as follows:
 * <ol class="- topic/ol "><li class="- topic/li ">Import the required classes.</li><li class="- topic/li ">Declare three properties used in the <codeph class="+ topic/ph pr-d/codeph ">draw</codeph> method, which uses methods
 * of the Graphics class accessed through the <codeph class="+ topic/ph pr-d/codeph ">graphics</codeph> property of Sprite
 * to draw an orange square.</li><li class="- topic/li ">Create the constructor function, which does the following:
 * <ul class="- topic/ul "><li class="- topic/li ">Calls the <codeph class="+ topic/ph pr-d/codeph ">draw</codeph> function to create a rectangle.</li><li class="- topic/li ">Creates a BitmapFilter object <codeph class="+ topic/ph pr-d/codeph ">glowFilter</codeph> and assigns it the return values from the <codeph class="+ topic/ph pr-d/codeph ">getBitmapFilter()</codeph> function.</li><li class="- topic/li ">Assigns the array of values from the <codeph class="+ topic/ph pr-d/codeph ">glowFilter</codeph> object to the <codeph class="+ topic/ph pr-d/codeph ">filters</codeph> property of the root display object. In this case,
 * all display object children of the root display object inherit the glow filter properties. So, the rectangle created in the the <codeph class="+ topic/ph pr-d/codeph ">draw()</codeph> 
 * function displays the glow filter properties.</li></ul></li></ol><codeblock xml:space="preserve" class="+ topic/pre pr-d/codeblock ">
 * 
 *   package {
 * import flash.display.Sprite;
 * import flash.events.Event;
 * import flash.events.MouseEvent;
 * import flash.filters.BitmapFilter;
 * import flash.filters.BitmapFilterQuality;
 * import flash.filters.GlowFilter;
 * 
 *   public class GlowFilterExample extends Sprite {
 * private var bgColor:uint = 0xFFCC00;
 * private var size:uint    = 80;
 * private var offset:uint  = 50;
 * 
 *   public function GlowFilterExample() {
 * //draw the rectangle using the draw() function below
 * draw();
 * 
 *   //assign the values from getBitmapFilter function below
 * //to a BitmapFilter object "glowFilter"
 * var glowFilter:BitmapFilter = getBitmapFilter();
 * 
 *   //populate the filters property of the root display object with the array of values
 * //from the glowFilter object.
 * filters = [ glowFilter ];
 * }
 * 
 *   private function getBitmapFilter():BitmapFilter {
 * var color:number = 0x33CCFF;
 * var alpha:number = 0.8;
 * var blurX:number = 35;
 * var blurY:number = 35;
 * var strength:number = 2;
 * var inner:Boolean = false;
 * var knockout:Boolean = false;
 * var quality:number = BitmapFilterQuality.HIGH;
 * 
 *   return new GlowFilter(color,
 * alpha,
 * blurX,
 * blurY,
 * strength,
 * quality,
 * inner,
 * knockout);
 * }
 * 
 *   private function draw():void {
 * graphics.beginFill(bgColor);
 * graphics.drawRect(offset, offset, size, size);
 * graphics.endFill();
 * }
 * }
 * }
 * </codeblock>
 * @langversion	3.0
 * @playerversion	Flash 9
 */
export class GlowFilter extends BitmapFilter
{
	private _color:number;
	private _alpha:number;
	private _blurX:number;
	private _blurY:number;
	private _strength:number;
	private _quality:number;
	private _inner:boolean;
	private _knockout:boolean;
	private _blur:number;
	private _rgba:string;
	private _red:number;
	private _green:number;
	private _blue:number;
	
	//testing
	public origImage:ImageData;
	public copyData:ImageData;
	public copyCanvas:HTMLCanvasElement;
	public biggerCanvas:HTMLCanvasElement;
	
	/**
	 * The alpha transparency value for the color. Valid values are 0 to 1. 
	 * For example,
	 * .25 sets a transparency value of 25%. The default value is 1.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>alpha</code> property on an existing movie clip 
	 *   when a user clicks it.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var mc:MovieClip = createGlowFilterRectangle("GlowFilterAlpha");
	 *   mc.onRelease = function() {
	 *   var filter:GlowFilter = this.filters[0];
	 *   filter.alpha = .4;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createGlowFilterRectangle(name:string):MovieClip {
	 *   var rect:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   rect.beginFill(0x003366);
	 *   rect.lineTo(w, 0);
	 *   rect.lineTo(w, h);
	 *   rect.lineTo(0, h);
	 *   rect.lineTo(0, 0);
	 *   rect._x = 20;
	 *   rect._y = 20;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(0x000000, .8, 16, 16, 1, 3, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   return rect;
	 *   }
	 *   </listing>
	 */
	public get alpha () : number{
		return this._alpha;
	}
	public set alpha (value:number){
		this._alpha = value;
	}

	/**
	 * The amount of horizontal blur. Valid values are 0 to 255 (floating point). The
	 * default value is 6. Values that are a power of 2 (such as 2, 4, 
	 * 8, 16, and 32) are optimized 
	 * to render more quickly than other values.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>blurX</code> property on an existing movie clip 
	 *   when a user clicks it.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var mc:MovieClip = createGlowFilterRectangle("GlowFilterBlurX");
	 *   mc.onRelease = function() {
	 *   var filter:GlowFilter = this.filters[0];
	 *   filter.blurX = 20;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createGlowFilterRectangle(name:string):MovieClip {
	 *   var rect:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   rect.beginFill(0x003366);
	 *   rect.lineTo(w, 0);
	 *   rect.lineTo(w, h);
	 *   rect.lineTo(0, h);
	 *   rect.lineTo(0, 0);
	 *   rect._x = 20;
	 *   rect._y = 20;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(0x000000, .8, 16, 16, 1, 3, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   return rect;
	 *   }
	 *   </listing>
	 */
	public get blurX () : number{
		return this._blurX;
	}
	public set blurX (value:number){
		this._blurX = value;
		this._blur = Math.max(this.blurX, this.blurY);
		this._offsetX = this._offsetY = this._blur;
	}

	/**
	 * The amount of vertical blur. Valid values are 0 to 255 (floating point). The
	 * default value is 6. Values that are a power of 2 (such as 2, 4, 
	 * 8, 16, and 32) are optimized 
	 * to render more quickly than other values.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>blurY</code> property on an existing movie clip 
	 *   when a user clicks it.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var mc:MovieClip = createGlowFilterRectangle("GlowFilterBlurY");
	 *   mc.onRelease = function() {
	 *   var filter:GlowFilter = this.filters[0];
	 *   filter.blurY = 20;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createGlowFilterRectangle(name:string):MovieClip {
	 *   var rect:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   rect.beginFill(0x003366);
	 *   rect.lineTo(w, 0);
	 *   rect.lineTo(w, h);
	 *   rect.lineTo(0, h);
	 *   rect.lineTo(0, 0);
	 *   rect._x = 20;
	 *   rect._y = 20;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(0x000000, .8, 16, 16, 1, 3, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   return rect;
	 *   }
	 *   </listing>
	 */
	public get blurY () : number{
		return this._blurY;
	}
	public set blurY (value:number){
		this._blurY = value;
		this._blur = Math.max(this.blurX, this.blurY);
		this._offsetX = this._offsetY = this._blur;
	}

	/**
	 * The color of the glow. Valid values are in the hexadecimal format 
	 * 0xRRGGBB. The default value is 0xFF0000.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>color</code> property on an existing movie clip 
	 *   when a user clicks it.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var mc:MovieClip = createGlowFilterRectangle("GlowFilterColor");
	 *   mc.onRelease = function() {
	 *   var filter:GlowFilter = this.filters[0];
	 *   filter.color = 0x00FF33;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createGlowFilterRectangle(name:string):MovieClip {
	 *   var rect:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   rect.beginFill(0x003366);
	 *   rect.lineTo(w, 0);
	 *   rect.lineTo(w, h);
	 *   rect.lineTo(0, h);
	 *   rect.lineTo(0, 0);
	 *   rect._x = 20;
	 *   rect._y = 20;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(0x000000, .8, 16, 16, 1, 3, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   return rect;
	 *   }
	 *   </listing>
	 */
	public get color () : number{
		return this._color;
	}
	public set color (value:number){
		this._color = value;
		this._rgba = "rgba(" + (this.color >> 16 & 0xff) + "," + (this.color >> 8 & 0xff) + "," + (this.color & 0xff) + "," + this.alpha + ")";
	}

	/**
	 * Specifies whether the glow is an inner glow. The value true indicates 
	 * an inner glow. The default is false, an outer glow (a glow
	 * around the outer edges of the object).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>inner</code> property on an existing movie clip 
	 *   when a user clicks it.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var mc:MovieClip = createGlowFilterRectangle("GlowFilterInner");
	 *   mc.onRelease = function() {
	 *   var filter:GlowFilter = this.filters[0];
	 *   filter.inner = true;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createGlowFilterRectangle(name:string):MovieClip {
	 *   var rect:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   rect.beginFill(0x003366);
	 *   rect.lineTo(w, 0);
	 *   rect.lineTo(w, h);
	 *   rect.lineTo(0, h);
	 *   rect.lineTo(0, 0);
	 *   rect._x = 20;
	 *   rect._y = 20;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(0x000000, .8, 16, 16, 1, 3, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   return rect;
	 *   }
	 *   </listing>
	 */
	public get inner () : boolean{
		return this._inner;
	}
	public set inner (value:boolean){
		this._inner = value;
	}

	/**
	 * Specifies whether the object has a knockout effect. A value of true 
	 * makes the object's fill transparent and reveals the background color of the document. The 
	 * default value is false (no knockout effect).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>knockout</code> property on an existing movie clip 
	 *   when a user clicks it.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var mc:MovieClip = createGlowFilterRectangle("GlowFilterKnockout");
	 *   mc.onRelease = function() {
	 *   var filter:GlowFilter = this.filters[0];
	 *   filter.knockout = true;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createGlowFilterRectangle(name:string):MovieClip {
	 *   var rect:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   rect.beginFill(0x003366);
	 *   rect.lineTo(w, 0);
	 *   rect.lineTo(w, h);
	 *   rect.lineTo(0, h);
	 *   rect.lineTo(0, 0);
	 *   rect._x = 20;
	 *   rect._y = 20;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(0x000000, .8, 16, 16, 1, 3, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   return rect;
	 *   }
	 *   </listing>
	 */
	public get knockout () : boolean{
		return this._knockout;
	}
	public set knockout (value:boolean){
		this._knockout = value;
	}

	/**
	 * The number of times to apply the filter. The default value is BitmapFilterQuality.LOW, 
	 * which is equivalent to applying the filter once. The value BitmapFilterQuality.MEDIUM
	 * applies the filter twice; the value BitmapFilterQuality.HIGH applies it three times.
	 * Filters with lower values are rendered more quickly.
	 * 
	 *   For most applications, a quality value of low, medium, or high is sufficient. 
	 * Although you can use additional numeric values up to 15 to achieve different effects, 
	 * higher values are rendered more slowly. Instead of increasing the value of quality,
	 * you can often get a similar effect, and with faster rendering, by simply increasing the values 
	 * of the blurX and blurY properties.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>quality</code> property on an existing movie clip 
	 *   when a user clicks it.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var mc:MovieClip = createGlowFilterRectangle("GlowFilterQuality");
	 *   mc.onRelease = function() {
	 *   var filter:GlowFilter = this.filters[0];
	 *   filter.quality = 1;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createGlowFilterRectangle(name:string):MovieClip {
	 *   var rect:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   rect.beginFill(0x003366);
	 *   rect.lineTo(w, 0);
	 *   rect.lineTo(w, h);
	 *   rect.lineTo(0, h);
	 *   rect.lineTo(0, 0);
	 *   rect._x = 20;
	 *   rect._y = 20;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(0x000000, .8, 16, 16, 1, 3, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   return rect;
	 *   }
	 *   </listing>
	 */
	public get quality () : number{
		return this._quality;
	}
	public set quality (value:number){
		this._quality = value;
	}

	/**
	 * The strength of the imprint or spread. The higher the value, 
	 * the more color is imprinted and the stronger the contrast between the glow and the background. 
	 * Valid values are 0 to 255. The default is 2.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>strength</code> property on an existing movie clip 
	 *   when a user clicks it.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var mc:MovieClip = createGlowFilterRectangle("GlowFilterStrength");
	 *   mc.onRelease = function() {
	 *   var filter:GlowFilter = this.filters[0];
	 *   filter.strength = .8;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createGlowFilterRectangle(name:string):MovieClip {
	 *   var rect:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   rect.beginFill(0x003366);
	 *   rect.lineTo(w, 0);
	 *   rect.lineTo(w, h);
	 *   rect.lineTo(0, h);
	 *   rect.lineTo(0, 0);
	 *   rect._x = 20;
	 *   rect._y = 20;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(0x000000, .8, 16, 16, 1, 3, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   return rect;
	 *   }
	 *   </listing>
	 */
	public get strength () : number{
		return this._strength;
	}
	public set strength (value:number){
		this._strength = value;
	}
	
	public get blur():number 
	{
		return this._blur;
	}
	
	public get rgba():string 
	{
		return this._rgba;
	}

	/**
	 * Returns a copy of this filter object.
	 * @return	A new GlowFilter instance with all the
	 *   properties of the original GlowFilter instance.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example creates three GlowFilter objects and compares them: <code>filter_1</code>
	 *   is created by using the GlowFilter constructor; <code>filter_2</code> is created by setting it equal to 
	 *   <code>filter_1</code>; and <code>clonedFilter</code> is created by cloning <code>filter_1</code>.  Notice
	 *   that although <code>filter_2</code> evaluates as being equal to <code>filter_1</code>, <code>clonedFilter</code>,
	 *   even though it contains the same values as <code>filter_1</code>, does not.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var filter_1:GlowFilter = new GlowFilter(0x33CCFF, .8, 35, 35, 2, 3, false, false);
	 *   var filter_2:GlowFilter = filter_1;
	 *   var clonedFilter:GlowFilter = filter_1.clone();
	 *   
	 *     trace(filter_1 == filter_2);		// true
	 *   trace(filter_1 == clonedFilter);	// false
	 *   
	 *     for(var i in filter_1) {
	 *   trace("&gt;&gt; " + i + ": " + filter_1[i]);
	 *   // &gt;&gt; clone: [type Function]
	 *   // &gt;&gt; strength: 2
	 *   // &gt;&gt; blurY: 35
	 *   // &gt;&gt; blurX: 35
	 *   // &gt;&gt; knockout: false
	 *   // &gt;&gt; inner: false
	 *   // &gt;&gt; quality: 3
	 *   // &gt;&gt; alpha: 0.8
	 *   // &gt;&gt; color: 3394815
	 *   }
	 *   
	 *     for(var i in clonedFilter) {
	 *   trace("&gt;&gt; " + i + ": " + clonedFilter[i]);
	 *   // &gt;&gt; clone: [type Function]
	 *   // &gt;&gt; strength: 2
	 *   // &gt;&gt; blurY: 35
	 *   // &gt;&gt; blurX: 35
	 *   // &gt;&gt; knockout: false
	 *   // &gt;&gt; inner: false
	 *   // &gt;&gt; quality: 3
	 *   // &gt;&gt; alpha: 0.8
	 *   // &gt;&gt; color: 3394815
	 *   }
	 *   </listing>
	 *   To further demonstrate the relationships between <code>filter_1</code>, <code>filter_2</code>, and <code>clonedFilter</code>,
	 *   the following example modifies the <code>knockout</code> property of <code>filter_1</code>.  Modifying <code>knockout</code> demonstrates
	 *   that the <code>clone()</code> method creates a new instance based on the values of <code>filter_1</code> instead of pointing to 
	 *   them in reference.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var filter_1:GlowFilter = new GlowFilter(0x33CCFF, .8, 35, 35, 2, 3, false, false);
	 *   var filter_2:GlowFilter = filter_1;
	 *   var clonedFilter:GlowFilter = filter_1.clone();
	 *   
	 *     trace(filter_1.knockout);			// false
	 *   trace(filter_2.knockout);			// false
	 *   trace(clonedFilter.knockout);		// false
	 *   
	 *     filter_1.knockout = true;
	 *   
	 *     trace(filter_1.knockout);			// true
	 *   trace(filter_2.knockout);			// true
	 *   trace(clonedFilter.knockout);		// false
	 *   </listing>
	 */
	//public function clone () : flash.filters.BitmapFilter;

	/**
	 * Initializes a new GlowFilter instance with the specified parameters.
	 * @param	color	The color of the glow, in the hexadecimal format 
	 *   0xRRGGBB. The default value is 0xFF0000.
	 * @param	alpha	The alpha transparency value for the color. Valid values are 0 to 1. For example,
	 *   .25 sets a transparency value of 25%.
	 * @param	blurX	The amount of horizontal blur. Valid values are 0 to 255 (floating point). Values
	 *   that are a power of 2 (such as 2, 4, 8, 16 and 32) are optimized 
	 *   to render more quickly than other values.
	 * @param	blurY	The amount of vertical blur. Valid values are 0 to 255 (floating point). 
	 *   Values that are a power of 2 (such as 2, 4, 8, 16 and 32) are optimized 
	 *   to render more quickly than other values.
	 * @param	strength	The strength of the imprint or spread. The higher the value, 
	 *   the more color is imprinted and the stronger the contrast between the glow and the background. 
	 *   Valid values are 0 to 255.
	 * @param	quality	The number of times to apply the filter. Use the BitmapFilterQuality constants:
	 *   BitmapFilterQuality.LOWBitmapFilterQuality.MEDIUMBitmapFilterQuality.HIGHFor more information, see the description of the quality property.
	 * @param	inner	Specifies whether the glow is an inner glow. The value  true specifies
	 *   an inner glow. The value false specifies an outer glow (a glow
	 *   around the outer edges of the object).
	 * @param	knockout	Specifies whether the object has a knockout effect. The value true
	 *   makes the object's fill transparent and reveals the background color of the document.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example instantiates a new GlowFilter instance and applies
	 *   it to a flat, rectangular shape.
	 *   <listing version="2.0">
	 *   import flash.filters.GlowFilter;
	 *   
	 *     var rect:MovieClip = createRectangle(100, 100, 0x003366, "gradientGlowFilterExample");
	 *   
	 *     var color:number = 0x33CCFF;
	 *   var alpha:number = .8;
	 *   var blurX:number = 35;
	 *   var blurY:number = 35;
	 *   var strength:number = 2;
	 *   var quality:number = 3;
	 *   var inner:Boolean = false;
	 *   var knockout:Boolean = false;
	 *   
	 *     var filter:GlowFilter = new GlowFilter(color, 
	 *   alpha, 
	 *   blurX, 
	 *   blurY, 
	 *   strength, 
	 *   quality, 
	 *   inner, 
	 *   knockout);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   rect.filters = filterArray;
	 *   
	 *     function createRectangle(w:number, h:number, bgColor:number, name:string):MovieClip {
	 *   var mc:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   mc.beginFill(bgColor);
	 *   mc.lineTo(w, 0);
	 *   mc.lineTo(w, h);
	 *   mc.lineTo(0, h);
	 *   mc.lineTo(0, 0);
	 *   mc._x = 20;
	 *   mc._y = 20;
	 *   return mc;
	 *   }
	 *   </listing>
	 */
	constructor (color:number = 0xFF0000, alpha:number = 1, blurX:number = 6, blurY:number = 6, strength:number = 2, quality:number = 1, inner:boolean = false, knockout:boolean = false){
		super();
		
		this._color = color;
		this._alpha = alpha;
		if (this._alpha < 0) this._alpha = 0;
		if (this._alpha > 1) this._alpha = 1;
		this._blurX = blurX;
		this._blurY = blurY;
		this._strength = strength - 1;
		this._quality = quality;
		this._inner = inner;
		this._knockout = knockout;
		
		this._red = color >> 16 & 0xff;
		this._green = color >> 8 & 0xff;
		this._blue = color & 0xff;
		this._rgba = "rgba(" + this._red + "," + this._green + "," + this._blue + "," + this._alpha + ")";
		this._offsetX = this._offsetY = this._blur = Math.max(blurX, blurY);
	}
	
	private blurFilter(amount:number, canvas:HTMLCanvasElement):HTMLCanvasElement
	{
		amount -= 3; // adjusted to match Flash API
		
		this._offsetX = amount + this._blur;
		this._offsetY = amount + this._blur;
		
		// create bigger canvas with enough space to show all of the glow.
		this.biggerCanvas = document.createElement("canvas");
		this.biggerCanvas.width = canvas.width + this._offsetX + 20;
		this.biggerCanvas.height = canvas.height + this._offsetY + 20;
		var bgCtx:CanvasRenderingContext2D = this.biggerCanvas.getContext("2d");
		
		// fill with grey for testing only.
		//bgCtx.fillStyle = 'gainsboro';  // light grey
		//bgCtx.fillRect(0, 0, this.biggerCanvas.width, this.biggerCanvas.height);
		
		var blurDiff:number = 1 - (this._blur / 6);
		//blurDiff = 1;
		let strengthX:number = 1 + (this.strength / 20);
		let strengthY:number = 1 + (this.strength / 20);
		bgCtx.scale(strengthX, strengthY);
		bgCtx.filter = 'blur(' + this._blur / 6 + "px)";
		//bgCtx.scale(-strengthX, -strengthY);

	 	let diffX:number = Math.ceil((((canvas.width + this._offsetX + 20) / strengthX) - canvas.width) / 2);
		//console.log("diffX: " + diffX + ", strengthX: " + strengthX);

		var strengthDiff:number = 2 / this.strength;
		// draw the duplicate drawing centered in the new bigger canvas that allows space for glow.
		//bgCtx.drawImage(canvas, Math.ceil(1 - strengthX + (.5 * strengthDiff) - (1.15 * blurDiff + (.5 * strengthDiff))), Math.ceil(1 - strengthY + (.5 * strengthDiff) - (1.15 * blurDiff)));
		bgCtx.drawImage(canvas, diffX, diffX);

		return this.biggerCanvas;
	}
	
	
	public _applyFilter = (ctx:CanvasRenderingContext2D, displayObject:DisplayObject, isText:boolean = false):void =>
	{
		var bounds:Rectangle = displayObject.getFullBounds(displayObject);
		this.origImage = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		var dData:Uint8ClampedArray = this.origImage.data;
		
		this.copyCanvas = document.createElement("canvas");
		this.copyCanvas.width = bounds.width;
		this.copyCanvas.height = bounds.height;
		
		var copyCtx:CanvasRenderingContext2D = this.copyCanvas.getContext("2d");
		
		// fill with grey for testing only.
		//copyCtx.fillStyle = 'gainsboro';
		//copyCtx.fillRect(0, 0, this.copyCanvas.width, this.copyCanvas.height);
		
		this.copyData = copyCtx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		var copyDataArr:Uint8ClampedArray = this.copyData.data;
		
		// duplicate drawing as a solid color
		var len:number = dData.length;
		for (var i:number = 0; i < len; i += 4) 
		{
			var ia:number = i + 3;
			var currentAlpha:number = dData[ia];
			
			if (!this._inner) {
				if (currentAlpha !== 0) {
					copyDataArr[i] = this._red;
					copyDataArr[i + 1] = this._green;
					copyDataArr[i + 2] = this._blue;
					copyDataArr[ia] = currentAlpha;
				}
			} else {
				if (currentAlpha !== 255) {
					copyDataArr[i] = this._red;
					copyDataArr[i + 1] = this._green;
					copyDataArr[i + 2] = this._blue;
					copyDataArr[ia] = 255 - currentAlpha;
				}
			}
		}
		
		if (displayObject.cacheAsBitmap || isText)
		{
			copyCtx.putImageData(this.copyData, -((ctx.canvas.width - this.copyCanvas.width)/2), -((ctx.canvas.height - this.copyCanvas.height)/2)); // cached version
		}
		else
		{
			copyCtx.putImageData(this.copyData, -(displayObject.x + bounds.x), -(displayObject.y + bounds.y)); // no cached version	
		}
		
		//document.body.append(this.copyCanvas);

		// blur the duplicate solid color drawing
		var glowCanvas:HTMLCanvasElement = this.blurFilter(this._strength, this.copyCanvas);
		
		var gco:string;
		if (this._knockout) {
			gco = (this._inner) ? "source-in" : "source-out";
		} else {
			gco = (this._inner) ? "source-atop" : "destination-over";
		}

		var diffX:number = (glowCanvas.width - ctx.canvas.width) * 3;
		var diffY:number = (glowCanvas.height - ctx.canvas.height) * 3;
		//ctx.canvas.width = glowCanvas.width;
		//ctx.canvas.height = glowCanvas.height;
		
		ctx.save();
		ctx.globalAlpha = this._alpha;
		ctx.globalCompositeOperation = <any>gco;
		var diff:number = (glowCanvas.width - this.copyCanvas.width) / 2;
		ctx.drawImage(glowCanvas, Math.floor(bounds.x - diff), Math.floor(bounds.y - diff));
		//ctx.drawImage(glowCanvas, 0,0);
		
		
		//ctx.drawImage(glowCanvas, bounds.x - 7, bounds.y - 7); // 11.5
		
		//console.log("bounds: " + bounds.toString());
		//console.log("glowCanvas: w: " + glowCanvas.width + ", h: " + glowCanvas.height);
		//console.log("offsetX: " + this._offsetX + ", offsetY: " + this._offsetY);
		
		ctx.restore();
		
		// clear shadow blur before next redraw or else double shadow blur.
		//ctx.shadowBlur = 0;
	}
}