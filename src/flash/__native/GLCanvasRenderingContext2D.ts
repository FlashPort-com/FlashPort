import { BitmapData } from "../display/BitmapData.js";
import { BlendMode } from "../display/BlendMode.js";
import { GraphicsPath } from "../display/GraphicsPath.js";
import { Stage } from "../display/Stage.js";
import { Context3D } from "../display3D/Context3D.js";
import { Context3DBlendFactor } from "../display3D/Context3DBlendFactor.js";
import { Context3DProgramType } from "../display3D/Context3DProgramType.js";
import { Context3DTextureFormat } from "../display3D/Context3DTextureFormat.js";
import { Context3DTriangleFace } from "../display3D/Context3DTriangleFace.js";
import { Context3DVertexBufferFormat } from "../display3D/Context3DVertexBufferFormat.js";
import { IndexBuffer3D } from "../display3D/IndexBuffer3D.js";
import { Program3D } from "../display3D/Program3D.js";
import { VertexBuffer3D } from "../display3D/VertexBuffer3D.js";
import { Texture } from "../display3D/textures/Texture.js";
import { TextureBase } from "../display3D/textures/TextureBase.js";
import { AEvent } from "../events/AEvent.js";
import { ColorTransform } from "../geom/ColorTransform.js";
import { Matrix } from "../geom/Matrix.js";
import { Matrix3D } from "../geom/Matrix3D.js";
import { ByteArray } from "../utils/ByteArray.js";
import { FlashPort } from "../../FlashPort.js";
import { GLPath2D } from "./GLPath2D.js";
import { GLDrawable } from "./GLDrawable.js";
import { GLCanvasPattern } from "./GLCanvasPattern.js";
import { GLGraphicsPath } from "./GLGraphicsPath.js";
import { GLVertexBufferSet } from "./GLVertexBufferSet.js";
import { BitmapTexture } from "./BitmapTexture.js";
import { GLIndexBufferSet } from "./GLIndexBufferSet.js";

export class GLCanvasRenderingContext2D
{
    public canvas : HTMLCanvasElement;
    public fillColor : string;
    public fillStyle : string | GLCanvasPattern | CanvasPattern | HTMLImageElement | HTMLCanvasElement | CanvasGradient;
    public fillStyleIsImage:Boolean;
    public font : string;
    public getLineDash : any;
    public globalAlpha : number = 1;
    //public var globalRed : number=1;
    //public var globalGreen : number=1;
    //public var globalBlue : number=1;
    public colorTransform:ColorTransform;
    public globalCompositeOperation : string;
    public lineCap : string;
    public lineJoin : string;
    public lineWidth : number;
    public miterLimit : number;
    public setFillColor : Object;
    public setLineDash : Object;
    public setStrokeColor : Object;
    public shadowBlur : number;
    public shadowColor : string;
    public shadowOffsetX : number;
    public shadowOffsetY : number;
    public strokeColor : string;
    public strokeStyle : string;
    public textAlign : string;
    public textBaseline : string;
    public ctx:Context3D;
    public  currentPath:GLPath2D;
    private text2img:Object = { };
    public bitmapDrawable:GLDrawable;
    private bitmapProg:Program3D;
    private colorProg:Program3D;
    private matr3d:Matrix3D = new Matrix3D;
    private uvmatr3d:Matrix3D = new Matrix3D;
    public matr:Matrix = new Matrix;
    private matrhelp:Matrix = new Matrix;
    private stage:Stage;
    public isBatch:Boolean;
    private batchs:Array<any> = [];
    private batchsLen:number = 0;
    private states:Array<any> = [];
    private statesPos:number = -1;
    private posPool:Object = {};
    private uvPool:Object = {};
    private colorPool:Object = {};
    private indexPool:Object = {};
    private newDrawable:GLDrawable;
    
    private lastImage:HTMLImageElement | HTMLCanvasElement | CanvasPattern;
    private lastImageIsImage:any;
    private numPos:number = 0;
    private numIndex:number = 0;
    private updateColor:Boolean = true;
    
