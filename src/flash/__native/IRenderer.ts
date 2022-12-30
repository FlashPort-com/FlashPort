
import { Canvas, Color, Font, Paint } from "canvaskit-wasm";
import { IGraphicsData } from "../display";
import { BitmapData } from "../display/BitmapData";
import { BitmapFilter } from "../filters";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";

export interface IRenderer 
{
	getCssColor(color:number,alpha:number,ct:ColorTransform,toarr:Array<any>):string;

	getRGBAColor(color:number,alpha:number, ct:ColorTransform):Color;
	
	renderGraphics(ctx:Canvas | CanvasRenderingContext2D,g:IGraphicsData[],m:Matrix,blendMode:string,colorTransform:ColorTransform, filters:BitmapFilter[]):void;
	
	renderImage(ctx:Canvas | CanvasRenderingContext2D,img:BitmapData,m:Matrix,blendMode:string,colorTransform:ColorTransform, offsetX?:number, offsetY?:number):void;
	
	renderVideo(ctx:Canvas | CanvasRenderingContext2D,video:HTMLVideoElement,m:Matrix, width:number, height:number, blendMode:string,colorTransform:ColorTransform):void;
	
	renderText(ctx:Canvas | CanvasRenderingContext2D,txt:string, paint:Paint, font:Font, m:Matrix, blendMode:string, colorTransform:ColorTransform,x:number,y:number):void;
}