import { PerspectiveMatrix3D } from "../adobe/PerspectiveMatrix3D.js";
import { Stage } from "../flash/display/Stage.js";
import { AEvent } from "../flash/events/AEvent.js";
import { MouseEvent } from "../flash/events/MouseEvent.js";
import { Matrix3D } from "../flash/geom/Matrix3D.js";
import { Point } from "../flash/geom/Point.js";
import { Vector3D } from "../flash/geom/Vector3D.js";

export class Camera3DOrbit 
{	
    private _projectionMatrix:PerspectiveMatrix3D;
    private _position:Vector3D;
    private _stage:Stage;
    private _radius:number;
    private _mat:Matrix3D;
    private _lastMouseX:number;
    private _lastMouseY:number;
    private _zoomSpeed:number = 5;
    private _near:number = 0.1;
    private _far:number = 10000;
    
    private camRot:Vector3D = new Vector3D(0, 0); //change for camera rotation from target.
    private dragPos:Point = new Point(0, 0);
    
    constructor(radius:number = 10)
    {
        this._radius = radius;
        this._stage = Stage.instance;
        
        this._projectionMatrix = new PerspectiveMatrix3D();
        this._projectionMatrix.perspectiveFieldOfViewLH(45*Math.PI/180, this._stage.stageWidth/this._stage.stageHeight, this._near, this._far);
        
        this._position = new Vector3D(0, 0, 0);
        this._mat = new Matrix3D();
        Stage.instance.root.addEventListener(MouseEvent.MOUSE_DOWN, this.onDown);
        Stage.instance.root.addEventListener(MouseEvent.MOUSE_WHEEL, this.onMouseWheel);
        this.updateView();
    }

    private onMouseWheel = (e:MouseEvent):void =>
    {
        //console.log("MouseWheel");
        this._zoomSpeed = Math.max(this._radius*.5, 1);
        this._radius += -(e.delta / 6) * this._zoomSpeed;
        this.updateView(true);
    }
    
    private onDown = (e:MouseEvent):void =>
    {
        //if (e.target instanceof Stage)
        //{
            this._stage.root.addEventListener(MouseEvent.MOUSE_MOVE, this.onMouseMove);
            this._stage.root.addEventListener(MouseEvent.MOUSE_UP, this.onUp);
            this.dragPos = new Point(this._stage.root.mouseX, this._stage.root.mouseY);
            //console.log("Mouse Down" + this.dragPos.toString());
        //}
    }
    
    private onUp = (e:MouseEvent):void =>
    {
        this._stage.root.removeEventListener(MouseEvent.MOUSE_MOVE, this.onMouseMove);
        this._stage.root.removeEventListener(MouseEvent.MOUSE_UP, this.onUp);
    }
    
    private onMouseMove = (event:MouseEvent):void =>
    {
        //console.log("Mouse Move");
        this.updateView();
    }
    
    private projMatrix = (FOV:number, aspect:number, zNear:number, zFar:number):Matrix3D =>
    {
        var sy:number = 1.0 / Math.tan(FOV * Math.PI / 360.0),
            sx:number = sy / aspect;
        return new Matrix3D([
                sx, 0.0, 0.0, 0.0,
                0.0, sy, 0.0, 0.0,
                0.0, 0.0, zFar / (zNear - zFar), -1.0,
                0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0]);
    }
    
    private updateView = (zoomOnly:Boolean = false):void =>
    {
        if (!zoomOnly  && this.dragPos)
        {
            this.camRot.x -= (this._stage.root.mouseY - this.dragPos.y) * 0.5;
            this.camRot.y -= (this._stage.root.mouseX - this.dragPos.x) * 0.5;					
            this.dragPos = new Point(this._stage.root.mouseX, this._stage.root.mouseY);
        }
        
        // camera
        var mView:Matrix3D = this.viewMatrix(this.camRot, this._radius, 0.5);
        this._mat.identity();
        this._mat.append(mView);	
        this._mat.append(this._projectionMatrix);
        
        // We get the position of the observer from the form of the matrix
        mView.invert();
        this._position = mView.position;
    }
    
    private viewMatrix = (rot:Vector3D, dist:number, centerY:number):Matrix3D =>
    {
        var m:Matrix3D = new Matrix3D();
        m.appendTranslation(0, -centerY, 0);
        m.appendRotation(rot.z, new Vector3D(0, 0, 1));
        m.appendRotation(rot.y, new Vector3D(0, 1, 0));			
        m.appendRotation(rot.x, new Vector3D(1, 0, 0));
        m.appendTranslation(0, 0, dist);
        return m;
    }
    
    public set near(value:number) 
    {
        this._near = value;
        this._projectionMatrix.perspectiveFieldOfViewLH(45*Math.PI/180, this._stage.stageWidth/this._stage.stageHeight, this._near, this._far);
    }
    
    public set far(value:number) 
    {
        this._far = value;
        this._projectionMatrix.perspectiveFieldOfViewLH(45*Math.PI/180, this._stage.stageWidth/this._stage.stageHeight, this._near, this._far);
    }
    
    public get matrix():Matrix3D
    {
        return this._mat;
    }
    
    public get zoomSpeed():number 
    {
        return this._zoomSpeed;
    }
    
    public set zoomSpeed(zoomSpeed:number) 
    {
        this._zoomSpeed = zoomSpeed;
    }
    
    public get position():Vector3D
    {
        return this._position;
    }
    
    public get projectionMatrix():PerspectiveMatrix3D 
    {
        return this._projectionMatrix;
    }
}