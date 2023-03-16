import { DisplayObject } from "./DisplayObject";
import { BitmapData } from "./BitmapData";
import { FPConfig } from "../../FPConfig";
import { BlendMode } from "./BlendMode";

import { MouseEvent } from "../events/MouseEvent";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { IRenderer } from "../__native/IRenderer";
import { Canvas, Image, ImageInfo, Path } from "canvaskit-wasm";
import { GraphicsPath } from "./GraphicsPath";
import { BitmapFilter } from "../filters/BitmapFilter";
	
	export class Bitmap extends DisplayObject
	{
		private _bitmapData:BitmapData;
		
		constructor(bitmapData:BitmapData = null, pixelSnapping:string = "auto", smoothing:boolean = false)
		{
			super();
			
			this._bitmapData = bitmapData;
		}
		
		public get pixelSnapping():string  { return null }
		
		public set pixelSnapping(param1:string)
		{
		
		}
		
		public get smoothing():boolean  { return false }
		
		public set smoothing(param1:boolean)
		{
		
		}
		
		public get bitmapData():BitmapData  { return this._bitmapData }
		
		public set bitmapData(param1:BitmapData)
		{
			this._bitmapData = param1;
			FPConfig.dirtyGraphics = true;
		}
		
		public get cacheImage():BitmapData 
		{
			return this._bitmapData;
		}
		
		/*override*/ public getFullBounds = (v:DisplayObject):Rectangle =>
		{
			if (this._bitmapData) return this._bitmapData.rect;
			return new Rectangle();
		}
		
		/*override*/
		public __update(ctx:Canvas, offsetX:number = 0, offsetY:number = 0, filters: BitmapFilter[] = []):void
		{
			if (!this._off && this.visible)
			{
				if (this._bitmapData && this._bitmapData.image)
				{
					let mat:Matrix = this.transform.concatenatedMatrix;
					let path:Path;
					if (this.mask)
					{
						var maskMat:Matrix = this.mask.transform.concatenatedMatrix;
						
						ctx.save();
						this.mask['graphics'].draw(ctx, maskMat, BlendMode.NORMAL, new ColorTransform(), []);
						path = (this.mask['graphics'].lastPath as GraphicsPath).path;
						let pathMat:number[] = [maskMat.a, maskMat.c, maskMat.tx, maskMat.b, maskMat.d, maskMat.ty, 0, 0, 1];
						path.transform(pathMat)
						path.setFillType(FPConfig.canvasKit.FillType.Winding);
						ctx.clipPath(path, FPConfig.canvasKit.ClipOp.Intersect, true);
						let invertedMat:number[] = FPConfig.canvasKit.Matrix.invert(pathMat) || pathMat;
			    		path.transform(invertedMat);
					}
					
					var filts:BitmapFilter[] = this.filters.concat(filters);
					(FPConfig.renderer as IRenderer).renderImage(ctx, this._bitmapData.image, mat, this.blendMode, this.transform.concatenatedColorTransform, this._bitmapData.rect, filts, this._bitmapData.imageSource);
					FPConfig.drawCounter++;
					if (this.mask)
					{
						ctx.restore();
					} 
					
				}
			}
		}
		
		/*override*/
		protected __doMouse = (e:MouseEvent):DisplayObject =>
		{
			if (this.visible) 
			{
				if (this.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) {
					return this;
				}
			}
			return null;
		}
		
		/*override*/
		public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
		{
			var rect:Rectangle = new Rectangle(0, 0, this.width * this.scaleX, this.height * this.scaleY);
			var gToL:Point  = this.globalToLocal(new Point(x, y));
			return rect.containsPoint(gToL);
		}
	}

