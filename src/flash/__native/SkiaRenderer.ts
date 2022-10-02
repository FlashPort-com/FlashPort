import { BitmapData } from "../display/BitmapData.js";
import { Graphics } from "../display/Graphics.js";
import { GraphicsPath } from "../display/GraphicsPath.js";
import { ColorTransform } from "../geom/ColorTransform.js";
import { Matrix } from "../geom/Matrix.js";
import { TextField } from "../text/TextField.js";
import { TextFormat } from "../text/TextFormat.js";
import { IRenderer } from "./IRenderer.js";
import { Canvas, CanvasKitInit, Surface } from "canvaskit-wasm";


export class SkiaRenderer implements IRenderer
{
    
    constructor()
    {
        CanvasKitInit({
            locateFile: (file) => '/node_modules/canvaskit-wasm/bin/'+file,
        }).then((CanvasKit) => {
            let surface:Surface = CanvasKit.MakeCanvasSurface('flashportcanvas');
            let canvas:Canvas = surface.getCanvas();
            canvas.clear(CanvasKit.WHITE);
        });
    }
    
    public createPath(): GraphicsPath {
        throw new Error("Method not implemented.");
    }
    public getCssColor(color: number, alpha: number, ct: ColorTransform, toarr: any[]): string {
        throw new Error("Method not implemented.");
    }
    public renderGraphics(ctx: CanvasRenderingContext2D, g: Graphics, m: Matrix, blendMode: string, colorTransform: ColorTransform): void {
        throw new Error("Method not implemented.");
    }
    public renderImage(ctx: CanvasRenderingContext2D, img: BitmapData, m: Matrix, blendMode: string, colorTransform: ColorTransform, offsetX?: number, offsetY?: number): void {
        throw new Error("Method not implemented.");
    }
    public renderVideo(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, m: Matrix, width: number, height: number, blendMode: string, colorTransform: ColorTransform): void {
        throw new Error("Method not implemented.");
    }
    public renderText(ctx: CanvasRenderingContext2D, txt: string, textFormat: TextFormat, m: Matrix, blendMode: string, colorTransform: ColorTransform, x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    public renderRichText(ctx: CanvasRenderingContext2D, txt: TextField, offsetX?: number, offsetY?: number): void {
        throw new Error("Method not implemented.");
    }
    public finish(ctx: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.");
    }
    public start(ctx: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.");
    }

}