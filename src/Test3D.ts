//import com.adobe.utils.AGALMiniAssembler;
import { Bitmap } from "./flash/display/Bitmap.js";
import { Loader } from "./flash/display/Loader.js";
import { LoaderInfo } from "./flash/display/LoaderInfo.js";
import { Stage } from "./flash/display/Stage.js";
import { StageAlign } from "./flash/display/StageAlign.js";
import { StageScaleMode } from "./flash/display/StageScaleMode.js";
import { Context3D } from "./flash/display3D/Context3D.js";
import { Context3DProgramType } from "./flash/display3D/Context3DProgramType.js";
import { Context3DTextureFormat } from "./flash/display3D/Context3DTextureFormat.js";
import { Context3DTriangleFace } from "./flash/display3D/Context3DTriangleFace.js";
import { Context3DVertexBufferFormat } from "./flash/display3D/Context3DVertexBufferFormat.js";
import { IndexBuffer3D } from "./flash/display3D/IndexBuffer3D.js";
import { Program3D } from "./flash/display3D/Program3D.js";
import { Texture } from "./flash/display3D/textures/Texture.js";
import { VertexBuffer3D } from "./flash/display3D/VertexBuffer3D.js";
import { Matrix3D } from "./flash/geom/Matrix3D.js";
import { Vector3D } from "./flash/geom/Vector3D.js";
import { URLLoader } from "./flash/net/URLLoader.js";
import { URLRequest } from "./flash/net/URLRequest.js";
import { AEvent } from "./flash/events/AEvent.js";
import { ByteArray } from "./flash/utils/ByteArray.js";
import { getTimer } from "./flash/utils/getTimer.js";
import { BitmapData } from "./flash/display/BitmapData.js";
import { Sprite } from "./flash/display/Sprite.js";
import { Stats } from "./flashport/Stats.js";
import { FlashPort } from "./FlashPort.js";
import { Camera3DOrbit } from "./flashport/Camera3DOrbit.js";

export class Test3D extends Sprite
{
    private ctx:Context3D;
    private vmatr:Matrix3D = new Matrix3D();
    private pmatr:Matrix3D = new Matrix3D();
    private bmd:BitmapData;
    private vcode:string;
    private fcode:string;
    private meshs:Array<Mesh> = [];
    private lightPos:Array<number> = [0,20,-10,0];
    private lightColor:Array<number> = [1,1,1,1];

    private camera:Camera3DOrbit;
    
    constructor() 
    {
        super();

        FlashPort.autoSize = true;
        
        var loader:Loader = new Loader();
        loader.contentLoaderInfo.addEventListener(AEvent.COMPLETE, this.textureLoadComplete);
        loader.load(new URLRequest("assets/crate/Wood_Crate_001_basecolor.jpg"));
        
        this.stage.align = StageAlign.TOP_LEFT;
        this.stage.scaleMode = StageScaleMode.NO_SCALE;

        this.addChild(new Stats());

        // create 2d Box using basic Canvas API
        let box:Sprite = new Sprite();
        box.graphics.beginFill(0xFF0000, .75);
        box.graphics.drawRoundRect(0, 0, 200, 200, 9, 9);
        box.x = box.y = 200;
        this.addChild(box);

        this.camera = new Camera3DOrbit(25); // 25 radius distance from camera
    }
    
