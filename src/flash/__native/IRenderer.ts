
import { BitmapData } from "../display/BitmapData.js";
import { Graphics } from "../display/Graphics.js";
import { GraphicsPath } from "../display/GraphicsPath.js";
import { ColorTransform } from "../geom/ColorTransform.js";
import { Matrix } from "../geom/Matrix.js";
import { TextField } from "../text/TextField.js";
import { TextFormat } from "../text/TextFormat.js";

export class IRenderer 
{
	
	constructor() 
	{
		
	}
	
	public createPath():GraphicsPath{
		return null;
	}
	
	public getCssColor(color:number,alpha:number,ct:ColorTransform,toarr:Array<any>):string{
		return null;
	}
	
	public renderGraphics(ctx:CanvasRenderingContext2D,g:Graphics,m:Matrix,blendMode:string,colorTransform:ColorTransform):void{
		
	}
	
	public renderImage(ctx:CanvasRenderingContext2D,img:BitmapData,m:Matrix,blendMode:string,colorTransform:ColorTransform, offsetX:number = 0, offsetY:number = 0):void{
		
	}
	
	public renderVideo(ctx:CanvasRenderingContext2D,video:HTMLVideoElement,m:Matrix, width:number, height:number, blendMode:string,colorTransform:ColorTransform):void{
		
	}
	
	public renderText(ctx:CanvasRenderingContext2D,txt:string,textFormat:TextFormat, m:Matrix, blendMode:string, colorTransform:ColorTransform,x:number,y:number):void{
		
	}
	
	public renderRichText(ctx:CanvasRenderingContext2D,txt:TextField, offsetX:number = 0, offsetY:number = 0):void{
	}
	
	public finish(ctx:CanvasRenderingContext2D):void{
		
	}
	public start(ctx:CanvasRenderingContext2D):void{
		
	}
}