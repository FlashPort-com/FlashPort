import { IGraphicsData } from "../display/IGraphicsData";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Canvas, CanvasKit, Color, Font, Image, InputMatrix, Paint, Paragraph, Path } from "canvaskit-wasm";
import { IRenderer } from "./IRenderer";
import { Bitmap, IBitmapDrawable } from "../display";
import { BitmapFilter, BlurFilter } from "../filters";
import { FPConfig } from "../../FPConfig";
import { Rectangle } from "../geom";


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

    public renderGraphics(ctx: Canvas, graphicsData: IGraphicsData[], groupPath:Path, groupPathPaint:Paint, m: Matrix, blendMode: string, colorTransform: ColorTransform, filters:BitmapFilter[], firstRender:boolean = false): void {
        
        let blurFilter:BlurFilter;
        let lastFill:IGraphicsData;
        let lastStroke:IGraphicsData;
        let mat:number[] = [m.a, m.c, m.tx, m.b, m.d, m.ty, 0, 0, 1];

        /* groupPath.transform(m);
        console.log("path", groupPath, groupPathPaint);
        ctx.drawPath(groupPath, groupPathPaint);

        // reset matrix
		let invertedMat:number[] = this._canvasKit.Matrix.invert(mat) || mat;
		groupPath.transform(invertedMat); */



		var len:number = graphicsData.length;
        //var finalPath:Path = new FPConfig.canvasKit.Path();
		for (var i:number = 0; i < len;i++ )
		{
			var igd:IGraphicsData = graphicsData[i];
            igd.skiaDraw(ctx,colorTransform, m);
            if (igd.graphicType == 'FILL') lastFill = igd;
            if (igd.graphicType == 'STROKE') lastStroke = igd;
            if (igd.graphicType == 'PATH')
            {
                //finalPath.op(igd.path, FPConfig.canvasKit.PathOp.Union);
                igd.path.transform(mat);

                for (let j:number = 0; j < filters.length; j++)
                {
                    if (filters[j] instanceof BlurFilter)
                    {
                        blurFilter = filters[j] as BlurFilter;
                    }
                    else
                    {
                        if (filters[j]['knockout'])
                        {
                            if (lastFill) lastFill.paint.setBlendMode(FPConfig.canvasKit.BlendMode.Dst);
                            if (lastStroke) lastStroke.paint.setBlendMode(FPConfig.canvasKit.BlendMode.Dst);
                        }

                        if (filters[j]['inner'])
                        {
                            if (lastFill) lastFill.paint.setBlendMode(FPConfig.canvasKit.BlendMode.DstOver);
                            if (lastStroke) lastStroke.paint.setBlendMode(FPConfig.canvasKit.BlendMode.Src);
                        }
                        filters[j]._applyFilter(ctx, igd.path);
                    }
                }
                
                if (lastFill && lastFill.paint)
                {
                    if (blurFilter) blurFilter._applyFilter(ctx, null, lastFill.paint);
                    ctx.drawPath(igd.path, lastFill.paint);
                }

                if (lastStroke && lastStroke.paint)
                {
                    if (blurFilter) blurFilter._applyFilter(ctx, null, lastStroke.paint);
                    ctx.drawPath(igd.path, lastStroke.paint);
                } 

                // reset matrix
			    let invertedMat:number[] = this._canvasKit.Matrix.invert(mat) || mat;
			    igd.path.transform(invertedMat);
            }
		}
    }

    public renderImage(ctx: Canvas, img: Image, m: Matrix, blendMode: string, colorTransform: ColorTransform, bounds:Rectangle, filters:BitmapFilter[], imageSource:CanvasImageSource): void {
        
        let mat:InputMatrix = [m.a, m.c, m.tx, m.b, m.d, m.ty, 0, 0, 1];
        ctx.concat(mat);

        const blurPaint:Paint = this.processFilters(ctx, imageSource, filters);

        ctx.drawImageOptions(img, 0, 0, FPConfig.canvasKit.FilterMode.Linear, FPConfig.canvasKit.MipmapMode.Linear, blurPaint ? blurPaint : null);

        let invertedMat:InputMatrix = this._canvasKit.Matrix.invert(mat) || mat;
        ctx.concat(invertedMat);
        
        if (blurPaint) blurPaint.delete();
    }

    public renderVideo(ctx: Canvas, video: HTMLVideoElement, m: Matrix, width: number, height: number, blendMode: string, colorTransform: ColorTransform): void {
        throw new Error("Method not implemented.");
    }

    public renderText(ctx: Canvas, txt: string, paint:Paint, font:Font, m: Matrix, blendMode: string, colorTransform: ColorTransform, filters:BitmapFilter[]): void {
        let mat:InputMatrix = [m.a, m.c, m.tx, m.b, m.d, m.ty, 0, 0, 1];
        ctx.concat(mat);
        ctx.drawText(txt, 0, 0, paint, font);
        let invertedMat:InputMatrix = this._canvasKit.Matrix.invert(mat) || mat;
        ctx.concat(invertedMat);
    }

    public renderParagraph(ctx:Canvas, paragraph:Paragraph, m:Matrix, blendMode:string, colorTransform:ColorTransform): void
    {
        let mat:InputMatrix = [m.a, m.c, m.tx, m.b, m.d, m.ty, 0, 0, 1];
        ctx.concat(mat);
        
        ctx.drawParagraph(paragraph, 2, 1);
        
        let invertedMat:InputMatrix = this._canvasKit.Matrix.invert(mat) || mat;
        ctx.concat(invertedMat);
    }

    private processFilters(ctx:Canvas, path:Path | CanvasImageSource, filters:BitmapFilter[]):Paint | null
    {
        let blurPaint:Paint;
        
        for (let i:number = 0; i < filters.length; i++)
        {
            if (filters[i] instanceof BlurFilter && !blurPaint)
            {
                blurPaint = new FPConfig.canvasKit.Paint();
            }
            filters[i]._applyFilter(ctx, path, blurPaint);
        }

        return blurPaint;
    }
}