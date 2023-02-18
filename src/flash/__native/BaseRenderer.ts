import { BitmapData } from "../display/BitmapData";
import { Graphics } from "../display/Graphics";
import { GraphicsEndFill } from "../display/GraphicsEndFill";
import { GraphicsPath } from "../display/GraphicsPath";
import { IGraphicsData } from "../display/IGraphicsData";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { TextField } from "../text/TextField";
import { TextFormat } from "../text/TextFormat";
	

export class BaseRenderer
{
	private buffer:HTMLCanvasElement;
	private bCTX:CanvasRenderingContext2D;
	protected endFillInstance:GraphicsEndFill = new GraphicsEndFill;

	constructor()
	{
		this.buffer = document.createElement('canvas');
		document.body.prepend(this.buffer);
		this.buffer.style.position = "absolute";
		this.buffer.style.zIndex = "1";
		console.log("BaseRenderer");
	}
	
	/*override*/
	public getCssColor = (color:number,alpha:number, ct:ColorTransform,toarr:any[]):string =>
	{
		return "rgba(" + Number((color >> 16 & 0xff)*ct.redMultiplier+ct.redOffset) + "," + Number((color >> 8 & 0xff)*ct.greenMultiplier+ct.greenOffset) + "," + Number((color & 0xff)*ct.greenMultiplier+ct.greenOffset) + "," + (alpha*ct.alphaMultiplier+ct.alphaOffset) + ")";
	}
	
	/*override*/
	public renderGraphics = (ctx:CanvasRenderingContext2D, g:Graphics, m:Matrix, blendMode:string, colorTransform:ColorTransform):void =>
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
		const hasColorTransform:boolean = new ColorTransform().toString() != colorTransform.toString();
		
		if (hasColorTransform)
		{
			// fill buffer canvas with colorTransorm color
			this.buffer.width = img.width;
			this.buffer.height = img.height;
			let bCTX:CanvasRenderingContext2D = this.buffer.getContext('2d');
			bCTX.fillStyle = "rgba(" + colorTransform.redOffset + "," + colorTransform.greenOffset + "," + colorTransform.blueOffset + "," + colorTransform.alphaMultiplier + ")";
			bCTX.globalCompositeOperation = "color";
			bCTX.fillRect(0, 0, this.buffer.width, this.buffer.height);

			// use drawing as mask
			bCTX.globalCompositeOperation = "destination-in";
			bCTX.drawImage(img.imageSource, 0, 0); 
		}
		
		ctx.globalAlpha = colorTransform.alphaMultiplier;
		ctx.globalCompositeOperation = <any>blendMode;
		ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
		ctx.drawImage(hasColorTransform ? this.buffer : img.imageSource, offsetX, offsetY);
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
		//t.__updateCanvas(ctx, offsetX, offsetY);
	}
}