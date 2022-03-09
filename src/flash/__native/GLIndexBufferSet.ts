import { Context3D } from "../display3D/Context3D.js";
import { IndexBuffer3D } from "../display3D/IndexBuffer3D.js";

export class GLIndexBufferSet 
{
    private buff:IndexBuffer3D
    private usage:number;
    public dirty:boolean = true;
    public data:Uint16Array;

    constructor(data:Uint16Array,usage:number) 
    {
        this.usage = usage;
        this.data = data;
        
    }
    
    public getBuff(ctx:Context3D):IndexBuffer3D{
        //if (dirty){
        //var	buff:IndexBuffer3D = pool[data.length];
        if(this.buff==null){
            this.buff = ctx.createIndexBuffer(this.data.length);
            this.buff.gl.bindBuffer(this.buff.gl.ELEMENT_ARRAY_BUFFER, this.buff.buff);
            this.buff.gl.bufferData(this.buff.gl.ELEMENT_ARRAY_BUFFER, this.data, this.usage);
            this.dirty = false;
        }
        if(this.dirty){
            this.buff.gl.bindBuffer(this.buff.gl.ELEMENT_ARRAY_BUFFER, this.buff.buff);
            this.buff.gl.bufferSubData(this.buff.gl.ELEMENT_ARRAY_BUFFER,0, this.data);
            this.dirty = false;
        }
        //buff.uploadFromVector(Vector.<uint>(data), 0, data.length);
        
        return this.buff;
    }
}