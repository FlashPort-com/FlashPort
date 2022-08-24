import { GraphicsPath } from "../display/GraphicsPath";
import { GraphicsPathCommand } from "../display/GraphicsPathCommand";
import { Context3D } from "../display3D/Context3D";
import { Matrix } from "../geom/Matrix";
import { GLDrawable } from "./GLDrawable";
import { GLGraphicsPath } from "./GLGraphicsPath";
import { MemArray } from "./MemArray";
export class GLPath2D 
{
    public matr:Matrix = new Matrix;
    public _drawable:GLDrawable;
    private pos:Float32Array;
    private uv:Float32Array;
    private index:Uint16Array;
    private ctx:Context3D;
    public path:GLGraphicsPath;

    constructor(ctx:Context3D) 
    {
        this.ctx = ctx;
        
    }
    
    public get drawable():GLDrawable{
        if (this.path.gpuPath2DDirty){
            this.path.gpuPath2DDirty = false;
            
            var polys:MemArray = this.path.polys;
            
            var nump:number = 0;
            var numi:number = 0;
            var len:number = this.path.polys.length as number;
            for (var i:number = 0; i < len;i++ ){
                var plen:number = this.path.polys.array[i].length as number;
                nump += plen;
                if(plen>=6){
                    numi += (plen / 2 - 2) * 3;
                }
            }
            var tlen:number = this.path.tris.length;
            var diffuv:Boolean = false;
            for (i = 0; i < tlen;i++ ){
                var tri:Array<any> = this.path.tris[i];
                nump += tri[0].length as number;
                numi += tri[1].length as number;
                if (tri[2]){
                    diffuv = true;
                }
            }
            if(this.pos==null || this.pos.length!=nump){
                this.pos = new Float32Array(nump);
            }
            if(this.index==null || this.index.length!=numi){
                this.index = new Uint16Array(numi);
            }
            if(diffuv && (this.uv==null || this.uv.length!=nump)){
                this.uv = new Float32Array(nump);
            }
            var offset:number = 0;
            var pi:number = 0;
            var ii:number = 0;
            for (i = 0; i < len; i++ ){
                var poly:MemArray = polys.array[i];
                plen = poly.length;
                var plendiv2:number = plen / 2;
                for (var j:number = 0; j < plendiv2; j++ ){
                    var x:number = poly.array[2 * j] as number;
                    var y:number = poly.array[2 * j + 1] as number;
                    this.pos[pi++] = x;
                    this.pos[pi++] = y;
                    if (j>=2){
                        this.index[ii++] = offset;
                        this.index[ii++] = offset+j-1;
                        this.index[ii++] = offset+j;
                    }
                }
                offset += j;
            }
            
            for (i = 0; i < tlen;i++ ){
                tri = this.path.tris[i];
                var vsdata:Array<number> = tri[0];
                var idata:Array<number> = tri[1];
                var uvdata:Array<number> = tri[2];
                var len2:number = vsdata.length as number;
                for (j = 0; j < len2;j++ ){
                    this.pos[pi] = vsdata[j];
                    if(uvdata)
                    this.uv[pi] = uvdata[j];
                    pi++;
                }
                len2 = idata.length as number;
                for (j = 0; j < len2;j++ ){
                    this.index[ii++] = offset + idata[j];
                }
                offset += vsdata.length / 2;
            }
            if(this._drawable==null){
                this._drawable = new GLDrawable(this.pos, this.pos, this.index, this.ctx.gl.STATIC_DRAW);
            }else{
                this._drawable.pos.data = this.pos;
                this._drawable.uv.data = diffuv ? this.uv: this.pos;
                this._drawable.index.data = this.index;
                this._drawable.pos.dirty = true;
                this._drawable.uv.dirty = true;
                this._drawable.index.dirty = true;
            }
        }
        return this._drawable;
    }
}