    private updateLoop = (e:Event):void =>
    {
        this.pmatr.identity();
        this.pmatr.append(this.camera.matrix);
        this.vmatr.identity();
        this.vmatr.appendTranslation(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        this.vmatr.appendRotation(getTimer()/100, Vector3D.Y_AXIS);
        this.vmatr.invert();
        // clear canvas
        this.ctx.clear();

        //draw
        let first:Boolean = true;
        for(let mesh of this.meshs)
        {
            this.ctx.setProgram(mesh.program);
            var mmatr:Matrix3D = mesh.mmatr;

            if (first) 
            {
                first = false;
                this.ctx.setTextureAtGL("uSampler", 0, mesh.texture);
                this.ctx.setVertexBufferAtGL("aVertexPosition", mesh.posBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
                this.ctx.setVertexBufferAtGL("aVertexNormal", mesh.normBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
                this.ctx.setVertexBufferAtGL("aTextureCoord", mesh.uvBuffer, 0, Context3DVertexBufferFormat.FLOAT_2);
                
                this.ctx.setProgramConstantsFromMatrixGL("uVMatrix", this.vmatr, false);
                this.ctx.setProgramConstantsFromMatrixGL("uPMatrix", this.pmatr, false);
                var gl:WebGLRenderingContext = mesh.program.gl;
                //draw
                gl.uniform1f(mesh.program.getUniformLocation("uMaterialShininess"), mesh.specular[0]);
                gl.uniform1i(mesh.program.getUniformLocation("uShowSpecularHighlights"), 1);
                gl.uniform1i(mesh.program.getUniformLocation("uUseTextures"), 1);
                gl.uniform1i(mesh.program.getUniformLocation("uUseLighting"), 1);
                gl.uniform3f(mesh.program.getUniformLocation("uAmbientColor"), mesh.ambient[0], mesh.ambient[1], mesh.ambient[2]);
                gl.uniform3f(mesh.program.getUniformLocation("uPointLightingLocation"), this.lightPos[0], this.lightPos[1], this.lightPos[2]);
                gl.uniform3f(mesh.program.getUniformLocation("uPointLightingSpecularColor"), 1, 1, 1);
                gl.uniform3f(mesh.program.getUniformLocation("uPointLightingDiffuseColor"), this.lightColor[0], this.lightColor[1], this.lightColor[2]);
            }
            this.ctx.setProgramConstantsFromMatrixGL("uMMatrix", mmatr, false);
            
            this.ctx.drawTriangles(mesh.ibuffer, 0);
        }
        this.ctx.present();
    }
    
    private textureLoadComplete = (e:AEvent):void =>
    {
        var target:LoaderInfo = e.currentTarget as LoaderInfo;
        this.bmd = (target.content as Bitmap).bitmapData;
        
        var loader:URLLoader = new URLLoader(new URLRequest("assets/glsl/per-fragment-lighting.vert"));
        loader.addEventListener(AEvent.COMPLETE, this.vert_loader_complete);
    }
    
    private vert_loader_complete = (e:AEvent):void =>
    {
        var loader:URLLoader = e.currentTarget as URLLoader;
        this.vcode = loader.data;
        loader = new URLLoader(new URLRequest("assets/glsl/per-fragment-lighting.frag"));
        loader.addEventListener(AEvent.COMPLETE, this.frag_loader_complete);
    }
    
    private frag_loader_complete = (e:AEvent):void =>
    {
        var loader:URLLoader = e.currentTarget as URLLoader;
        this.fcode = loader.data;
        
        //init gl
        this.stage.stage3Ds[0].addEventListener(AEvent.CONTEXT3D_CREATE, this.context3dCreate);
        this.stage.stage3Ds[0].requestContext3D();
    }
    
    private context3dCreate = (e:Event):void =>
    {
        this.stage.addEventListener(AEvent.RESIZE, this.stage_resize);
        
        this.ctx = this.stage.stage3Ds[0].context3D;
        this.ctx.configureBackBuffer(this.stage.stageWidth, this.stage.stageHeight, 2);
        
        //init texture
        var texture:Texture = this.ctx.createTexture(this.bmd.width, this.bmd.height, Context3DTextureFormat.BGRA, false);
        texture.uploadFromBitmapData(this.bmd, 3); // 3 mipmap levels
        
        //init shader
        var vb:ByteArray = new ByteArray();
        vb.writeUTFBytes(this.vcode);
        var fb:ByteArray = new ByteArray();
        fb.writeUTFBytes(this.fcode);
        
        var program:Program3D = this.ctx.createProgram();
        program.upload(vb, fb);
        
        //init buffer
        var posData:Array<number> = // Front face
        [-1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0];

        var posBuffer:VertexBuffer3D = this.ctx.createVertexBuffer(posData.length/3,3);
        posBuffer.uploadFromVector(posData, 0, posData.length / 3);
        
        var normData:Array<number> = 
        [// Front face
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back face
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top face
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom face
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right face
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0];
        var normBuffer:VertexBuffer3D = this.ctx.createVertexBuffer(normData.length/3,3);
        normBuffer.uploadFromVector(normData, 0, normData.length / 3);
        
        var uvData:Array<any> = [ 
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0];

        var uvBuffer:VertexBuffer3D = this.ctx.createVertexBuffer(uvData.length/2,2);
        uvBuffer.uploadFromVector(uvData,0,uvData.length/2);
        var iData:Array<number> = [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    // Back face
            8, 9, 10,     8, 10, 11,  // Top face
            12, 13, 14,   12, 14, 15, // Bottom face
            16, 17, 18,   16, 18, 19, // Right face
            20, 21, 22,   20, 22, 23  // Left face;
        ];

        var ibuffer:IndexBuffer3D = this.ctx.createIndexBuffer(iData.length);
        ibuffer.uploadFromVector(iData, 0, iData.length);
        
        // create random positioned and rotated boxes
        for (var i:number = 0; i < 500; i++)
        {
            var mesh:Mesh = new Mesh();
            mesh.ibuffer = ibuffer;
            mesh.mmatr = new Matrix3D();
            mesh.normBuffer = normBuffer;
            mesh.posBuffer = posBuffer;
            mesh.program = program;
            mesh.texture = texture;
            mesh.uvBuffer = uvBuffer;
            mesh.mmatr.appendRotation(360 * Math.random(), Vector3D.X_AXIS);
            mesh.mmatr.appendRotation(360 * Math.random(), Vector3D.Y_AXIS);
            mesh.mmatr.appendRotation(360 * Math.random(), Vector3D.Z_AXIS);
            mesh.mmatr.prependTranslation((Math.random() - .5)*100, (Math.random() - .5)*100, (Math.random() - .5)*100 );
            this.meshs.push(mesh);
        }

        this.addEventListener(AEvent.ENTER_FRAME, this.updateLoop);
    }
    
    private stage_resize = (e:AEvent):void =>
    {
        this.ctx.configureBackBuffer(this.stage.stageWidth, this.stage.stageHeight, 2);
    }
    
    public perspectiveFieldOfViewLH = (fieldOfViewY:number, aspectRatio:number, zNear:number, zFar:number):Array<number> => 
    {
        var yScale:number = 1.0 / Math.tan(fieldOfViewY / 2.0);
        var xScale:number = yScale / aspectRatio; 

        return [
            xScale, 0.0, 0.0, 0.0,
            0.0, yScale, 0.0, 0.0,
            0.0, 0.0, zFar/(zFar-zNear), 1.0,
            0.0, 0.0, (zNear*zFar)/(zNear-zFar), 0.0
        ];
    }
}


class Mesh {
	public ibuffer:IndexBuffer3D;
	public mmatr:Matrix3D = new Matrix3D;
	public texture:Texture;
	public program:Program3D;
	public normBuffer:VertexBuffer3D;
	public uvBuffer:VertexBuffer3D;
	public posBuffer:VertexBuffer3D;
	public specular:Array<number> = [30,0,0,0];
	public ambient:Array<number> = [.5, .5, .5, 1];
}

window['app'] = new Test3D();  // lets kick this thing off.