    constructor(stage:Stage,isBatch:boolean=false) 
    {
        this.isBatch = isBatch;
        this.stage = stage;
        this.canvas = stage.canvas;
        this.ctx = new Context3D;
        this.ctx.canvas = this.canvas;
        this.ctx.gl = (this.canvas.getContext("webgl", {alpha:false,antialias:false}) || this.canvas.getContext("experimental-webgl", {alpha:false,antialias:false})) as WebGLRenderingContext;
        this.newDrawable = new GLDrawable(null, null, null,this.ctx.gl.DYNAMIC_DRAW);
        this.stage_resize(null);
        this.ctx.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
        this.ctx.setCulling(Context3DTriangleFace.NONE);
        
        var posData:Float32Array = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
        var iData:Uint16Array = new Uint16Array([0, 2, 1, 2, 1, 3]);
        this.bitmapDrawable = new GLDrawable(posData, posData,iData,this.ctx.gl.STATIC_DRAW);
        
        var vcode:string = 
            "attribute vec2 va0;" +
            "attribute vec4 va1;" +
            "attribute vec2 va2;" +
            "varying vec4 vColor;"+
            "varying vec2 vUV;" +
            "uniform mat4 vc0;"+
            "uniform mat4 vc4;"+
            "void main(void) {" +
                "vColor=va1;"+
                "vUV=(vc4*vec4(va2,0.0,1.0)).xy;"+
                "gl_Position =vc0*vec4(va0, 0.0,1.0);"+
            "}";
        var fcode:string = "precision lowp float;" +
            "varying vec4 vColor;"+
            "varying vec2 vUV;"+
            "uniform sampler2D fs0;"+
            "void main(void) {" +
                "vec4 c=texture2D(fs0,vUV);" + 
                //"c.xyz*=vColor.a;" + 
                "gl_FragColor = c*vColor;"+
            "}";
        this.bitmapProg = this.ctx.createProgram();
        var vb:ByteArray = new ByteArray;
        vb.writeUTFBytes(vcode);
        var fb:ByteArray = new ByteArray;
        fb.writeUTFBytes(fcode);
        this.bitmapProg.upload(vb, fb);
        
        vcode = 
            "attribute vec2 va0;" +
            "attribute vec4 va1;" +
            "varying vec4 vColor;"+
            "uniform mat4 vc0;"+
            "void main(void) {" +
                "vColor=va1;"+
                "gl_Position =vc0*vec4(va0, 0.0,1.0);"+
            "}";
        fcode = "precision lowp float;" +
            "varying vec4 vColor;"+
            "void main(void) {" +
                "gl_FragColor = vec4(vColor.xyz*vColor.a,vColor.a);"+
            "}";
        this.colorProg = this.ctx.createProgram();
        vb = new ByteArray;
        vb.writeUTFBytes( vcode);
        fb = new ByteArray;
        fb.writeUTFBytes(fcode);
        this.colorProg.upload(vb, fb);
        
        stage.addEventListener(AEvent.RESIZE, this.stage_resize);
    }
    
    private stage_resize(e:AEvent):void 
    {
        this.ctx.configureBackBuffer(this.stage.stageWidth, this.stage.stageHeight, 0, false);
    }
    
    public arc (x:number, y:number, radius:number, startAngle:number, endAngle:number) :any{
        this.currentPath.path.arc(x, y, radius, startAngle, endAngle);
        return null;
    }

    public arcTo (x1:number, y1:number, x2:number, y2:number, radius:number) : Object {
        //currentPath.path.arc(x1, y1, x2, y2, radius);
        return null;
    }

    public beginPath () : Object {
        this.currentPath = new GLPath2D(this.ctx);
        this.currentPath.path = FlashPort.renderer.createPath() as GLGraphicsPath;
        this.currentPath.matr = this.matr;
        return null;
    }

    public bezierCurveTo (cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number) : Object {
        this.currentPath.path.cubicCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        return null;
    }

    public clearRect (x:number, y:number, w:number, h:number) : Object {
        this.ctx.clear(255,255,255); // white background
        this.batchsLen = 0;
        FlashPort.batDrawCounter = 0;
        return null;
    }

    public clip (opt_fillRule:string = "") : Object {
        return null;
    }

    public closePath () : Object {
        return null;
    }

    public createImageData (sw:number, sh:number) : ImageData {
        return null;
    }

    public createLinearGradient (x0:number, y0:number, x1:number, y1:number) : CanvasGradient {
        return null;
    }

