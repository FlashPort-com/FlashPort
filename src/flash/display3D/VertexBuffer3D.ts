import { ByteArray } from "../utils/ByteArray";

export class VertexBuffer3D extends Object
{
	public buff:WebGLBuffer;
	public gl:WebGLRenderingContext;
	public data32PerVertex:number;
	public dirty:boolean = true;

	constructor()
	{
		super();
	}
	
	public uploadFromVector(data:number[], startVertex:number, numVertices:number):void
	{
		this.dirty = true;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buff);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
	}
	
	public uploadFromByteArray(data:ByteArray, byteArrayOffset:number, startVertex:number, numVertices:number) : void{}
	
	public dispose():void
	{
		this.gl.deleteBuffer(this.buff);
		this.buff = null;
	}
}