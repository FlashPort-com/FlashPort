import { IGraphicsData } from "../display/IGraphicsData";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Canvas, CanvasKit, Color, Font, Paint } from "canvaskit-wasm";
import { IRenderer } from "./IRenderer";
import { IBitmapDrawable } from "../display";
import { BitmapFilter, BlurFilter } from "../filters";


export class SkiaRenderer implements IRenderer
{
    private _canvasKit:CanvasKit;
    
    constructor(canvasKit:CanvasKit)
    {
        this._canvasKit = canvasKit;
    }

    public getCssColor(color: number, alpha: number, ct: ColorTransform, toarr: any[]): string {
        throw new Error("Method not implemented.");
    }

    public getRGBAColor = (color:number,alpha:number, ct:ColorTransform):Color =>
	{
		let rgbaColor:Color = this._canvasKit.Color(
            (color >> 16 & 0xff) * ct.redMultiplier+ct.redOffset, 
            (color >> 8 & 0xff) * ct.greenMultiplier+ct.greenOffset, 
            (color & 0xff) * ct.greenMultiplier+ct.greenOffset, 
            (alpha * ct.alphaMultiplier + ct.alphaOffset)
        );

        return rgbaColor;
	}

    public renderGraphics(ctx: Canvas, graphicsData: IGraphicsData[], m: Matrix, blendMode: string, colorTransform: ColorTransform, filters:BitmapFilter[]): void {
        //ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
		//ctx.globalCompositeOperation = <any>blendMode;
        let blurFilter:BlurFilter;
        let lastFill:IGraphicsData;
        let lastStroke:IGraphicsData;

		var len:number = graphicsData.length;
		for (var i:number = 0; i < len;i++ )
		{
			var igd:IGraphicsData = graphicsData[i];
            igd.skiaDraw(ctx,colorTransform, m);
            if (igd.graphicType == 'FILL') lastFill = igd;
            if (igd.graphicType == 'STROKE') lastStroke = igd;
            if (igd.graphicType == 'PATH')
            {
                let mat:number[] = [m.a, m.c, m.tx, m.b, m.d, m.ty, 0, 0, 1];
                igd.path.transform(mat);
                
                for (let j:number = 0; j < filters.length; j++)
                {
                    if (filters[j] instanceof BlurFilter)
                    {
                        blurFilter = filters[j] as BlurFilter;
                    }
                    else
                    {
                        filters[j]._applyFilter(ctx, igd.path);
                    }
                }
                
                if (lastFill)
                {
                    if (blurFilter) blurFilter._applyFilter(ctx, null, lastFill.paint);
                    ctx.drawPath(igd.path, lastFill.paint);
                } 
                if (lastStroke)
                {
                    if (blurFilter) blurFilter._applyFilter(ctx, null, lastStroke.paint);
                    ctx.drawPath(igd.path, lastStroke.paint);
                } 

                // reset matrix
			    let invertedMat:number[] = this._canvasKit.Matrix.invert(mat);
			    igd.path.transform(invertedMat);
            }
		}
    }

    public renderImage(ctx: Canvas, img: IBitmapDrawable, m: Matrix, blendMode: string, colorTransform: ColorTransform, offsetX?: number, offsetY?: number): void {
        throw new Error("Method not implemented.");
    }

    public renderVideo(ctx: Canvas, video: HTMLVideoElement, m: Matrix, width: number, height: number, blendMode: string, colorTransform: ColorTransform): void {
        throw new Error("Method not implemented.");
    }

    public renderText(ctx: Canvas, txt: string, paint:Paint, font:Font, m: Matrix, blendMode: string, colorTransform: ColorTransform, x: number, y: number): void {
        
        
        ctx.drawText(txt, m.tx - 2, m.ty + font.getSize() - 7, paint, font);
    }
}