import { IRenderer } from "./IRenderer.js";

import { BitmapData } from "../display/BitmapData.js";
import { Graphics } from "../display/Graphics.js";
import { GraphicsEndFill } from "../display/GraphicsEndFill.js";
import { GraphicsPath } from "../display/GraphicsPath.js";
import { IGraphicsData } from "../display/IGraphicsData.js";
import { ColorTransform } from "../geom/ColorTransform.js";
import { Matrix } from "../geom/Matrix.js";
import { TextField } from "../text/TextField.js";
import { TextFieldType } from "../text/TextFieldType.js";
import { TextFormat } from "../text/TextFormat.js";
	

export class BaseRenderer extends IRenderer
{

	protected endFillInstance:GraphicsEndFill = new GraphicsEndFill;

	constructor()
	{
		super();
	}
	
	/*override*/ public getCssColor = (color:number,alpha:number, ct:ColorTransform,toarr:any[]):string =>
	{
		return "rgba(" + Number((color >> 16 & 0xff)*ct.redMultiplier+ct.redOffset) + "," + Number((color >> 8 & 0xff)*ct.greenMultiplier+ct.greenOffset) + "," + Number((color & 0xff)*ct.greenMultiplier+ct.greenOffset) + "," + (alpha*ct.alphaMultiplier+ct.alphaOffset) + ")";
	}
	
	/*override*/ public createPath = ():GraphicsPath =>
	{
		return new GraphicsPath;
	}
	
	/*override*/ public renderGraphics = (ctx:CanvasRenderingContext2D, g:Graphics, m:Matrix, blendMode:string, colorTransform:ColorTransform):void =>
	{
		ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
		ctx.globalCompositeOperation = <any>blendMode;
		var len:number = g.graphicsData.length;
		for (var i:number = 0; i < len;i++ )
		{
			var igd:IGraphicsData = g.graphicsData[i];
			igd.draw(ctx,colorTransform);
		}
		if (g.lastFill)
		{
			this.endFillInstance.fill = g.lastFill;
			this.endFillInstance.draw(ctx,colorTransform);
		}
		
		if (g.lastStroke)
		{
			ctx.stroke();
		}
		ctx.fillStyle = null;
		ctx.strokeStyle = null;
	}
	
	/*override*/ public renderImage = (ctx:CanvasRenderingContext2D,img:BitmapData,m:Matrix,blendMode:string,colorTransform:ColorTransform, offsetX:number = 0, offsetY:number = 0):void =>
	{
		ctx.globalAlpha = colorTransform.alphaMultiplier;
		ctx.globalCompositeOperation = <any>blendMode;
		ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
		ctx.drawImage(img.image, offsetX, offsetY);
	}
	
	/*override*/ public renderVideo = (ctx:CanvasRenderingContext2D,video:HTMLVideoElement,m:Matrix, width:number, height:number, blendMode:string, colorTransform:ColorTransform):void =>
	{
		ctx.globalAlpha = colorTransform.alphaMultiplier;
		ctx.globalCompositeOperation = <any>blendMode;
		ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
		ctx.drawImage(video, 0, 0, width, height);
	}
	
	/*override*/ public renderText = (ctx:CanvasRenderingContext2D,txt:string,textFormat:TextFormat, m:Matrix, blendMode:string, colorTransform:ColorTransform,x:number,y:number):void =>
	{
		ctx.globalAlpha = colorTransform.alphaMultiplier;
		ctx.globalCompositeOperation = <any>blendMode;
		ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
		ctx.font = textFormat.css;
		ctx.fillStyle = textFormat.csscolor;
		ctx.textBaseline = "top";
		ctx.textAlign = textFormat.align as CanvasTextAlign;
		ctx.fillText(txt, x, y);
	}
	
	/*override*/ public renderRichText = (ctx:CanvasRenderingContext2D, t:TextField, offsetX:number = 0, offsetY:number = 0):void =>
	{
		t.__updateCanvas(ctx, offsetX, offsetY);
	}
}