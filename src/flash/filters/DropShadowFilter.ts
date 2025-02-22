import { Canvas, Image, MaskFilter, Paint, Paragraph, ParagraphBuilder, Path, TextStyle } from "canvaskit-wasm";
import { config } from "process";
import { FPConfig } from "../../FPConfig";
import { ColorTransform, Rectangle } from "../geom";
import { IRenderer } from "../__native/IRenderer";
import { BitmapFilter } from "./BitmapFilter";

/**
 * The DropShadowFilter class lets you add a drop shadow to display objects.
 * The shadow algorithm is based on the same box filter that the blur filter uses. You have 
 * several options for the style of the drop shadow, including inner or outer shadow and knockout mode.
 * You can apply the filter to any display object (that is, objects that inherit from the DisplayObject class), 
 * such as MovieClip, SimpleButton, TextField, and Video objects, as well as to BitmapData objects.
 * 
 *   <p class="- topic/p ">The use of filters depends on the object to which you apply the filter:</p><ul class="- topic/ul "><li class="- topic/li ">To apply filters to display objects use the
 * <codeph class="+ topic/ph pr-d/codeph ">filters</codeph> property (inherited from DisplayObject). Setting the <codeph class="+ topic/ph pr-d/codeph ">filters</codeph> 
 * property of an object does not modify the object, and you can remove the filter by clearing the
 * <codeph class="+ topic/ph pr-d/codeph ">filters</codeph> property. </li><li class="- topic/li ">To apply filters to BitmapData objects, use the <codeph class="+ topic/ph pr-d/codeph ">BitmapData.applyFilter()</codeph> method.
 * Calling <codeph class="+ topic/ph pr-d/codeph ">applyFilter()</codeph> on a BitmapData object takes the source BitmapData object 
 * and the filter object and generates a filtered image as a result.</li></ul><p class="- topic/p ">If you apply a filter to a display object, the value of the <codeph class="+ topic/ph pr-d/codeph ">cacheAsBitmap</codeph> property of the 
 * display object is set to <codeph class="+ topic/ph pr-d/codeph ">true</codeph>. If you clear all filters, the original value of 
 * <codeph class="+ topic/ph pr-d/codeph ">cacheAsBitmap</codeph> is restored.</p><p class="- topic/p ">This filter supports Stage scaling. However, it does not support general scaling, rotation, and 
 * skewing. If the object itself is scaled (if <codeph class="+ topic/ph pr-d/codeph ">scaleX</codeph> and <codeph class="+ topic/ph pr-d/codeph ">scaleY</codeph> are 
 * set to a value other than 1.0), the filter is not scaled. It is scaled only when 
 * the user zooms in on the Stage.</p><p class="- topic/p ">A filter is not applied if the resulting image exceeds the maximum dimensions.
 * In  AIR 1.5 and Flash Player 10, the maximum is 8,191 pixels in width or height, 
 * and the total number of pixels cannot exceed 16,777,215 pixels. (So, if an image is 8,191 pixels 
 * wide, it can only be 2,048 pixels high.) In Flash Player 9 and earlier and AIR 1.1 and earlier, 
 * the limitation is 2,880 pixels in height and 2,880 pixels in width.
 * If, for example, you zoom in on a large movie clip with a filter applied, the filter is 
 * turned off if the resulting image exceeds the maximum dimensions.</p>
 * 
 *   EXAMPLE:
 * 
 *   The following example creates a yellow square and applies a drop shadow to it. 
 * The general workflow of this example is as follows:
 * <ol class="- topic/ol "><li class="- topic/li ">Declare three properties that are used to draw the square to which the 
 * filter is applied.</li><li class="- topic/li ">Create the constructor function. The constructor calls the <codeph class="+ topic/ph pr-d/codeph ">draw()</codeph> method,
 * which uses methods of the Graphics class accessed through the <codeph class="+ topic/ph pr-d/codeph ">graphics</codeph>
 * property of Sprite to draw an orange square.</li><li class="- topic/li ">In the constructor, declare a variable <codeph class="+ topic/ph pr-d/codeph ">filter</codeph> as a BitmapFilter object 
 * and assign it to the return value of a call to <codeph class="+ topic/ph pr-d/codeph ">getBitmapFilter()</codeph>.
 * The <codeph class="+ topic/ph pr-d/codeph ">getBitmapFilter()</codeph> method defines the drop shadow filter used.</li><li class="- topic/li ">Create a new Array object <codeph class="+ topic/ph pr-d/codeph ">myFilters</codeph> and add <codeph class="+ topic/ph pr-d/codeph ">filter</codeph> to
 * the array. Assign the <codeph class="+ topic/ph pr-d/codeph ">myFilters</codeph> array to the <codeph class="+ topic/ph pr-d/codeph ">filters</codeph> property of 
 * the DropShadowFilterExample object.  This applies all filters found in <codeph class="+ topic/ph pr-d/codeph ">myFilters</codeph>, which in this case
 * is only <codeph class="+ topic/ph pr-d/codeph ">filter</codeph>.</li></ol><codeblock xml:space="preserve" class="+ topic/pre pr-d/codeblock ">
 * 
 *   package {
 * import flash.display.Sprite;
 * import flash.events.Event;
 * import flash.events.MouseEvent;
 * import flash.filters.BitmapFilter;
 * import flash.filters.BitmapFilterQuality;
 * import flash.filters.DropShadowFilter;
 * 
 *   public class DropShadowFilterExample extends Sprite {
 * private var bgColor:uint = 0xFFCC00;
 * private var size:uint    = 80;
 * private var offset:uint  = 50;
 * 
 *   public function DropShadowFilterExample() {
 * draw();
 * var filter:BitmapFilter = getBitmapFilter();
 * var myFilters:Array = new Array();
 * myFilters.push(filter);
 * filters = myFilters;
 * }
 * 
 *   private function getBitmapFilter():BitmapFilter {
 * var color:number = 0x000000;
 * var angle:number = 45;
 * var alpha:number = 0.8;
 * var blurX:number = 8;
 * var blurY:number = 8;
 * var distance:number = 15;
 * var strength:number = 0.65;
 * var inner:Boolean = false;
 * var knockout:Boolean = false;
 * var quality:number = BitmapFilterQuality.HIGH;
 * return new DropShadowFilter(distance,
 * angle,
 * color,
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
export class DropShadowFilter extends BitmapFilter
{
	private paint:Paint;
	private clearPaint:Paint;
	private _alpha:number = 1;
	private _angle:number = 0;
	private _blurX:number = 0;
	private _blurY:number = 0;
	private _color:number = 0x000000;
	private _distance:number = 5;
	private _hideObject:boolean = false;
	private _inner:boolean = false;
	private _knockout:boolean = false;
	private _quality:number = 1;
	private _strength:number = 1;
	private _blur:number;
	private _rgba:string;

	/**
	 * The alpha transparency value for the shadow color. Valid values are 0.0 to 1.0. 
	 * For example,
	 * .25 sets a transparency value of 25%. The default value is 1.0.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>alpha</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowAlpha");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.alpha = .4;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get alpha():number { return this._alpha; }
	public set alpha(value:number) { this._alpha = value; }

	/**
	 * The angle of the shadow. Valid values are 0 to 360 degrees(floating point). The
	 * default value is 45.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>angle</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowAngle");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.angle = 135;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get angle():number { return this._angle; }
	public set angle(value:number) { this._angle = value; }

	/**
	 * The amount of horizontal blur. Valid values are 0 to 255.0(floating point). The
	 * default value is 4.0.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>blurX</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowBlurX");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.blurX = 40;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get blurX():number { return this._blurX; }
	public set blurX(value:number) { this._blurX = value; }

	/**
	 * The amount of vertical blur. Valid values are 0 to 255.0(floating point). The
	 * default value is 4.0.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>blurY</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowBlurY");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.blurY = 40;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get blurY():number { return this._blurY; }
	public set blurY(value:number) { this._blurY = value; }

	/**
	 * The color of the shadow. Valid values are in hexadecimal format 0xRRGGBB. The 
	 * default value is 0x000000.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>color</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowColor");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.color = 0xFF0000;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get color():number { return this._color; }
	public set color(value:number) { this._color = value; }

	/**
	 * The offset distance for the shadow, in pixels. The default
	 * value is 4.0(floating point).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>distance</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowDistance");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.distance = 40;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get distance():number { return this._distance; }
	public set distance(value:number) { this._distance = value; }


	/**
	 * Indicates whether or not the object is hidden. The value true 
	 * indicates that the object itself is not drawn; only the shadow is visible.
	 * The default is false(the object is shown).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>hideObject</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowHideObject");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.hideObject = true;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get hideObject():boolean { return this._hideObject; }
	public set hideObject(value:boolean) { this._hideObject = value; }

	/**
	 * Indicates whether or not the shadow is an inner shadow. The value true indicates
	 * an inner shadow. The default is false, an outer shadow(a
	 * shadow around the outer edges of the object).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>inner</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowInner");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.inner = true;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get inner():boolean { return this._inner; }
	public set inner(value:boolean) { this._inner = value; }

	/**
	 * Applies a knockout effect(true), which effectively 
	 * makes the object's fill transparent and reveals the background color of the document. The 
	 * default is false(no knockout).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>knockout</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowKnockout");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.knockout = true;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get knockout():boolean { return this._knockout; }
	public set knockout(value:boolean) { this._knockout = value; }

	/**
	 * The number of times to apply the filter. 
	 * The default value is BitmapFilterQuality.LOW, which is equivalent to applying
	 * the filter once. The value BitmapFilterQuality.MEDIUM applies the filter twice;
	 * the value BitmapFilterQuality.HIGH applies it three times. Filters with lower values
	 * are rendered more quickly.
	 * 
	 *   For most applications, a quality value of low, medium, or high is sufficient. 
	 * Although you can use additional numeric values up to 15 to achieve different effects,
	 * higher values are rendered more slowly. Instead of increasing the value of quality,
	 * you can often get a similar effect, and with faster rendering, by simply increasing
	 * the values of the blurX and blurY properties.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>quality</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowQuality");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.quality = 0;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get quality():number { return this._quality; }
	public set quality(value:number) { this._quality = value; }

	/**
	 * The strength of the imprint or spread. The higher the value, 
	 * the more color is imprinted and the stronger the contrast between the shadow and the background. 
	 * Valid values are from 0 to 255.0. The default is 1.0.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example changes the <code>strength</code> property on an existing MovieClip 
	 *   when a user clicks on it.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   var mc:MovieClip = createDropShadowRectangle("DropShadowStrength");
	 *   mc.onRelease = function() {
	 *   var filter:DropShadowFilter = this.filters[0];
	 *   filter.strength = .6;
	 *   this.filters = new Array(filter);
	 *   }
	 *   
	 *     function createDropShadowRectangle(name:string):MovieClip {
	 *   var art:MovieClip = this.createEmptyMovieClip(name, this.getNextHighestDepth());
	 *   var w:number = 100;
	 *   var h:number = 100;
	 *   art.beginFill(0x003366);
	 *   art.lineTo(w, 0);
	 *   art.lineTo(w, h);
	 *   art.lineTo(0, h);
	 *   art.lineTo(0, 0);
	 *   art._x = 20;
	 *   art._y = 20;
	 *   
	 *     var filter:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filterArray:Array = new Array();
	 *   filterArray.push(filter);
	 *   art.filters = filterArray;
	 *   return art;
	 *   }
	 *   </listing>
	 */
	public get strength():number { return this._strength; }
	public set strength(value:number) { this._strength = value; }
	public get blur():number { return this._blur; }

	/**
	 * Returns a copy of this filter object.
	 * @return	A new DropShadowFilter instance with all the
	 *   properties of the original DropShadowFilter instance.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example creates three DropShadowFilter objects and compares them.  <code>filter_1</code>
	 *   is created using the DropShadowFilter construtor.  <code>filter_2</code> is created by setting it equal to 
	 *   <code>filter_1</code>.  And, <code>clonedFilter</code> is created by cloning <code>filter_1</code>.  Notice
	 *   that while <code>filter_2</code> evaluates as being equal to <code>filter_1</code>, <code>clonedFilter</code>,
	 *   even though it contains the same values as <code>filter_1</code>, does not.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   
	 *     var filter_1:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filter_2:DropShadowFilter = filter_1;
	 *   var clonedFilter:DropShadowFilter = filter_1.clone();
	 *   
	 *     trace(filter_1 == filter_2);		// true
	 *   trace(filter_1 == clonedFilter);	// false
	 *   
	 *     for(var i in filter_1) {
	 *   trace("&gt;&gt; " + i + ": " + filter_1[i]);
	 *   // &gt;&gt; clone: [type Function]
	 *   // &gt;&gt; hideObject: false
	 *   // &gt;&gt; strength: 1
	 *   // &gt;&gt; blurY: 16
	 *   // &gt;&gt; blurX: 16
	 *   // &gt;&gt; knockout: false
	 *   // &gt;&gt; inner: false
	 *   // &gt;&gt; quality: 3
	 *   // &gt;&gt; alpha: 0.8
	 *   // &gt;&gt; color: 0
	 *   // &gt;&gt; angle: 45
	 *   // &gt;&gt; distance: 15
	 *   }
	 *   
	 *     for(var i in clonedFilter) {
	 *   trace("&gt;&gt; " + i + ": " + clonedFilter[i]);
	 *   // &gt;&gt; clone: [type Function]
	 *   // &gt;&gt; hideObject: false
	 *   // &gt;&gt; strength: 1
	 *   // &gt;&gt; blurY: 16
	 *   // &gt;&gt; blurX: 16
	 *   // &gt;&gt; knockout: false
	 *   // &gt;&gt; inner: false
	 *   // &gt;&gt; quality: 3
	 *   // &gt;&gt; alpha: 0.8
	 *   // &gt;&gt; color: 0
	 *   // &gt;&gt; angle: 45
	 *   // &gt;&gt; distance: 15
	 *   }
	 *   </listing>
	 *   To further demonstrate the relationships between <code>filter_1</code>, <code>filter_2</code>, and <code>clonedFilter</code>
	 *   the example below modifies the <code>knockout</code> property of <code>filter_1</code>.  Modifying <code>knockout</code> demonstrates
	 *   that the <code>clone()</code> method creates a new instance based on values of the <code>filter_1</code> instead of pointing to 
	 *   them in reference.
	 *   <listing version="2.0">
	 *   import flash.filters.DropShadowFilter;
	 *   
	 *     var filter_1:DropShadowFilter = new DropShadowFilter(15, 45, 0x000000, .8, 16, 16, 1, 3, false, false, false);
	 *   var filter_2:DropShadowFilter = filter_1;
	 *   var clonedFilter:DropShadowFilter = filter_1.clone();
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
	/*override*/ public clone():BitmapFilter
	{ 
		return null; 
	}

	/**
	 * Creates a new DropShadowFilter instance with the specified parameters.
	 * @param	distance	Offset distance for the shadow, in pixels.
	 * @param	angle	Angle of the shadow, 0 to 360 degrees(floating point).
	 * @param	color	Color of the shadow, in hexadecimal format 
	 *   0xRRGGBB. The default value is 0x000000.
	 * @param	alpha	Alpha transparency value for the shadow color. Valid values are 0.0 to 1.0. 
	 *   For example,
	 *   .25 sets a transparency value of 25%.
	 * @param	blurX	Amount of horizontal blur. Valid values are 0 to 255.0(floating point).
	 * @param	blurY	Amount of vertical blur. Valid values are 0 to 255.0(floating point).
	 * @param	strength	The strength of the imprint or spread. The higher the value, 
	 *   the more color is imprinted and the stronger the contrast between the shadow and the background. 
	 *   Valid values are 0 to 255.0.
	 * @param	quality	The number of times to apply the filter. Use the BitmapFilterQuality constants:
	 *   BitmapFilterQuality.LOWBitmapFilterQuality.MEDIUMBitmapFilterQuality.HIGHFor more information about these values, see the quality property description.
	 * @param	inner	Indicates whether or not the shadow is an inner shadow. A value of true specifies
	 *   an inner shadow. A value of false specifies an outer shadow(a
	 *   shadow around the outer edges of the object).
	 * @param	knockout	Applies a knockout effect(true), which effectively 
	 *   makes the object's fill transparent and reveals the background color of the document.
	 * @param	hideObject	Indicates whether or not the object is hidden. A value of true 
	 *   indicates that the object itself is not drawn; only the shadow is visible.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @example	The following example creates a new DropShadowFilter object
	 *   with the default values:
	 *   <pre xml:space="preserve" class="- topic/pre ">
	 *   myFilter = new flash.filters.DropShadowFilter()
	 *   </pre>
	 */
	constructor(distance:number = 4, angle:number = 45, color:number = 0, alpha:number = 1, blurX:number = 4, blurY:number = 4, strength:number = 1, quality:number = 1, inner:boolean | number = false, knockout:boolean | number = false, hideObject:boolean | number = false){
		super();

		this._distance = distance;
		this._angle = angle;
		this._color = color;
		this._alpha = alpha;
		this._blurX = blurX;
		this._blurY = blurY;
		this._strength = strength;
		this._quality = quality;
		this._inner = (inner == true || inner == 1);
		this._knockout = (knockout == true || knockout == 1);
		this._hideObject = (hideObject == true || hideObject == 1);
		
		var radians:number = Math.PI / 180 * angle;
		this._offsetX = (distance - 1) * Math.cos(radians);
		this._offsetY = (distance - 1) * Math.sin(radians);
		this._blur = Math.max(blurX, blurY);
		this._rgba = "rgba(" + (color >> 16 & 0xff) + "," + (color >> 8 & 0xff) + "," + (color & 0xff) + "," + alpha + ")";

		let maskFilter:MaskFilter = FPConfig.canvasKit.MaskFilter.MakeBlur(
			FPConfig.canvasKit.BlurStyle.Normal,
			this._blur,
			false
		);

		
		this.paint = new FPConfig.canvasKit.Paint();
		//this.paint.setBlendMode(FPConfig.canvasKit.BlendMode.DstOver);

		this.clearPaint = new FPConfig.canvasKit.Paint();
		this.clearPaint.setColor([0, 0, 0, 0]);
		
		this.paint.setStyle(FPConfig.canvasKit.PaintStyle.Fill);  //TODO correct for Stroke or Fill
		this.paint.setColor((FPConfig.renderer as IRenderer).getRGBAColor(color, alpha, new ColorTransform()));
		this.paint.setMaskFilter(maskFilter);

	}
	
	public _applyFilter(ctx:Canvas, path:Path | CanvasImageSource | Paragraph, blurPaint?:Paint, paragraphBuilder?:ParagraphBuilder, textStyle?:TextStyle, paraText?:string):Paragraph
	{
		const m = FPConfig.canvasKit.Matrix.translated(this._offsetX + 1, this._offsetY + 1);
		let filterParagraph:Paragraph;

		ctx.concat(m);
		
		if (path instanceof FPConfig.canvasKit.Path)
		{
			ctx.drawPath(path as Path, this.paint);
		}
		else if (path instanceof HTMLCanvasElement)
		{
			const padding:number = 40; // TODO adjust by filter size
			const halfPad:number = padding / 2;
			// created padded canvas
			const copyCanvas = document.createElement('canvas') as HTMLCanvasElement;
			copyCanvas.width = (path as HTMLCanvasElement).width + padding;
			copyCanvas.height = (path as HTMLCanvasElement).height + padding;
			const copyCtx = copyCanvas.getContext('2d');
			// fill canvas with solid color
			copyCtx.fillStyle = this._rgba;
			copyCtx.globalCompositeOperation = "color";
			copyCtx.fillRect(0, 0, copyCanvas.width, copyCanvas.height);
			// blur canvas and crop to image
			copyCtx.globalCompositeOperation = "destination-in";
			copyCtx.filter = 'blur(' + this.blur + 'px)';
			copyCtx.drawImage(path as HTMLCanvasElement, halfPad, halfPad);
			copyCtx.globalCompositeOperation = "source-over";
			// draw final shadow image
			const newImg:Image = FPConfig.canvasKit.MakeImageFromCanvasImageSource(copyCanvas);
			ctx.drawImage(newImg, -halfPad, -halfPad);
			newImg.delete();
		}
		else
		{
			paragraphBuilder.reset();
			paragraphBuilder.pushPaintStyle(
                textStyle,
                this.paint,
                this.clearPaint
            );
			
			paragraphBuilder.addText(paraText);
			filterParagraph = paragraphBuilder.build();
			filterParagraph.layout(textStyle.fontSize * paraText.length);
		}
		let invertedMat = FPConfig.canvasKit.Matrix.invert(m) || m;
		ctx.concat(invertedMat);

		return filterParagraph;
		
		/* const m = FPConfig.canvasKit.Matrix.translated(this._offsetX + 1, this._offsetY + 1);
		const lightPos = [0, 0, 100];
		const lightRadius = 10;

		ctx.concat(m);
		ctx.drawShadow(
			path as Path, 
			m,
			lightPos, 
			lightRadius, 
			(FPConfig.renderer as IRenderer).getRGBAColor(this._color, this.alpha, new ColorTransform()), 
			(FPConfig.renderer as IRenderer).getRGBAColor(this._color, this._alpha, new ColorTransform()),
			FPConfig.canvasKit.ShadowGeometricOnly
			)
		
		let invertedMat = FPConfig.canvasKit.Matrix.invert(m) || m;
        ctx.concat(invertedMat); */
	}
}