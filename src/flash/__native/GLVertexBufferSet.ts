import { Context3D } from "../display3D/Context3D";
import { VertexBuffer3D } from "../display3D/VertexBuffer3D";

export class GLVertexBufferSet 
{
    public data:any;
    public data32PerVertex:number;
    private buff:VertexBuffer3D;
    private  usage:number;
    public dirty:boolean = true;

    constructor(data:Object, data32PerVertex:number, usage:number) 
    {
        this.usage = usage;
        this.data32PerVertex = data32PerVertex;
        this.data = data;
    }
    
    public getBuff(ctx:Context3D):VertexBuffer3D
    {
        if (this.buff==null){
            this.buff= ctx.createVertexBuffer(this.data.length / this.data32PerVertex, this.data32PerVertex);
            this.buff.gl.bindBuffer(this.buff.gl.ARRAY_BUFFER, this.buff.buff);
            this.buff.gl.bufferData(this.buff.gl.ARRAY_BUFFER, this.data, this.usage);
            this.dirty = false;
            this.buff.dirty = true;
        }
        if (this.dirty){
            this.buff.gl.bindBuffer(this.buff.gl.ARRAY_BUFFER, this.buff.buff);
            this.buff.gl.bufferSubData(this.buff.gl.ARRAY_BUFFER, 0, this.data);
            this.dirty = false;
            this.buff.dirty = true;
        }
        return this.buff;
    }
}