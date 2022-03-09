import { GraphicsPath } from "../display/GraphicsPath.js";
import { Vector3D } from "../geom/Vector3D.js";
import { MemArray } from "./MemArray.js";

export class GLGraphicsPath extends GraphicsPath
{
    public polys:MemArray = new MemArray;
    private poly:MemArray;

    constructor() 
    {
        super();
    }
    
    public clear = ():void =>
    {
        var len:number = this.polys.array.length;
        for (var i:number = 0; i < len;i++ ){
            this.polys.array[i].length = 0;
        }
        this.polys.length = 0;
        this.tris.length = 0;
    }
    
    public moveTo = (x:number, y:number):void =>
    {
        this.makePoly();
        //polys.push(makePoly());
        this.poly.push(x);
        this.poly.push(y);
        //poly.push(x, y);
    }
    
    public lineTo = (x:number, y:number):void =>
    {
        if (this.poly==null){
            this.makePoly();
        }
        //poly.push(x, y);
        this.poly.push(x);
        this.poly.push(y);
    }
    
    public curveTo = (controlX:number, controlY:number, anchorX:number, anchorY:number):void =>
    {
        if (this.poly==null) this.makePoly();
        
        if (this.poly.length >= 2)
        {
            var x0:number = this.poly.array[this.poly.length - 2];
            var y0:number = this.poly.array[this.poly.length - 1];
            var d:number = Math.abs(x0 - anchorX) + Math.abs(y0 - anchorY);
            var step:number = 5 / d;
            if (step > .5) step = .5;
            if (step < 0.01) step = 0.01;
            
            for (var t1:number = step; t1 <= 1; t1 += step)
            {
                var t0:number = 1 - t1;
                var q0x:number = t0 * x0 + t1 * controlX;
                var q0y:number = t0 * y0 + t1 * controlY;
                var q1x:number = t0 * controlX + t1 * anchorX;
                var q1y:number = t0 * controlY + t1 * anchorY;
                this.poly.push(t0 * q0x + t1 * q1x);
                this.poly.push(t0 * q0y + t1 * q1y);
            }
        }
    }
    
    /*private function getCurvePoint(t1:number, p0:Point, p1:Point, p2:Point):Vector3D
    {
        var t0:number = 1 - t1;
        var q0x:number = t0 * p0.x + t1 * p1.x;
        var q0y:number = t0 * p0.y + t1 * p1.y;
        var q1x:number = t0 * p1.x + t1 * p2.x;
        var q1y:number = t0 * p1.y + t1 * p2.y;
        return new Vector3D(t0 * q0x + t1 * q1x, t0 * q0y + t1 * q1y, Math.atan2(q1y - q0y, q1x - q0x));
    }*/
    
    public cubicCurveTo = (controlX1:number, controlY1:number, controlX2:number, controlY2:number, anchorX:number, anchorY:number):void =>
    {
        // TODO implement GLGraphicsPath.cubicCurveTo() Needed for elipse drawing
        if (this.poly == null) this.makePoly();
        
        /*poly.push(controlX1);
        poly.push(controlY1);
        poly.push(controlX2);
        poly.push(controlY2);
        poly.push(anchorX);
        poly.push(anchorY);*/
        
        
        /*
        trace("controlX1: " + controlX1 + ", controlX2: " + controlX2 + ", controlY1: " + controlY1 + ", controlY2: " + controlY2);
        
        var x0:number = poly.array[poly.length - 2];
        var y0:number = poly.array[poly.length - 1];
        var left:Matrix3d = new Matrix3d(x0 * x0 * x0, x0 * x0, x0, 1,
                                            controlX1 * controlX1 * controlX1, controlX1 * controlX1, 	controlX1, 1,
                                            controlX2 * controlX2 * controlX2, controlX2 * controlX2, 	controlX2, 1,
                                            anchorX * anchorX * anchorX, 	anchorX * anchorX, 	anchorX , 1);
        left.invert();
        var right:Matrix3d = new Matrix3d(		y0, 0, 0, 0,
                                            controlY1, 0, 0, 0,
                                            controlY2, 0, 0, 0,
                                            anchorY, 0, 0, 0);
        
        right.append(left);
        
        trace("n11: " + right.n11 + ", n21: " + right.n21 + ", n31: " + right.n31 + ", n41: " + right.n41);
        trace("right: " + right.toString());
        
        for (var i:number = 0; i < 200; i++)
        {
            var x:number = i * 2;
            var y:number = right.n11 * x * x * x + 
                            right.n21 * x * x + 
                            right.n31 * x +
                            right.n41;
            
            poly.push(x);
            poly.push(y);
            
            trace("x: " + x + ", y: " + y);
        }
        */
    }
    
    public wideLineTo = (x:number, y:number):void =>
    {
        this.lineTo(x, y);
    }
    
    public wideMoveTo = (x:number, y:number):void =>
    {
        this.moveTo(x, y);
    }
    
    public arc = (x:number, y:number,r:number,a0:number,a1:number):void =>
    {
        var da:number = Math.floor(1 / r *180/Math.PI);// Math.PI * 3 / 4;
        if (da<1){
            da = 1;
        }
        if (da>90){
            da = 90;
        }
        da = da * Math.PI / 180;
        var x0:number = r;
        var y0:number = 0;
        var sin:number = Math.sin(da);
        var cos:number = Math.cos(da);
        this.moveTo(x0+x, y0+y);
        for (var a:number = a0; a < a1;a+=da ){
            var x_:number = x0;
            x0 = x0 * cos - y0 * sin;
            y0 = x_ * sin + y0 * cos;
            this.lineTo(x0 + x, y0 + y);
        }
    }
    
    private rect = (x:number, y:number, w:number, h:number) : void =>
    {
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
    }
    
    private makePoly = ():void =>
    {
        this.poly = this.polys.array[this.polys.length];
        if (this.poly==null){
            this.poly = this.polys.array[this.polys.length] = new MemArray;
        }
        this.polys.length++;
    }
}