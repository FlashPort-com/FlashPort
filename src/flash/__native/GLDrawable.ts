import { GLVertexBufferSet } from "../../flash/__native/GLVertexBufferSet.js";
import { GLIndexBufferSet } from "./GLIndexBufferSet.js";

export class GLDrawable 
{
    public pos:GLVertexBufferSet;
    public uv:GLVertexBufferSet;
    private _color:GLVertexBufferSet;
    private usage:number;
    public index:GLIndexBufferSet;
    public numTriangles:number = -1;

    constructor(posData:Float32Array,uvData:Float32Array,iData:Uint16Array,usage:number) 
    {
        this.usage = usage;
        if (posData){
            this.pos = new GLVertexBufferSet(posData, 2,usage);
        }
        if(uvData){
            this.uv = new GLVertexBufferSet(uvData, 2, usage);
        }
        if(iData){
            this.index = new GLIndexBufferSet(iData, usage);
        }
    }
    
    public get color():GLVertexBufferSet 
    {
        if (this._color==null || this._color.data.length != this.pos.data.length/2){
            //_color = new GLVertexBufferSet(new Float32Array(pos.data.length * 2), 4, usage);
            this._color = new GLVertexBufferSet(new Uint32Array(this.pos.data.length /2), 4, this.usage);
        }
        return this._color;
    }
    
    public set color(v:GLVertexBufferSet)
    {
        this._color = v;
    }
}