    public createPattern (image:HTMLImageElement | HTMLCanvasElement, repetition:string) : CanvasPattern {
        return new GLCanvasPattern(image,repetition) as CanvasPattern;
    }

    public createRadialGradient (x0:number, y0:number, r0:number, x1:number, y1:number, r1:number) : CanvasGradient {
        return null;
    }

    public drawImage (image:HTMLImageElement, dx:number, dy:number) : Object {
        this.drawImageInternal(image, this.bitmapDrawable, this.matr, null, true, this.colorTransform.tint,true,true);
        return null;
    }
    
    public drawPath (path:GraphicsPath, colorTransform:ColorTransform) : Object {
        this.currentPath = path["glpath2d"];
        if (path["glpath2d"]==null){
            this.currentPath = path["glpath2d"] = new GLPath2D(this.ctx);
        }
        this.currentPath.path = path as GLGraphicsPath;
        this.currentPath.matr = this.matr;
        return null;
    }
    
    public drawImageInternal(image:HTMLImageElement | HTMLCanvasElement | CanvasPattern, drawable:GLDrawable, posmatr:Matrix, uvmatr:Matrix, scaleWithImage:Boolean,color:number,scaleWithImageUV:Boolean,isImage:Boolean):void{
        if (!this.isBatch){
            if(image){
                var colorb:GLVertexBufferSet = drawable.color;
                colorb.dirty = true;
                var data:Uint32Array = colorb.data as Uint32Array;
                var len:number = data.length;
                for (var i:number = 0; i < len;i++ ){
                    data[i] = color;//color[0];
                    //data[i + 1] = color[1];
                    //data[i + 2] = color[2];
                    //data[i + 3] = color[3];
                }
                this.renderImage(image, drawable, posmatr, uvmatr, scaleWithImage, scaleWithImageUV, isImage);
            }
        }else{
            if (!isImage && !this.lastImageIsImage){
                
            }else if (image==null || this.lastImage != image){
                if (this.numPos > 0){
                    this.batchFinish();
                }
                this.numPos = 0;
                this.numIndex = 0;
                this.lastImage = image;
                this.lastImageIsImage = isImage;
            }
            if (drawable){
                this.numPos += drawable.pos.data.length / 2;
                this.numIndex += drawable.index.data.length / 3;
            }
            var batch:Array<any> = this.batchs[this.batchsLen];
            if (batch == null){
                batch = this.batchs[this.batchsLen] = [];
            }
            this.batchsLen++;
            batch[0] = image;
            batch[1] = drawable;
            batch[2] = posmatr;
            batch[3] = uvmatr;
            batch[4] = scaleWithImage;
            batch[5] = color;
            batch[6] = scaleWithImageUV;
            batch[7] = isImage;
        }
    }
    
