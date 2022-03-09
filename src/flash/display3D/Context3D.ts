import { Program3D } from "./Program3D.js";
import { FlashPort } from "../../FlashPort.js";
import { IndexBuffer3D } from "./IndexBuffer3D.js";
import { Context3DProgramType } from "./Context3DProgramType.js";
import { VertexBuffer3D } from "./VertexBuffer3D.js";
import { Context3DVertexBufferFormat } from "./Context3DVertexBufferFormat.js";
import { Context3DBlendFactor } from "./Context3DBlendFactor.js";
import { Context3DCompareMode } from "./Context3DCompareMode.js";
import { TextureBase } from "./textures/TextureBase.js";
import { Texture } from "./textures/Texture.js";
import { CubeTexture } from "./textures/CubeTexture.js";
import { RectangleTexture } from "./textures/RectangleTexture.js";
import { VideoTexture } from "./textures/VideoTexture.js";
import { Context3DTriangleFace } from "./Context3DTriangleFace.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { Matrix3D } from "../geom/Matrix3D.js";
import { ByteArray } from "../utils/ByteArray.js";
import { Rectangle } from "../geom/Rectangle.js";
import { BitmapData } from "../display/BitmapData.js";

export class Context3D extends EventDispatcher
{
	public canvas:HTMLCanvasElement;
	public gl:WebGLRenderingContext;
	private currentProgram:Program3D;
	private currentTextures:Object = { };
	private currentVBufs:Object = { };
	constructor(){
		super();
	}
	
	public static get supportsVideoTexture():boolean  { return false }
	
	public get driverInfo():string  { return null }
	
	public dispose(recreate:boolean = true):void
	{
	}
	
	public get enableErrorChecking():boolean  { return false }
	
	public set enableErrorChecking(toggle:boolean)
	{
	}
	
	public configureBackBuffer(width:number, height:number, antiAlias:number, enableDepthAndStencil:boolean = true, wantsBestResolution:boolean = false):void
	{
		this.canvas.width = width;
		this.canvas.height = height;
		this.canvas.style.width = width + "px";
		this.canvas.style.height = height + "px";
		this.gl.viewport(0, 0, width, height);
		if (enableDepthAndStencil)
		{
			this.gl.enable(this.gl.DEPTH_TEST);
			this.gl.enable(this.gl.STENCIL_TEST);
		}
		else
		{
			this.gl.disable(this.gl.DEPTH_TEST);
			this.gl.disable(this.gl.STENCIL_TEST);
		}
	}
	
	public clear(red:number = 0, green:number = 0, blue:number = 0, alpha:number = 1, depth:number = 1, stencil:number = 0, mask:number = 4294967295):void
	{
		FlashPort.dirtyGraphics = true;
		this.gl.clearColor(red, green, blue, alpha);
		this.gl.clearDepth(depth);
		this.gl.clearStencil(stencil);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}
	
