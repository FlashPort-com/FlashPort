import { CharSet } from "./te/CharSet";
import { BitmapData } from "../display/BitmapData";
import { Graphics } from "../display/Graphics";
import { GraphicsPath } from "../display/GraphicsPath";
import { IGraphicsData } from "../display/IGraphicsData";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { TextField } from "../text/TextField";
import { TextFormat } from "../text/TextFormat";
import { GLCanvasRenderingContext2D } from "./GLCanvasRenderingContext2D";
import { BaseRenderer } from "./BaseRenderer";
import { GLGraphicsPath } from "./GLGraphicsPath";

export class WebGLRenderer extends BaseRenderer
{
    //private var path2glpath:ObjectMap = new ObjectMap;
    public static textCharSet:CharSet = new CharSet;

    constructor() 
    {
        super();
    }
    
    public createPath = ():GraphicsPath =>
    {
        return new GLGraphicsPath;
    }
    
    public getCssColor = (color:number, alpha:number, ct:ColorTransform,toarr:Array<any>):any =>
    {
        var r:number = Math.floor((color >> 16 & 0xff)*ct.redMultiplier+ct.redOffset);
        var g:number = Math.floor((color >> 8 & 0xff) * ct.greenMultiplier + ct.greenOffset);
        var b:number = Math.floor((color & 0xff)*ct.greenMultiplier+ct.greenOffset);
        var a:number = (alpha * ct.alphaMultiplier + ct.alphaOffset) * 0xff;
        var c:number = ((r << 0) | (g << 8) | (b << 16) | (a << 24))>>>0;
        return c;
    }
    
    public renderImage = (ctx:CanvasRenderingContext2D | GLCanvasRenderingContext2D, img:BitmapData, m:Matrix, blendMode:string, colorTransform:ColorTransform, offsetX:number = 0, offsetY:number = 0):void =>
    {
        var glctx:GLCanvasRenderingContext2D = ctx as GLCanvasRenderingContext2D;
        if (!glctx.isBatch){
            ctx.globalCompositeOperation = blendMode;
        }
        glctx.drawImageInternal(img.image, glctx.bitmapDrawable, m, null, true, colorTransform.tint, true, true);
        if (glctx.isBatch){
            ctx.globalCompositeOperation = blendMode;
        }
    }
    
    public renderGraphics = (ctx:CanvasRenderingContext2D | GLCanvasRenderingContext2D, g:Graphics, m:Matrix, blendMode:string, colorTransform:ColorTransform):void =>
    {
        var glctx:GLCanvasRenderingContext2D = ctx as GLCanvasRenderingContext2D;
        //glctx.setTransform2(m);
        //inline
        glctx.matr = m;
        if (!glctx.isBatch){
            ctx.globalCompositeOperation = blendMode;
        }
        //ctx.globalAlpha = colorTransform.alphaMultiplier;
        //glctx.globalRed = colorTransform.redMultiplier;
        //glctx.globalGreen = colorTransform.greenMultiplier;
        //glctx.globalBlue = colorTransform.blueMultiplier;
        glctx.colorTransform = colorTransform;
        var len:number = g.graphicsData.length;
        for (var i:number = 0; i < len;i++ )
        {
            var igd:IGraphicsData = g.graphicsData[i];
            igd.gldraw(glctx, colorTransform);
        }
        if (g.lastFill)
        {
            this.endFillInstance.fill = g.lastFill;
            this.endFillInstance._worldMatrix = g._worldMatrix;
            this.endFillInstance.gldraw(glctx,colorTransform);
        }
        
        if (g.lastStroke)
        {
            ctx.stroke();
        }
        ctx.fillStyle = null;
        ctx.strokeStyle = null;
        if (glctx.isBatch){
            ctx.globalCompositeOperation = blendMode;
        }
    }
    
    public renderText = (ctx:CanvasRenderingContext2D | GLCanvasRenderingContext2D, txt:string, textFormat:TextFormat, m:Matrix, blendMode:string, colorTransform:ColorTransform, x:number, y:number):void =>
    {
        var glctx:GLCanvasRenderingContext2D = ctx as GLCanvasRenderingContext2D;
        glctx.colorTransform = colorTransform;
        //ctx.globalCompositeOperation = blendMode;//BlendMode.getCompVal(blendMode);
        if (!glctx.isBatch){
            ctx.globalCompositeOperation = blendMode;
        }
        glctx.setTransform2(m);
        ctx.font = textFormat.css;
        ctx.fillStyle = textFormat.csscolor;
        ctx.textBaseline = "top";
        ctx.fillText(txt, x, y);
        if (glctx.isBatch){
            ctx.globalCompositeOperation = blendMode;
        }
    }
    
    public finish = (ctx:CanvasRenderingContext2D | GLCanvasRenderingContext2D):void =>
    {
        var glctx:GLCanvasRenderingContext2D = ctx as GLCanvasRenderingContext2D;
        glctx.drawImageInternal(null, null, null, null, true, null, true, true);
    }
    
    public renderRichText = (ctx:CanvasRenderingContext2D | GLCanvasRenderingContext2D, t:TextField, offsetX:number = 0, offsetY:number = 0):void =>
    {
        var ctx2:GLCanvasRenderingContext2D = ctx as GLCanvasRenderingContext2D;
        ctx2.flush();
        //t.__updateCanvas(ctx);
        t.__updateGL(ctx as GLCanvasRenderingContext2D);
    }
    
    public start = (ctx:CanvasRenderingContext2D):void =>
    {
        WebGLRenderer.textCharSet.rebuild();
    }
}