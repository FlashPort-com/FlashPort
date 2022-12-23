import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";
import { BitmapData } from "./BitmapData";
import { FlashPort } from "../../FlashPort";
import { BlendMode } from "./BlendMode";

import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { MouseEvent } from "../events/MouseEvent";

export class Shape extends DisplayObject
{
	public graphics:Graphics = new Graphics;
	
	private _cacheCanvas:HTMLCanvasElement;
	private _cacheCTX:CanvasRenderingContext2D;
	private _cacheImage:BitmapData;
	private _cacheWidth:number = 0;
	private _cacheHeight:number = 0;
	private _cacheBounds:Rectangle = new Rectangle();
	
	constructor(){
		super();
	}
	
	/*override*/
	public __update = (ctx:CanvasRenderingContext2D, offsetX:number = 0, offsetY:number = 0, parentIsCached:boolean = false):void =>
	{
		var childOffsetX:number = (this._cacheBounds.width - this._cacheBounds.right - this.x);
		var childOffsetY:number = (this._cacheBounds.height - this._cacheBounds.bottom - this.y);
		
		if (!this._off && this.visible && this.graphics.graphicsData.length && !this._parentCached)
		{
			if (this.filters.length && !this._cacheAsBitmap && !parentIsCached) this.cacheAsBitmap = true;
			
			var mat:Matrix = this.transform.concatenatedMatrix.clone();
			var colorTrans:ColorTransform = this.transform.concatenatedColorTransform;
			
			if (this.cacheAsBitmap && !this.parent.cacheAsBitmap && !parentIsCached)
			{
				FlashPort.renderer.renderImage(ctx, this._cacheImage, mat, this.blendMode, colorTrans, -this.x - childOffsetX, -this.y - childOffsetY);
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
					}
					else
					{
						mat = this.transform.matrix.clone();
						mat.concat(this.parent.transform.matrix);
						mat.a = this.scaleX;
						mat.d = this.scaleY;
						//mat.scale(this.scaleX, this.scaleY);
						mat.translate(this.x / 2, this.y / 2);
					}
				}
				
				this.graphics.draw(ctx, mat, this.blendMode, colorTrans);
				if (this.mask) ctx.restore();
				this.ApplyFilters(ctx, this.graphics.lastFill != null, this.graphics.lastStroke != null);
			}
		}
		
		this._parentCached = parentIsCached;
	}
	
	/*override*/
	public set cacheAsBitmap(value:boolean) 
	{
		this._cacheAsBitmap = value;
		
		if (this.cacheAsBitmap)
		{
			if (!this._cacheImage) this._cacheImage = new BitmapData(1, 1);
			
			this._cacheBounds = this.getFullBounds(this);
			this._cacheBounds.inflate(50, 50); // add extra padding for filters.  TODO make exact
			
			this._cacheCanvas = document.createElement("canvas");
			this._cacheCanvas.width = this._cacheWidth = Math.ceil(this._cacheBounds.width); // TODO Add padding for Dropshadow
			this._cacheCanvas.height = this._cacheHeight = Math.ceil(this._cacheBounds.height);
			this._cacheCTX = (<CanvasRenderingContext2D>this._cacheCanvas.getContext('2d') );
			if (FlashPort.debug)
			{
				this._cacheCTX.fillStyle = "rgba(255,0,0,.5)";
				this._cacheCTX.fillRect(0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
			}
			
			// reset alpha before drawing
			var currAlpha:number = this.alpha;
			this.alpha = 1;
			
			var mat:Matrix = this.transform.concatenatedMatrix.clone();
			mat.scale((!this.parent ? 1 : this.scaleX) / mat.a, (!this.parent ? 1 : this.scaleY) / mat.d);
			// offsets to center the drawn graphics
			mat.tx = -this._cacheBounds.left;
			mat.ty = -this._cacheBounds.top;
			this.graphics.draw(this._cacheCTX, mat, this.blendMode, this.transform.concatenatedColorTransform);
			// reset alpha
			this.alpha = currAlpha;

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

	/*override*/
	public get cacheAsBitmap():boolean
	{
		return this._cacheAsBitmap;
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