	public drawTriangles(indexBuffer:IndexBuffer3D, firstIndex:number = 0, numTriangles:number = -1):void
	{
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buff);
		this.gl.drawElements(this.gl.TRIANGLES, numTriangles < 0 ? indexBuffer.count : numTriangles * 3, this.gl.UNSIGNED_SHORT, firstIndex * 2);
	}
	
	public present():void
	{
		FlashPort.dirtyGraphics = true;
	}
	
	public setProgram(program:Program3D):void
	{
		if(this.currentProgram!=program){
			this.currentProgram = program;
			this.gl.useProgram(program.program);
		}
	}
	
	public setProgramConstantsFromVector(programType:string, firstRegister:number, data:number[], numRegisters:number = -1):void
	{
		//var num:number =gl.getProgramParameter(currentProgram.program, gl.ACTIVE_UNIFORMS);
		//var count:number = 0;
		//for (var i:number = 0; i < num;i++ ) {
		//	var au:WebGLActiveInfo = gl(currentProgram.program, i);
		//}
		this.setProgramConstantsFromVectorGL(this.getUniformLocationName(programType, firstRegister), data, numRegisters);
	}
	
	public setProgramConstantsFromMatrix(programType:string, firstRegister:number, matrix:Matrix3D, transposedMatrix:boolean = false):void
	{
		this.setProgramConstantsFromMatrixGL(this.getUniformLocationName(programType, firstRegister), matrix, transposedMatrix);
	}
	
	public setProgramConstantsFromByteArray(programType:string, firstRegister:number, numRegisters:number, data:ByteArray, byteArrayOffset:number):void
	{

	}

	public setProgramConstantsFromVectorGL(name:string, data:number[], numRegisters:number = -1):void
	{
		this.gl.uniform4fv(this.getUniformLocation(name), data);
	}
	
	public setProgramConstantsFromMatrixGL(name:string, matrix:Matrix3D, transposedMatrix:boolean = false):void
	{
		if (transposedMatrix) {
			matrix.transpose();
		}
		this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, matrix.rawData);
		if (transposedMatrix) {
			matrix.transpose();
		}
	}
	
	public setProgramConstantsFromByteArrayGL(name:string , numRegisters:number, data:ByteArray, byteArrayOffset:number):void
	{
	}
	
	private getUniformLocationName(programType:string, register:number):string
	{
		return (Context3DProgramType.VERTEX === programType) ? ("vc" + register) : ("fc" + register);
	}
	private getUniformLocation(name:string):WebGLUniformLocation
	{
		return this.currentProgram.getUniformLocation(name);
	}
	
	public setVertexBufferAt(index:number, buffer:VertexBuffer3D, bufferOffset:number = 0, format:string = "float4"):void
	{
		this.setVertexBufferAtGL("va" + index, buffer, bufferOffset, format);
	}
	
	public setVertexBufferAtGL(name:string, buffer:VertexBuffer3D, bufferOffset:number = 0, format:string = "float4"):void
	{
		if (buffer.dirty || this.currentVBufs[name] != buffer) {
			buffer.dirty = false;
			this.currentVBufs[name] = buffer;
			var loc:number= this.currentProgram.getAttribLocation(name);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buff);
			var type:number = this.gl.FLOAT;
			var size:number = 0;
			var mul:number=4;
			var normalized:boolean = false;
			switch (format)
			{
			case Context3DVertexBufferFormat.FLOAT_1: 
				size = 1;
				break;
			case Context3DVertexBufferFormat.FLOAT_2: 
				size = 2;
				break;
			case Context3DVertexBufferFormat.FLOAT_3: 
				size = 3;
				break;
			case Context3DVertexBufferFormat.FLOAT_4: 
				size = 4;
				break;
			case Context3DVertexBufferFormat.BYTES_4: 
				size = 4;
				type = this.gl.UNSIGNED_BYTE;
				normalized = true;
				mul = 1;
				break;
			}
			this.gl.vertexAttribPointer(loc, size, type, normalized, buffer.data32PerVertex * mul, bufferOffset*mul);
		}
	}
	
	public setBlendFactors(sourceFactor:string, destinationFactor:string):void
	{
		this.gl.enable(this.gl.BLEND);
		this.gl.blendEquation(this.gl.FUNC_ADD);
		this.gl.blendFunc(Context3DBlendFactor.getGLVal(this.gl,sourceFactor), Context3DBlendFactor.getGLVal(this.gl,destinationFactor));
	}
	
	public setColorMask(red:boolean, green:boolean, blue:boolean, alpha:boolean):void
	{
		this.gl.colorMask(red, green, blue, alpha);
	}
	
	public setDepthTest(depthMask:boolean, passCompareMode:string):void
	{
		this.gl.depthFunc(Context3DCompareMode.getGLVal(this.gl,passCompareMode));
		this.gl.depthMask(depthMask);
	}
	
	public setTextureAt(sampler:number, texture:TextureBase):void
	{
		if (texture == null)
		{
			this.setTextureInternal(sampler, null);
		}
		else if (texture instanceof Texture)
		{
			this.setTextureInternal(sampler, (<Texture>texture ));
		}
		else if (texture instanceof CubeTexture)
		{
			this.setCubeTextureInternal(sampler, (<CubeTexture>texture ));
		}
		else if (texture instanceof RectangleTexture)
		{
			this.setRectangleTextureInternal(sampler, (<RectangleTexture>texture ));
		}
		else if (texture instanceof VideoTexture)
		{
			this.setVideoTextureInternal(sampler, (<VideoTexture>texture ));
		}
	}
	
	public setRenderToTexture(texture:TextureBase, enableDepthAndStencil:boolean = false, antiAlias:number = 0, surfaceSelector:number = 0, colorOutputIndex:number = 0):void
	{
		var targetType:number = 0;
		if (texture instanceof Texture)
		{
			targetType = 1;
		}
		else if (texture instanceof CubeTexture)
		{
			targetType = 2;
		}
		else if (texture instanceof RectangleTexture)
		{
			targetType = 3;
		}
		else if (texture != null)
		{
			throw "texture argument not derived from TextureBase (can be Texture, CubeTexture, or if supported, RectangleTexture)";
		}
		this.setRenderToTextureInternal(texture, targetType, enableDepthAndStencil, antiAlias, surfaceSelector, colorOutputIndex);
	}
	
	public setRenderToBackBuffer():void
	{
	}
	
	private setRenderToTextureInternal(param1:TextureBase, param2:number, param3:boolean, param4:number, param5:number, param6:number):void
	{

	}
	
	public setCulling(triangleFaceToCull:string):void
	{
		if (triangleFaceToCull === Context3DTriangleFace.NONE)
		{
			this.gl.disable(this.gl.CULL_FACE);
		}
		else
		{
			this.gl.enable(this.gl.CULL_FACE);
			this.gl.cullFace(Context3DTriangleFace.getGLVal(this.gl,triangleFaceToCull));
		}
	}
	
	public setStencilActions(triangleFace:string = "frontAndBack", compareMode:string = "always", actionOnBothPass:string = "keep", actionOnDepthFail:string = "keep", actionOnDepthPassStencilFail:string = "keep"):void
	{

	}
	
	public setStencilReferenceValue(referenceValue:number, readMask:number = 255, writeMask:number = 255):void
	{

	}
	
	public setScissorRectangle(rectangle:Rectangle):void
	{
		if (rectangle == null)
		{
			this.gl.disable(this.gl.SCISSOR_TEST);
		}
		else
		{
			this.gl.enable(this.gl.SCISSOR_TEST);
			this.gl.scissor(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
		}
	}
	
	public createVertexBuffer(numVertices:number, data32PerVertex:number, bufferUsage:string = "staticDraw"):VertexBuffer3D
	{
		var buffer:VertexBuffer3D = new VertexBuffer3D;
		buffer.buff = this.gl.createBuffer();
		buffer.data32PerVertex = data32PerVertex;
		buffer.gl = this.gl;
		return buffer;
	}
	
	public createIndexBuffer(numIndices:number, bufferUsage:string = "staticDraw"):IndexBuffer3D
	{
		var buffer:IndexBuffer3D = new IndexBuffer3D;
		buffer.buff = this.gl.createBuffer();
		buffer.gl = this.gl;
		buffer.count = numIndices;
		return buffer;
	}
	
	public createTexture(width:number, height:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number = 0):Texture
	{
		var t:Texture = new Texture;
		t.gl = this.gl;
		t.texture = this.gl.createTexture();
		return t;
	}
	
	public createCubeTexture(size:number, format:string, optimizeForRenderToTexture:boolean, streamingLevels:number = 0):CubeTexture  { return null }
	
	public createRectangleTexture(width:number, height:number, format:string, optimizeForRenderToTexture:boolean):RectangleTexture  { return null }
	
	public createProgram():Program3D
	{
		var p:Program3D = new Program3D;
		p.gl = this.gl;
		p.program = this.gl.createProgram();
		return p;
	}
	
	public drawToBitmapData(destination:BitmapData):void
	{

	}
	
	public setSamplerStateAt(sampler:number, wrap:string, filter:string, mipfilter:string):void
	{

	}
	
	public get profile():string  { return null }
	
	private setTextureInternal(sampler:number, texture:Texture):void
	{
		this.setTextureAtGL("fs" + sampler, sampler, texture);
	}
	
	public setTextureAtGL(name:string, sampler:number, texture:Texture):void 
	{
		if (this.currentTextures[name] != texture||(texture&&texture.up)) {
			this.currentTextures[name] = texture;
			if (texture)
			{
				texture.up = false;
				this.gl.activeTexture(this.gl["TEXTURE"+sampler]);
				this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);
				this.gl.uniform1i(this.currentProgram.getUniformLocation(name), sampler);
			}
		}
	}
	
	private setCubeTextureInternal(param1:number, param2:CubeTexture):void
	{

	}
	
	private setRectangleTextureInternal(param1:number, param2:RectangleTexture):void
	{

	}
	
	private setVideoTextureInternal(param1:number, param2:VideoTexture):void
	{

	}
	
	public get backBufferWidth():number  { return 0 }
	
	public get backBufferHeight():number  { return 0 }
	
	public get maxBackBufferWidth():number  { return 0 }
	
	public set maxBackBufferWidth(width:number)
	{

	}
	
	public get maxBackBufferHeight():number  { return 0 }
	
	public set maxBackBufferHeight(height:number)
	{
		
	}
	
	public createVideoTexture():VideoTexture  { return null }
}