    public renderImage(image:HTMLImageElement | HTMLCanvasElement | CanvasPattern, drawable:GLDrawable, posmatr:Matrix, uvmatr:Matrix, scaleWithImage:Boolean,scaleWithImageUV:Boolean,isImage:Boolean):void{
        FlashPort.batDrawCounter++;
        if (!isImage){
            this.ctx.setProgram(this.colorProg);
        }else{
            var texture:BitmapTexture = this.getTexture(image);
            this.ctx.setProgram(this.bitmapProg);
            this.ctx.setTextureAt(0, texture.texture);
            this.ctx.setVertexBufferAt(2, drawable.uv.getBuff(this.ctx), 0, Context3DVertexBufferFormat.FLOAT_2);
        }
        this.ctx.setVertexBufferAt(0, drawable.pos.getBuff(this.ctx),0, Context3DVertexBufferFormat.FLOAT_2);
        this.ctx.setVertexBufferAt(1, drawable.color.getBuff(this.ctx), 0, Context3DVertexBufferFormat.BYTES_4);
        if(posmatr){
            this.matr3d.rawData[0] = posmatr.a*2  / this.stage.stageWidth;
            this.matr3d.rawData[1] = -posmatr.b*2 / this.stage.stageHeight;
            this.matr3d.rawData[4] = posmatr.c*2 / this.stage.stageWidth;
            this.matr3d.rawData[5] = -posmatr.d*2 / this.stage.stageHeight;
            this.matr3d.rawData[12] = posmatr.tx * 2 / this.stage.stageWidth-1;
            this.matr3d.rawData[13] = 1 - posmatr.ty * 2 / this.stage.stageHeight;
        }else{
            this.matr3d.rawData[0] = 2  / this.stage.stageWidth;
            this.matr3d.rawData[1] = 0;
            this.matr3d.rawData[4] = 0;
            this.matr3d.rawData[5] = -2 / this.stage.stageHeight;
            this.matr3d.rawData[12] = -1;
            this.matr3d.rawData[13] = 1;
        }
        if (scaleWithImage){
            this.matr3d.rawData[0] *= (image as HTMLImageElement).width;
            this.matr3d.rawData[1] *= (image as HTMLImageElement).width;
            this.matr3d.rawData[4] *= (image as HTMLImageElement).height;
            this.matr3d.rawData[5] *= (image as HTMLImageElement).height;
        }
        
        this.ctx.setProgramConstantsFromMatrix(Context3DProgramType.VERTEX, 0, this.matr3d);
        if(isImage){
            if (uvmatr){
                if(posmatr){
                    this.matrhelp.copyFrom(posmatr);
                    this.matrhelp.invert();
                    this.matrhelp.concat(uvmatr);
                }else{
                    this.matrhelp.copyFrom(uvmatr);
                }
                this.uvmatr3d.rawData[0] = this.matrhelp.a / texture.width;
                this.uvmatr3d.rawData[1] = -this.matrhelp.b / texture.width;
                this.uvmatr3d.rawData[4] = -this.matrhelp.c / texture.height;
                this.uvmatr3d.rawData[5] = this.matrhelp.d / texture.height;
                this.uvmatr3d.rawData[12] = -this.matrhelp.tx/texture.width;
                this.uvmatr3d.rawData[13] = -this.matrhelp.ty/texture.height;
                if (scaleWithImageUV){
                    this.uvmatr3d.rawData[0] *= (image as HTMLImageElement).width;
                    this.uvmatr3d.rawData[1] *= (image as HTMLImageElement).width;
                    this.uvmatr3d.rawData[4] *= (image as HTMLImageElement).height;
                    this.uvmatr3d.rawData[5] *= (image as HTMLImageElement).height;
                }
            }else{
                this.uvmatr3d.rawData[0] = 1 / texture.width;
                this.uvmatr3d.rawData[1] = 0;
                this.uvmatr3d.rawData[4] = 0;
                this.uvmatr3d.rawData[5] = 1/ texture.height;
                this.uvmatr3d.rawData[12] = 0;
                this.uvmatr3d.rawData[13] = 0;
                if (scaleWithImageUV){
                    this.uvmatr3d.rawData[0] *= (image as HTMLImageElement).width;
                    this.uvmatr3d.rawData[5] *= (image as HTMLImageElement).height;
                }
            }
            this.ctx.setProgramConstantsFromMatrix(Context3DProgramType.VERTEX, 4, this.uvmatr3d);
        }
        
        switch (this.globalCompositeOperation) {
            /*case BlendMode.NORMAL:
                var sourceFactor:string = Context3DBlendFactor.ONE;
                var destinationFactor:string = Context3DBlendFactor.ZERO;
                break;*/
            /*case BlendMode.LAYER:
                sourceFactor = Context3DBlendFactor.SOURCE_ALPHA;
                destinationFactor = Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA;
                break;*/
            case BlendMode.MULTIPLY:
                var sourceFactor:string = Context3DBlendFactor.ZERO;
                var destinationFactor:string = Context3DBlendFactor.SOURCE_COLOR;
                break;
            case BlendMode.ADD:
                sourceFactor = Context3DBlendFactor.SOURCE_ALPHA;
                destinationFactor = Context3DBlendFactor.ONE;
                break;
            case BlendMode.ALPHA:
                sourceFactor = Context3DBlendFactor.ZERO;
                destinationFactor = Context3DBlendFactor.SOURCE_ALPHA;
                break;
            default:
                sourceFactor = Context3DBlendFactor.ONE;
                destinationFactor = Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA;
                break;
                
        }
        this.ctx.setBlendFactors(sourceFactor, destinationFactor);
        this.ctx.drawTriangles(drawable.index.getBuff(this.ctx),0,drawable.numTriangles);
    }
    
