import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { Graphics } from "./Graphics";
import { BitmapData } from "./BitmapData";
import { DisplayObject } from "./DisplayObject";
import { Stage } from "./Stage";
import { AEvent } from "../events/AEvent";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { MouseEvent } from "../events/MouseEvent";
import { Canvas, Path } from "canvaskit-wasm";
import { BlendMode } from "./BlendMode";
import { ColorTransform } from "../geom/ColorTransform";
import { GraphicsPath } from "./GraphicsPath";
import { FPConfig } from "../../FPConfig";
import { BitmapFilter } from "../filters";

export class Sprite extends DisplayObjectContainer
{
	public static __dragInstance:Sprite;
	public static __dragFunction:Function;
	public graphics:Graphics = new Graphics();
	private _downX:number;
	private _downY:number;
	private _dragRect:Rectangle;
	private _dragLockCenter:boolean;
	private _cacheImage:BitmapData;
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
		this._cacheAsBitmap = value;
	}

	public get cacheAsBitmap():boolean
	{
		return this._cacheAsBitmap;
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
	
	public __update(ctx:Canvas, offsetX:number = 0, offsetY:number = 0, filters: BitmapFilter[] = []):void
	{
		if (!this._off && this.visible && (this.graphics.graphicsData.length || this.numChildren))
		{
			this.transform.updateColorTransforms();
			let mat:Matrix = this.transform.concatenatedMatrix;
			let path:Path;
			
			if (this.mask)
			{
				var maskMat:Matrix = this.mask.transform.concatenatedMatrix.clone();
				ctx.save();
				this.mask['graphics'].draw(ctx, maskMat, BlendMode.NORMAL, new ColorTransform(), []);
				path = (this.mask['graphics'].lastPath as GraphicsPath).path;
				let pathMat:number[] = [maskMat.a, maskMat.c, maskMat.tx, maskMat.b, maskMat.d, maskMat.ty, 0, 0, 1];
				path.transform(pathMat)
				path.setFillType(FPConfig.canvasKit.FillType.Winding);
				ctx.clipPath(path, FPConfig.canvasKit.ClipOp.Intersect, true);
			}
			
			var filts:BitmapFilter[] = this.filters.concat(filters);
			this.graphics.draw(ctx, mat, this.blendMode, this.transform.concatenatedColorTransform, filts);
			
			super.__update(ctx, offsetX, offsetY, filts);
			
			if (this.mask)
			{
				ctx.restore();
				path.delete();
			} 
		}
	}
	
	/*override*/
	protected __doMouse = (e:MouseEvent):DisplayObject =>
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
	
	/*override*/
	public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
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
			var bnds:Rectangle = this.getBounds(this);
			this.x = this.parent.mouseX - (this.width / 2 + bnds.left);
			this.y = this.parent.mouseY - (this.height / 2 + bnds.top);
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