import { LineInfo } from "./LineInfo";
import { UVTexture } from "./UVTexture";

export class Char 
{
    public size:number;
    public font:string;
    public v:string;
    public texture:UVTexture;
    private _color:number;
    public indent:number;
    public underline:number;
    public leading:number;
    
    public bgr:number;
    
    public x0:number;
    public x1:number;
    public y0:number;
    public y1:number;
    public charVersion:number = 0;
    public lineInfo:LineInfo;

    constructor(v:string,size:number,font:string,color:number) 
    {
        this.font = font;
        this.size = size;
        this.v = v;
        this.color = color;
    }
    
    public get color():number 
    {
        return this._color;
    }
    
    public set color(value:number) 
    {
        this._color = value;
        this.bgr =/* 0xff000000 |*/ ((this._color >> 16) & 0xff) | (((this._color >> 8) & 0xff) << 8) | ((this._color & 0xff) << 16);
    }
    
}