    private batchFinish():void{
        var posKey:number = this.getNextPow2(this.numPos);
        var indexKey:number = this.getNextPow2(this.numIndex);
        var newpos:GLVertexBufferSet = this.posPool[posKey];
        var newuv:GLVertexBufferSet = this.uvPool[posKey];
        var newcolor:GLVertexBufferSet = this.colorPool[posKey];
        var newi:GLIndexBufferSet = this.indexPool[indexKey];
        if (newpos==null){
            newpos = this.posPool[posKey] = new GLVertexBufferSet(new Float32Array(posKey * 2), 2, this.ctx.gl.DYNAMIC_DRAW);
            console.log("bat new pos", posKey, this.numPos);
        }
        if (newuv==null && this.lastImageIsImage){
            newuv = this.uvPool[posKey] = new GLVertexBufferSet(new Float32Array(posKey * 2), 2, this.ctx.gl.DYNAMIC_DRAW);
        }
        if (newcolor==null && this.updateColor){
            newcolor = this.colorPool[posKey] = new GLVertexBufferSet(new Uint32Array(posKey), 4, this.ctx.gl.DYNAMIC_DRAW);
        }
        if (newi==null){
            newi = this.indexPool[indexKey] = new GLIndexBufferSet(new Uint16Array(indexKey * 3), this.ctx.gl.DYNAMIC_DRAW);
            console.log("bat new index", indexKey, this.numIndex);
        }
        var newposdata:Float32Array = newpos.data as Float32Array;
        if(this.lastImageIsImage){
            var newuvdata:Float32Array = newuv.data as Float32Array;
        }
        if(this.updateColor){
            var newcolordata:Uint32Array = newcolor.data as Uint32Array;
        }
        var newidata:Uint16Array = newi.data;
        this.newDrawable.index = newi;
        this.newDrawable.pos = newpos;
        this.newDrawable.uv = newuv;
        this.newDrawable.color = newcolor;
        this.newDrawable.numTriangles = this.numIndex;
        var si:number = 0;
        var il:number = 0;
        if (this.lastImageIsImage){
            var iw:number = (this.lastImage as HTMLImageElement).width as number;
            var ih:number = (this.lastImage as HTMLImageElement).height as number;
        }
        var len:number = this.batchsLen;
        for (var i:number = 0; i < len; i++ ){
            var batch:Array<any> = this.batchs[i];
            var drawable2:GLDrawable = batch[1]; 
            var posmatr:Matrix = batch[2];
            var scaleWithImage:Boolean = batch[4];
            var scaleWithImageUV:Boolean = batch[6];
            var color:number = batch[5] as number;
            if(this.lastImageIsImage){
                var uvmatr:Matrix = batch[3];
                if(uvmatr){
                    this.matrhelp.copyFrom(posmatr);
                    this.matrhelp.invert();
                    this.matrhelp.concat(uvmatr);
                    this.matrhelp.b *=-1;
                    this.matrhelp.c *=-1;
                    this.matrhelp.tx *=-1;
                    this.matrhelp.ty *=-1;
                }
            }
            var data:Float32Array = drawable2.pos.data as Float32Array;
            if(this.lastImageIsImage){
                var uvdata:Float32Array = drawable2.uv.data as Float32Array;
            }
            var len2:number = data.length/2 ;
            for (var j:number = 0; j < len2; j++ ){
                var x:number = data[j*2] as number;
                var y:number = data[j*2 + 1] as number;
                if (scaleWithImage){
                    x *= iw;
                    y *= ih;
                }
                var x2:number = posmatr.a * x + posmatr.c * y + posmatr.tx;
                var y2:number = posmatr.d * y + posmatr.b * x + posmatr.ty;
                newposdata[(si + j)*2] = x2;
                newposdata[(si + j)*2 + 1] = y2;
                if(this.lastImageIsImage){
                    x = uvdata[j*2] as number;
                    y = uvdata[j*2 + 1] as number;
                    if (scaleWithImageUV){
                        x *=iw;
                        y *= ih;
                    }
                    if(uvmatr){
                        x2 = this.matrhelp.a * x + this.matrhelp.c * y + this.matrhelp.tx;
                        y2 = this.matrhelp.d * y + this.matrhelp.b * x + this.matrhelp.ty;
                        newuvdata[(si + j)*2] = x2;
                        newuvdata[(si + j)*2 + 1] = y2;
                    }else{
                        newuvdata[(si + j)*2] = x;
                        newuvdata[(si + j)*2 + 1] = y;
                    }
                }
                if(this.updateColor){
                    newcolordata[(si + j)] = color;//0xff0000ff// color[0];
                    //newcolordata[(si + j)*4+1] = color[1];
                    //newcolordata[(si + j)*4+2] = color[2];
                    //newcolordata[(si + j)*4+3] = color[3];
                }
            }
            var did:Uint16Array = drawable2.index.data;
            var didl:number = did.length;
            for (j = 0; j < didl;j++){
                var vi:number = did[j] as number;
                newidata[il + j] = vi + si;
            }
            si += len2;
            il += didl;
        }
        this.newDrawable.index.dirty = true;
        this.newDrawable.pos.dirty = true;
        if(this.lastImageIsImage){
            this.newDrawable.uv.dirty = true;
        }
        if(this.updateColor){
            this.newDrawable.color.dirty = true;
        }
        this.renderImage(this.lastImage, this.newDrawable, null, null, false, false, this.lastImageIsImage instanceof HTMLImageElement);
        this.batchsLen = 0;
    }

