import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { Graphics } from "./Graphics";
import { BitmapData } from "./BitmapData";
import { DisplayObject } from "./DisplayObject";
import { Stage } from "./Stage";
import { FlashPort } from "../../FlashPort";
import { BlendMode } from "./BlendMode";

import { AEvent } from "../events/AEvent";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { MouseEvent } from "../events/MouseEvent";

export class Sprite extends DisplayObjectContainer
{
	public static __dragInstance:Sprite;
	public static __dragFunction:Function;
	public graphics:Graphics = new Graphics();
	private _downX:number;
	private _downY:number;
	private _dragRect:Rectangle;
	private _dragLockCenter:boolean;
	
	private _cacheCanvas:HTMLCanvasElement;
	private _cacheCTX:CanvasRenderingContext2D;
	private _cacheImage:BitmapData;
	private _cacheOffsetX:number = 0;
	private _cacheOffsetY:number = 0;
	private _cacheWidth:number = 0;
	private _cacheHeight:number = 0;
	private _buttonMode:boolean = false;
	private _useHandCursor:boolean = false;
	
	private cacheBounds:Rectangle = new Rectangle();
	
	constructor()
	{
		super();
		
		DisplayObject.initStage = Stage.instance;
		this.initDisplayObjectStage();
	}
	
	public get buttonMode():boolean  { return this._buttonMode; }
	
	public set buttonMode(value:boolean)  
	{
		this._buttonMode = value;
	}
	
	public startDrag(lockCenter:boolean = false, bounds:Rectangle = null):void  
	{
		this._dragLockCenter = lockCenter;
		this._dragRect = bounds;
		this._downX = this.mouseX;
		this._downY = this.mouseY;
		Sprite.__dragInstance = this;
		Sprite.__dragFunction = this.handleDragMove;
		Sprite.__dragInstance.stage.addEventListener(MouseEvent.MOUSE_MOVE, Sprite.__dragFunction);
	}
	
	public stopDrag():void  
	{
		Sprite.__dragInstance.stage.removeEventListener(MouseEvent.MOUSE_MOVE, Sprite.__dragFunction);
	}
	
	public startTouchDrag(touchPointID:number, lockCenter:boolean = false, bounds:Rectangle = null):void  { }
	
	public stopTouchDrag(touchPointID:number):void  {/**/ }
	
	public get dropTarget():DisplayObject  { return null; }
	
	public get hitArea():Sprite  { return null; }
	
	public set hitArea(param1:Sprite)  {/**/ }
	
	public get useHandCursor():boolean  { return this._useHandCursor; }
	
	public set useHandCursor(value:boolean)  { this._useHandCursor = value; }
	
	//public function get soundTransform() : SoundTransform;
	
	//public function set soundTransform(param1:SoundTransform) : void;
	
	public set cacheAsBitmap(value:boolean) 
	{
		super.cacheAsBitmap = value;
		
		if (value)
		{
			if (!this._cacheImage) this._cacheImage = new BitmapData(1, 1);
			this.cacheBounds = this.getFullBounds(this);
			this.cacheBounds.inflate(50, 50); // add extra padding for filters.  TODO make exact
			
			this._cacheCanvas = document.createElement("canvas");
			/*var oc:* = new window['OffscreenCanvas'](500, 500);
			var ocCTX:* = oc.getContext("2d");*/
			
			this._cacheCanvas.width = this._cacheWidth = Math.ceil(this.cacheBounds.width); // TODO add filter padding
			this._cacheCanvas.height = this._cacheHeight = Math.ceil(this.cacheBounds.height);
			this._cacheCTX = this._cacheCanvas.getContext('2d') as CanvasRenderingContext2D;
			
			if (this.name == "circle")
			{
				//this._cacheCTX.fillStyle = "rgba(255, 255, 255, .25)";
				//this._cacheCTX.fillRect(0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
			}
			
			// reset alpha before drawing
			var currAlpha:number = this.alpha;
			var currRotation:number = this.rotation;
			this.alpha = 1;				
			this.rotation = 0;
			
			this.__update(this._cacheCTX, this._cacheOffsetX, this._cacheOffsetY);
			
			this.rotation = currRotation;
			this.alpha = currAlpha;
			
			this._cacheImage.image = this._cacheCanvas;
			
			this.updateTransforms();
		}
		else
		{
			this._cacheCanvas = null;
			this._cacheCTX = null;
		}
	}

