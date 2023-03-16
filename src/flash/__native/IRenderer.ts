
import { Canvas, Color, Font, Image, Paint, Paragraph, Path } from "canvaskit-wasm";
import { IGraphicsData } from "../display";
import { BitmapData } from "../display/BitmapData";
import { BitmapFilter } from "../filters";
import { Rectangle } from "../geom";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";

export interface IRenderer 
{
	getCssColor(color:number,alpha:number,ct:ColorTransform,toarr:Array<any>):string;

	getRGBAColor(color:number,alpha:number, ct:ColorTransform):Color;
	
	renderGraphics(ctx:Canvas | CanvasRenderingContext2D,g:IGraphicsData[], groupPath:Path, groupPathPaint:Paint, m:Matrix,blendMode:string,colorTransform:ColorTransform, filters:BitmapFilter[], firstRender?:boolean):void;
	
	renderImage(ctx:Canvas,img:Image,m:Matrix,blendMode:string,colorTransform:ColorTransform, bounds:Rectangle, filters:BitmapFilter[], imageSource:CanvasImageSource):void;
	
	renderVideo(ctx:Canvas | CanvasRenderingContext2D,video:HTMLVideoElement,m:Matrix, width:number, height:number, blendMode:string,colorTransform:ColorTransform):void;
	
	renderText(ctx:Canvas | CanvasRenderingContext2D,txt:string, paint:Paint, font:Font, m:Matrix, blendMode:string, colorTransform:ColorTransform, filters:BitmapFilter[]):void;

	renderParagraph(ctx:Canvas | CanvasRenderingContext2D,paragraph:Paragraph, m:Matrix, blendMode:string, colorTransform:ColorTransform):void;
}