    public fill (/*opt_fillRule:string = ""*/) : Object {
        if (this.fillStyleIsImage) {
            var glcp:GLCanvasPattern = this.fillStyle as GLCanvasPattern;
            this.drawImageInternal(glcp.image, this.currentPath.drawable,this.currentPath.matr,this.matr,false,this.colorTransform.tint,this.currentPath.path.tris.length>0,true);
        }else if(this.currentPath){
            this.drawImageInternal(this.fillStyle as HTMLCanvasElement, this.currentPath.drawable,this.currentPath.matr,null,false, parseFloat(this.fillStyle as string),false,false);
        }
        return null;
    }

    public fillRect (x:number, y:number, w:number, h:number) : Object {
        return null;
    }

    public fillText (text:string, x:number, y:number/*, opt_maxWidth:number = 0*/) : Object {
        var image:HTMLCanvasElement = this.text2img[text];
        if (image==null) {
            image = this.text2img[text]=document.createElement("canvas") as HTMLCanvasElement;
            var ctx:CanvasRenderingContext2D = image.getContext("2d") as CanvasRenderingContext2D;
            ctx.font = this.font;
            var measure:TextMetrics = ctx.measureText(text);
            image.width = measure.width;
            image.height = parseInt(this.font.substring(0, this.font.indexOf("px")));
            ctx.font = this.font;
            ctx.textBaseline = "top";
            ctx.fillStyle = this.fillStyle as string | CanvasPattern | CanvasGradient;
            ctx.fillText(text, 0, 0);
        }
        this.matrhelp.copyFrom(this.matr);
        this.matrhelp.translate(x, y);
        this.drawImageInternal(image, this.bitmapDrawable, this.matrhelp.clone(),null,true, this.colorTransform.tint,true,true);
        return null;
    }

    public getImageData (sx:number, sy:number, sw:number, sh:number) : ImageData {
        return null;
    }

    public isPointInPath (x:number, y:number, opt_fillRule:string = "") : Boolean {
        return false;
    }

    public lineTo (x:number, y:number) : Object {
        this. currentPath.path.lineTo(x, y);
        return null;
    }

    public measureText (text:string) : TextMetrics {
        return null;
    }

    public moveTo (x:number, y:number) : Object {
        this.currentPath.path.moveTo(x, y);
        return null;
    }

    public putImageData (imagedata:ImageData, dx:number, dy:number, opt_dirtyX:number = 0, opt_dirtyY:number = 0, opt_dirtyWidth:number = 0, opt_dirtyHeight:number = 0) : Object {
        return null;
    }

    public quadraticCurveTo (cpx:number, cpy:number, x:number, y:number) : Object {
        this.currentPath.path.curveTo(cpx, cpy, x, y);
        return null;
    }

    public rect (x:number, y:number, w:number, h:number) : Object {
        this.currentPath.path.moveTo(x, y);
        this.currentPath.path.lineTo(x + w, y);
        this.currentPath.path.lineTo(x + w, y + h);
        this.currentPath.path.lineTo(x, y + h);
        this.currentPath.path.closePath();
        return null;
    }