	public get cacheAsBitmap():boolean
	{
		return this._cacheAsBitmap;
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
	
	public __getRect = ():Rectangle =>
	{
		return this.graphics.bound;
	}
	
	public __update(ctx:CanvasRenderingContext2D, offsetX:number = 0, offsetY:number = 0, parentIsCached:boolean = false):void
	{
		var bounds:Rectangle = this.cacheBounds;
		var gOffsetX:number = parentIsCached ? offsetX : -bounds.left;
		var gOffsetY:number = parentIsCached ? offsetY : -bounds.top;
		var childOffsetX:number = (bounds.width - bounds.right - this.x);
		var childOffsetY:number = (bounds.height - bounds.bottom - this.y);
		
		if (!this._off && this.visible && (this.graphics.graphicsData.length || this.numChildren) && !this._parentCached)
		{
			if (this._blurFilter) this._blurFilter._applyFilter(ctx);
			
			if (this.filters.length && !this._cacheAsBitmap && !(this.parent && this.parent.cacheAsBitmap) && !this._parentCached && !parentIsCached)
			{
				this.cacheAsBitmap = true;
			} 
			
			if (this._cacheAsBitmap && this._childrenCached && !parentIsCached) 
			{
				FlashPort.renderer.renderImage(ctx, this._cacheImage, this.transform.concatenatedMatrix, this.blendMode, this.transform.concatenatedColorTransform, -this.x - childOffsetX, -this.y - childOffsetY);
			}
			else
			{
				this.transform.updateColorTransforms();
				
				if (this.mask)
				{
					var mat:Matrix = this.mask.transform.concatenatedMatrix.clone();
					if (parentIsCached)
					{
						mat.tx += gOffsetX;
						mat.ty += gOffsetY;
						mat.scale((!this.parent ? 1 : this.scaleX) / mat.a, (!this.parent ? 1 : this.scaleY) / mat.d);
					}
					
					ctx.save();
					this.mask['graphics'].draw(ctx, mat, BlendMode.NORMAL, new ColorTransform());
					ctx.clip();
				}
				
				mat = this.transform.concatenatedMatrix.clone();
				if (parentIsCached)
				{
					//mat.scale(scaleX, scaleY);
					mat.translate(gOffsetX, gOffsetY);
				}
				
				if (this._cacheAsBitmap && !this._childrenCached)
				{
					mat.scale((!this.parent ? 1 : this.scaleX) / mat.a, (!this.parent ? 1 : this.scaleY) / mat.d);
					mat.tx = gOffsetX;
					mat.ty = gOffsetY;
					this.graphics.draw(ctx, mat, this.blendMode, this.transform.concatenatedColorTransform);
				}
				else
				{
					this.graphics.draw(ctx, mat, this.blendMode, this.transform.concatenatedColorTransform, this._cacheAsBitmap, this._cacheImage);
				}
				
				this.ApplyFilters(ctx, this.graphics.lastFill != null, this.graphics.lastStroke != null);  // TODO probably move after restore()
			}
		}
		
		let firstCache:boolean = (this._cacheAsBitmap && !this._childrenCached);
		if ((!this._cacheAsBitmap && !this._off) || (parentIsCached && !this._parentCached) || firstCache)
		{
			super.__update(ctx, (this._cacheAsBitmap ? childOffsetX : offsetX), (this._cacheAsBitmap ? childOffsetY : offsetY), (parentIsCached || firstCache));
		}
		
		if (firstCache) this._childrenCached = true;
		this._parentCached = parentIsCached;
		if (this.mask) ctx.restore();
		ctx.filter = 'none';
	}
	
	/*override*/ protected __doMouse = (e:MouseEvent):DisplayObject =>
	{
		Stage.instance.canvas.style.cursor = "default";

		if (this.mouseEnabled && this.visible && !this._off) 
		{
			var inMaskBounds:boolean = true;
			var hitObject:DisplayObject = null;
			
			if (this.mask && !this.mask.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) inMaskBounds = false;
			
			var obj:DisplayObject = super.__doMouse(e);	
			if (obj)
			{
				hitObject = this.mouseChildren ? obj : this;
			}
			else
			{
				if (this.hitTestPoint(this.stage.mouseX, this.stage.mouseY))
				{
					hitObject = this;
				}
			}
			
			if (hitObject && this.buttonMode) Stage.instance.canvas.style.cursor = this._useHandCursor ? "grab" : "pointer";
			
			if (!inMaskBounds) hitObject = null;
			
			return hitObject;
		}
		
		
		return null;
	}
	
	/*override*/ public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
	{
		if (!this.graphics || !this.graphics.bound) return false;
		var rect:Rectangle = this.graphics.bound;
		var gToL:Point  = this.globalToLocal(new Point(x, y));
		return rect.containsPoint(gToL);
	}
	
	public addEventListener = (type:string, listener:Function, useCapture:boolean = false, priority:number = 0, useWeakReference:boolean = false):void =>
	{
		if (type == AEvent.ENTER_FRAME && this instanceof Sprite){
			Stage.instance.__enterframeSprites.push(this);
		}
		
		var funcs:any[] = this.listeners[type] = this.listeners[type] || [];
		var i:number = funcs.indexOf(listener);
		if (i != -1) funcs.splice(i, 1);
		funcs.push(listener);
	}
	
	private handleDragMove = (e:MouseEvent):void =>
	{
		if (this._dragLockCenter)
		{
			this.x = this.parent.mouseX - (this.width / 2);
			this.y = this.parent.mouseY - (this.height / 2);
		}
		else
		{
			this.x = this.parent.mouseX - this._downX;
			this.y = this.parent.mouseY - this._downY;
		}
		
		if (this._dragRect)
		{
			if (this.x < this._dragRect.x) this.x = this._dragRect.x;
			if (this.x > this._dragRect.x + this._dragRect.width) this.x = this._dragRect.x + this._dragRect.width;
			if (this.y < this._dragRect.y) this.y = this._dragRect.y;
			if (this.y > this._dragRect.y + this._dragRect.height) this.y = this._dragRect.y + this._dragRect.height;
		}
	}
}