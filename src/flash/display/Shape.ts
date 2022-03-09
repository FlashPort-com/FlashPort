import { DisplayObject } from "./DisplayObject.js";
import { Graphics } from "./Graphics.js";
import { BitmapData } from "./BitmapData.js";
import { FlashPort } from "../../FlashPort.js";
import { BlendMode } from "./BlendMode.js";

import { ColorTransform } from "../geom/ColorTransform.js";
import { Matrix } from "../geom/Matrix.js";
import { Point } from "../geom/Point.js";
import { Rectangle } from "../geom/Rectangle.js";
import { MouseEvent } from "../events/MouseEvent.js";

export class Shape extends DisplayObject
{
	public graphics:Graphics = new Graphics;
	
	private _cacheCanvas:HTMLCanvasElement;
	private _cacheCTX:CanvasRenderingContext2D;
	private _cacheImage:BitmapData;
	private _cacheMatrix:Matrix;
	private _cacheOffsetX:number = 0;
	private _cacheOffsetY:number = 0;
	private _cacheWidth:number = 0;
	private _cacheHeight:number = 0;
	
	constructor(){
		super();
	}
	
	/*override*/ public __update = (ctx:CanvasRenderingContext2D, offsetX:number = 0, offsetY:number = 0, parentIsCached:boolean = false):void =>
	{
		if (!this._off && this.visible && this.graphics.graphicsData.length && !this._parentCached)
		{
			if (this.filters.length && !this.cacheAsBitmap && !this.parent.cacheAsBitmap) this.cacheAsBitmap = true;
			
			var mat:Matrix = this.transform.concatenatedMatrix.clone();
			var colorTrans:ColorTransform = this.transform.concatenatedColorTransform;
			
			if (this.cacheAsBitmap && !this.parent.cacheAsBitmap && !parentIsCached)
			{
				FlashPort.renderer.renderImage(ctx, this._cacheImage, mat, this.blendMode, colorTrans, -this.x - this._cacheOffsetX, -this.y - this._cacheOffsetY);
			}
			else
			{
				// handle masks
				if (this.mask)
				{
					ctx.save();
					this.mask['graphics'].draw(ctx, this.mask.transform.concatenatedMatrix, BlendMode.NORMAL, new ColorTransform());
					ctx.clip();
				}
				
				if (parentIsCached)
				{
					if (!this.parent.parent)
					{
						//mat.scale(scaleX / parent.scaleX, scaleY / parent.scaleY);
						mat.a = this.scaleX;
						mat.d = this.scaleY;
						mat.translate(offsetX, offsetY);
					}
					else
					{
						mat.scale(this.scaleX, this.scaleY);
						mat.translate(offsetX, offsetY);
					}
				}
				
				this.graphics.draw(ctx, mat, this.blendMode, colorTrans);
				if (this.mask) ctx.restore();
				this.ApplyFilters(ctx, this.graphics.lastFill != null, this.graphics.lastStroke != null);
			}
		}
		
		this._parentCached = parentIsCached;
	}
	
	/*override*/ public set cacheAsBitmap(value:boolean) 
	{
		this._cacheAsBitmap = value;
		
		if (this.cacheAsBitmap)
		{
			if (!this._cacheImage) this._cacheImage = new BitmapData(1, 1);
			
			var bounds:Rectangle = this.getFullBounds(this);
			//if (name == "inner_frame") trace("Shape bounds: " + bounds);
			this._cacheCanvas = document.createElement("canvas");
			this._cacheCanvas.width = this._cacheWidth = Math.ceil(bounds.width); // TODO Add padding for Dropshadow
			this._cacheCanvas.height = this._cacheHeight = Math.ceil(bounds.height);
			this._cacheCTX = (<CanvasRenderingContext2D>this._cacheCanvas.getContext('2d') );
			if (FlashPort.debug)
			{
				this._cacheCTX.fillStyle = "rgba(255,0,0,.5)";
				this._cacheCTX.fillRect(0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
			}
			
			// offsets to center the drawn graphics
			this._cacheOffsetX = -bounds.left;
			this._cacheOffsetY = -bounds.top;
			//if (name == "inner_frame") trace("Shape Offset: " + _cacheOffsetX + ", " + _cacheOffsetY);
			// reset alpha before drawing
			var currAlpha:number = this.alpha;
			this.alpha = 1;
			
			var mat:Matrix = this.transform.concatenatedMatrix.clone();
			mat.scale((!this.parent ? 1 : this.scaleX) / mat.a, (!this.parent ? 1 : this.scaleY) / mat.d);
			mat.tx = this._cacheOffsetX;
			mat.ty = this._cacheOffsetY;
			this.graphics.draw(this._cacheCTX, mat, this.blendMode, this.transform.concatenatedColorTransform);
			
			this.alpha = currAlpha;
			
			this._cacheOffsetX = bounds.left;
			this._cacheOffsetY = bounds.top;
			
			//if (parent.name == "startShortcut" && name == "rightArrow") trace("Shape startShortcut:  _cacheOffsetX: " + _cacheOffsetX + ", _cacheOffsetY: " + _cacheOffsetY + ", x: " + x + ", y: " + y, bounds);
			
			this._cacheImage.image = this._cacheCanvas;
			
			this.ApplyFilters(this._cacheCTX, this.graphics.lastFill != null, this.graphics.lastStroke != null);
			this.updateTransforms();
		}
		else
		{
			this._cacheCanvas = null;
			this._cacheCTX = null;
		}
	}
	
	/*override*/ protected __doMouse = (e:MouseEvent):DisplayObject =>
	{
		if (this.visible) 
		{
			if (this.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) {
				return this;
			}
		}
		return null;
	}
	
	public get cacheImage():BitmapData 
	{
		return this._cacheImage;
	}
	
	public get cacheOffsetX():number 
	{
		return this._cacheOffsetX;
	}
	
	public get cacheOffsetY():number 
	{
		return this._cacheOffsetY;
	}
	
	public get cacheWidth():number 
	{
		return this._cacheWidth;
	}
	
	
	public get cacheHeight():number 
	{
		return this._cacheHeight;
	}
	
	/*override*/ public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
	{
		var rect:Rectangle = this.getFullBounds(this);
		var gToL:Point  = this.globalToLocal(new Point(x, y));
		return rect.containsPoint(gToL);
	}
	
	/*override*/ public __getRect = ():Rectangle =>
	{
		return this.graphics.bound;
	}
}