    /*public function restore () : Object {
        var state:GLCanvasState = states[statesPos--];
        matr.copyFrom(state.matr);
        return null;
    }

    public function rotate (angle:number) : Object {
        matr.rotate(angle);
        return null;
    }

    public function save () : Object {
        var state:GLCanvasState = states[++statesPos];
        if (state==null){
            state = states[statesPos] = new GLCanvasState;
        }
        state.matr.copyFrom(matr);
        return null;
    }

    public function scale (x:number, y:number) : Object {
        matr.scale(x, y);
        return null;
    }
    
    public function translate (x:number, y:number) : Object {
        matr.translate(x, y);
        return null;
    }*/

    public setTransform (m11:number, m12:number, m21:number, m22:number, dx:number, dy:number) : Object {
        //matr.setTo(m11, m12, m21, m22, dx, dy);
        return null;
    }
    public setTransform2 (m:Matrix) : Object {
        this.matr = m;// r.copyFrom(m);
        return null;
    }
    public stroke () : Object {
        return null;
    }

    public strokeRect (x:number, y:number, w:number, h:number) : Object {
        return null;
    }

    public strokeText (text:string, x:number, y:number, opt_maxWidth:number = 0) : Object {
        return null;
    }

    /*public function transform (m11:number, m12:number, m21:number, m22:number, dx:number, dy:number) : Object {
        matrhelp.setTo(m11, m12, m21, m22, dx, dy);
        matr.concat(matrhelp);
        return null;
    }*/
    public transform2 (m:Matrix) : Object {
        var result_a:number = this.matr.a / m.a;
        var result_b:number = 0.0;
        var result_c:number = 0.0;
        var result_d:number = this.matr.d / m.d;
        var result_tx:number = this.matr.tx / m.a + m.tx / m.a;
        var result_ty:number = this.matr.ty / m.d + m.ty / m.d;
        if (this.matr.b != 0.0 || this.matr.c != 0.0 || m.b != 0.0 || m.c != 0.0)
        {
            result_a = result_a + this.matr.b * m.c;
            result_d = result_d + this.matr.c * m.b;
            result_b = result_b + (this.matr.a * m.b + this.matr.b * m.d);
            result_c = result_c + (this.matr.c * m.a + this.matr.d * m.c);
            result_tx = result_tx + this.matr.ty * m.c;
            result_ty = result_ty + this.matr.tx * m.b;
        }
        m.a = result_a;
        m.b = result_b;
        m.c = result_c;
        m.d = result_d;
        m.tx = result_tx;
        m.ty = result_ty;
        this.matr = m;
        return null;
    }
    
    private getTexture(img:any):BitmapTexture {
        var btexture:BitmapTexture = img._texture;
        if (btexture == null) {
            var w:number = this.getNextPow2(img.width);
            var h:number = this.getNextPow2(img.height);
            btexture = new BitmapTexture();
            btexture.img = img;
            var bmd:BitmapData = new BitmapData(w, h, true, 0);
            btexture.bmd = bmd;
            btexture.width = w;
            btexture.height = h;
            img._texture = btexture;
            btexture.bmd.image["dirty"] = true;
            //bmd2texture.set(img, btexture);
        }
        if (btexture.dirty){
            btexture.texture = this.ctx.createTexture(w, h, Context3DTextureFormat.BGRA, false);
            if (img.width == this.getNextPow2(img.width) && img.height == this.getNextPow2(img.height)){
                btexture.bmd["image"] = img;
            }else{
                btexture.bmd.fromImage(img);
            }
            btexture.dirty = false;
            btexture.bmd.image["dirty"] = true;
        }
        if (btexture.bmd.image["dirty"]){
            btexture.bmd.image["dirty"] = false;
            btexture.texture.uploadFromBitmapData(btexture.bmd, 1);
        }
        return btexture;
    }
    
    private getNextPow2(v:number):number {
        var r:number = 1;
        while (r < v) {
            r *= 2;
        }
        return r;
    }
    
    public flush():void{
        if (this.numPos > 0){
            this.batchFinish();
        }
        this.numPos = 0;
        this.numIndex = 0;
        this.lastImage = null;
        this.lastImageIsImage = null;
    }
}