import { IBitmapDrawable } from "./IBitmapDrawable";
import { Stage } from "./Stage";
import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { LoaderInfo } from "./LoaderInfo";
import { BlendMode } from "./BlendMode";
import { FlashPort } from "../../FlashPort";
import { Graphics } from "./Graphics";

import { AEvent } from "../events/AEvent";
import { TouchEvent } from "../events/TouchEvent";
import { EventDispatcher } from "../events/EventDispatcher";
import { MouseEvent } from "../events/MouseEvent";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { Transform } from "../geom/Transform";
import { Vector3D } from "../geom/Vector3D";
import { getTimer } from "../utils/getTimer";
import { BlurFilter } from "../filters";
import { Canvas, Surface } from "canvaskit-wasm";

export class DisplayObject extends EventDispatcher implements IBitmapDrawable {
  static _globalStage: Stage;
  private _stage: Stage;
  private _inited: boolean = false;
  protected _root: DisplayObject;
  public _off: boolean = false;

  private static ID: number = 0;
  public innerID: number;
  private _name: string;
  private _rotation: number = 0;
  private rsin: number = 0;
  private rcos: number = 1;
  public transform: Transform;
  public _parent: DisplayObjectContainer;
  private _mask: DisplayObject;
  private _visible: boolean = true;
  private _mouseEnabled:boolean = true;
	private _doubleClickEnabled:boolean = false;
  private lastMouseOverObj: DisplayObject;
  private _blendMode: string;
  private _opaqueBackground:number;
  protected _cacheAsBitmap: boolean = false;
  protected _parentCached: boolean = false;
  private _loaderInfo: LoaderInfo;
  private _filters: any[] = [];
  protected _filterOffsetX: number = 0;
  protected _filterOffsetY: number = 0;
  protected _blurFilter: BlurFilter;

  private offscreenCanvas: any;
  private ocCTX: any;

  constructor() {
    super();

    this._loaderInfo = new LoaderInfo();
    this._stage = DisplayObject._globalStage;
    if (this._stage) this.initDisplayObjectStage();
  }

  public initDisplayObjectStage = (): void => {
    if (!this._inited) {
      this._blendMode = BlendMode.NORMAL;
      this.transform = new Transform(this);
      this.innerID = DisplayObject.ID++;
      this._name = "instance" + this.innerID;

      if (this.innerID === 0) {
        DisplayObject._globalStage.setRoot(this);
        this._stage = DisplayObject._globalStage;

        this._stage.addEventListener(AEvent.ENTER_FRAME, this.__enterFrame);
        this._stage.addEventListener(MouseEvent.CLICK, this.__mouseevent);
        this._stage.addEventListener(MouseEvent.CONTEXT_MENU, this.__mouseevent);
        this._stage.addEventListener(MouseEvent.DOUBLE_CLICK,this.__mouseevent);
        this._stage.addEventListener(MouseEvent.MOUSE_DOWN, this.__mouseevent);
        this._stage.addEventListener(MouseEvent.MOUSE_MOVE, this.__mouseevent);
        this._stage.addEventListener(MouseEvent.MOUSE_UP, this.__mouseevent);
        this._stage.addEventListener(MouseEvent.MOUSE_WHEEL, this.__mouseevent);
        // touch events
        this._stage.addEventListener(TouchEvent.TOUCH_BEGIN, this.__mouseevent);
        this._stage.addEventListener(TouchEvent.TOUCH_END, this.__mouseevent);
        this._stage.addEventListener(TouchEvent.TOUCH_MOVE, this.__mouseevent);
      }
      this._inited = true;
    }
  };

  public static set initStage(value: Stage) {
    DisplayObject._globalStage = value;
  }

  public get stage(): Stage {
    //console.log('DisplayObject.stage', window['TSAanimate_Stage']);
    return DisplayObject._globalStage;
  }

  public set stage(v: Stage) {
    window["TSAanimate_Stage"] = v;
    if (this._stage && v !== null) {
      this.dispatchEvent(new AEvent(AEvent.ADDED_TO_STAGE));
    } else {
      FlashPort.dirtyGraphics = true;
      this.dispatchEvent(new AEvent(AEvent.REMOVED_FROM_STAGE));
    }
  }

  public get loaderInfo(): LoaderInfo {
    return this._loaderInfo;
  }

  public get root(): DisplayObject {
    return this._root;
  }

  public get name(): string {
    return this._name;
  }

  public set name(v: string) {
    this._name = v;
  }

  public get parent(): DisplayObjectContainer {
    return this._parent;
  }

  public get mask(): DisplayObject {
    return this._mask;
  }

  public set mask(v: DisplayObject) {
    if (this._mask && this._mask != v) this._mask.visible = true;
    this._mask = v;
    v.visible = false;
  }

  public get visible(): boolean {
    return this._visible;
  }

  public set visible(v: boolean) {
    this._visible = v;
    this.updateTransforms();
  }

  public get x(): number {
    return this.transform.matrix.tx;
  }

  public set x(v: number) {
    this.transform.matrix.tx = v;
    this.updateTransforms();
  }

  public get y(): number {
    return this.transform.matrix.ty;
  }

  public set y(v: number) {
    this.transform.matrix.ty = v;
    this.updateTransforms();
  }

  public get z(): number {
    return 0;
  }

  public set z(v: number) {}

  public get scaleX(): number {
    var m: Matrix = this.transform.matrix;
    if (this._rotation === 0) return m.a;
    return Math.sqrt(m.a * m.a + m.b * m.b);
  }

  public set scaleX(v: number) {
    var m: Matrix = this.transform.matrix;
    if (this._rotation === 0) {
      m.a = v;
    } else {
      m.a = this.rcos * v;
      m.b = this.rsin * v;
    }
    this.updateTransforms();
  }

  public get scaleY(): number {
    var m: Matrix = this.transform.matrix;
    if (this._rotation === 0) {
      return m.d;
    }
    return Math.sqrt(m.c * m.c + m.d * m.d);
  }

  public set scaleY(v: number) {
    var m: Matrix = this.transform.matrix;

    if (this._rotation === 0) {
      m.d = v;
    } else {
      m.c = -this.rsin * v;
      m.d = this.rcos * v;
    }
    this.updateTransforms();
  }

  public get scaleZ(): number {
    return 1;
  }

  public set scaleZ(v: number) {}

  public get mouseX(): number {
    if (this.stage) {
      return this.transform.invMatrix.transformPoint(
        new Point(this.stage.stageMouseX, this.stage.stageMouseY)
      ).x;
    }
    return 0;
  }

  public get mouseY(): number {
    if (this.stage) {
      return this.transform.invMatrix.transformPoint(
        new Point(this.stage.stageMouseX, this.stage.stageMouseY)
      ).y;
    }
    return 0;
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(v: number) {
    // TODO change to -180 to 180 instead of the (0 - 360) to match Flash API.
    this._rotation = v >= 360 ? v - 360 : v;
    var m: Matrix = this.transform.matrix;
    var r: number = (v * Math.PI) / 180;
    this.rsin = Math.sin(r);
    this.rcos = Math.cos(r);
    var sx: number = m.b === 0 ? m.a : Math.sqrt(m.a * m.a + m.b * m.b);
    var sy: number = m.c === 0 ? m.d : Math.sqrt(m.c * m.c + m.d * m.d);
    m.a = this.rcos * sx;
    m.b = this.rsin * sx;
    m.c = -this.rsin * sy;
    m.d = this.rcos * sy;
    this.updateTransforms();
  }

  public get rotationX(): number {
    return 0;
  }

  public set rotationX(v: number) {}

  public get rotationY(): number {
    return 0;
  }

  public set rotationY(v: number) {}

  public get rotationZ(): number {
    return 0;
  }

  public set rotationZ(v: number) {}

  public updateTransforms(): void {
    this.transform.updateTransforms();
    FlashPort.dirtyGraphics = true;
  }

  public get alpha(): number {
    return this.transform.colorTransform.alphaMultiplier;
  }

  public set alpha(v: number) {
    this.transform.colorTransform.alphaMultiplier = v;
    this.transform.updateColorTransforms();

    if (this instanceof DisplayObjectContainer) {
      var len: number = (this as DisplayObjectContainer).numChildren;
      for (var i: number = 0; i < len; i++) {
        var child: DisplayObject = (this as DisplayObjectContainer).getChildAt(
          i
        );
        child.transform.updateColorTransforms();
      }
    }

    FlashPort.dirtyGraphics = true;
  }

  public get width(): number {
    var rect: Rectangle = this.getRect(this);

    var radians: number = this._rotation * (Math.PI / 180);
    rect.width =
      Math.round(
        (rect.height * this.scaleY * Math.abs(Math.sin(radians)) +
          rect.width * this.scaleX * Math.abs(Math.cos(radians))) *
          10
      ) / 10;

    if (rect) return rect.width;
    return 0;
  }

  public set width(v: number) {
    this.scaleX = v / this.getRect(this).width;
  }

  public get height(): number {
    var rect: Rectangle = this.getRect(this);

    var radians: number = this._rotation * (Math.PI / 180);
    rect.height =
      Math.round(
        (rect.height * this.scaleY * Math.abs(Math.cos(radians)) +
          rect.width * this.scaleX * Math.abs(Math.sin(radians))) *
          10
      ) / 10;

    if (rect) return rect.height;
    return 0;
  }

  public set height(v: number) {
    this.scaleY = v / this.getRect(this).height;
  }

  public get cacheAsBitmap(): boolean {
    return this._cacheAsBitmap;
  }

  public set cacheAsBitmap(v: boolean) {
    this._cacheAsBitmap = v;
  }

  public get opaqueBackground(): number {
    return this._opaqueBackground;
  }

  public set opaqueBackground(v: number) {
    this._opaqueBackground = v;
  }

  public get scrollRect(): Rectangle {
    return null;
  }

  public set scrollRect(v: Rectangle) {
    /**/
  }

  public get filters(): any[] {
    return this._filters;
  }

  public set filters(v: any[]) {
    this._filters = v;
    let blurFilterFound: boolean = false;
    for (let f of this._filters) {
      this._filterOffsetX = Math.max(f.offsetX, this._filterOffsetX);
      this._filterOffsetY = Math.max(f.offsetY, this._filterOffsetY);
      if (f instanceof BlurFilter) {
        blurFilterFound = true;
        this._blurFilter = f;
      }
    }

    if (!blurFilterFound) this._blurFilter = null;
  }

  public get blendMode(): string {
    return this._blendMode;
  }

  public set blendMode(v: string) {
    this._blendMode = v;
  }

  public get scale9Grid(): Rectangle {
    return null;
  }

  public set scale9Grid(v: Rectangle) {
    /**/
  }

  public globalToLocal = (v: Point): Point => {
    return this.transform.invMatrix.transformPoint(v);
  };

  public localToGlobal = (v: Point): Point => {
    return this.transform.concatenatedMatrix.transformPoint(v);
  };

  public getBounds(v: DisplayObject): Rectangle {
    var mat: Matrix = new Matrix();
    var rect: Rectangle = new Rectangle();

    if (v && v != this) {
      mat = this.transform.concatenatedMatrix.clone();
      var targetMatrix: Matrix = v.transform.concatenatedMatrix.clone();
      targetMatrix.invert();
      mat.concat(targetMatrix);
    }

    if (this instanceof DisplayObjectContainer) {
      var gfx: Graphics = Object(this).graphics;
      if (gfx && gfx.bound) {
        var bounds: Rectangle = new Rectangle();
        var gfxBounds: Rectangle = gfx.bound.clone();
        gfxBounds.__transform(bounds, mat);
        rect.__expand(bounds.x, bounds.y, bounds.width, bounds.height);
      }
    }

    return rect;
  }

  /**
   * Use to provide proper bounds when object is rotated, scaled, or has filters applied.  Mainly used for cacheAsBitmap.
   * @param	v	DisplayObject to get bounds from.
   * @return		Rectangle of bounds
   */
  public getFullBounds = (v: DisplayObject): Rectangle => {
    var gfx: Graphics = Object(v).graphics;
    var bounds: Rectangle =
      gfx && gfx.bound ? gfx.bound.clone() : new Rectangle();
    bounds.width *= this.scaleX;
    bounds.height *= this.scaleY;
    bounds.x *= this.scaleX;
    bounds.y *= this.scaleY;

    // adjust bounds for rotation
    var rot: number =
      this._rotation >= 180 ? this._rotation - 180 : this._rotation;
    if (rot != 0) {
      var radians: number = rot * (Math.PI / 180);
      var w: number =
        Math.round(
          (bounds.height * Math.abs(Math.sin(radians)) +
            bounds.width * Math.abs(Math.cos(radians))) *
            100
        ) / 100;
      var h: number =
        Math.round(
          (bounds.height * Math.abs(Math.cos(radians)) +
            bounds.width * Math.abs(Math.sin(radians))) *
            100
        ) / 100;
      //trace("rot: " + rot + ", radians: " + radians + ", w: " + w + ", h: " + h);
      // adjust rectangle bigger if needed
      w = w > bounds.width ? w - bounds.width : 0;
      h = h > bounds.height ? h - bounds.width : 0;
      bounds.inflate(w / 2, h / 2);
    }

    bounds.inflate(this.filterOffsetX, this.filterOffsetY);
    //trace("DisplayObject bounds: " + bounds);
    return bounds;
  };

  public getRect(v: DisplayObject): Rectangle {
    if (Object(v).bitmapData) return Object(v).bitmapData.rect;

    var gfx: Graphics = Object(v).graphics;
    return gfx && gfx.rect ? gfx.rect.clone() : new Rectangle();
  }

  //public function get loaderInfo() : LoaderInfo{return null}

  public hitTestObject = (obj: DisplayObject): boolean => {
    return false; // this._hitTest(false, 0, 0, false, obj);
  };

  public hitTestPoint = (
    x: number,
    y: number,
    shapeFlag: boolean = false
  ): boolean => {
    //var rect:Rectangle = this.getRect(this);
    //if (rect) return rect.containsPoint(globalToLocal(new Point(x,y)));
    return false;
  };

  //private function _hitTest(param1:Boolean, param2:number, param3:number, param4:Boolean, param5:DisplayObject):Boolean  { return false }

  // public function get accessibilityProperties() : AccessibilityProperties;

  //  public function set accessibilityProperties(param1:AccessibilityProperties) : void;

  public globalToLocal3D = (param1: Point): Vector3D => {
    return null;
  };

  public local3DToGlobal = (param1: Vector3D): Point => {
    return null;
  };

  //public function set blendShader(param1:Shader) : void;

  public get metaData(): Object {
    return null;
  }

  public set metaData(param1: Object) {
    /**/
  }

  public get parentCached(): boolean {
    return this._parentCached;
  }

  public get filterOffsetX(): number {
    return this._filterOffsetX;
  }

  public get filterOffsetY(): number {
    return this._filterOffsetY;
  }

  protected ApplyFilters = (ctx: Canvas| CanvasRenderingContext2D): void => 
  {
    for (let filter of this._filters) {
      filter._applyFilter(ctx);
    } 
  };

  public __update(
    ctx: CanvasRenderingContext2D | Canvas,
    offsetX: number = 0,
    offsetY: number = 0,
    parentIsCached: boolean = false
  ): void {}

  private __enterFrame = (e: Event): void => {
    if (FlashPort.dirtyGraphics && this._stage.surface) {
      FlashPort.dirtyGraphics = false;
      var ctx:Canvas = this._stage.surface.getCanvas();
      var clearColor:Float32Array = FlashPort.canvasKit.Color((this._stage.opaqueBackground >> 16 & 255), (this._stage.opaqueBackground >> 8 & 0xff), (this._stage.opaqueBackground & 0xff), 1);
      this.stage.skiaCanvas.clear(clearColor);

      FlashPort.drawCounter = 0;
      this.__update(ctx);
    }
  };

  private __mouseevent = (e: MouseEvent): void => {
    var time: number = getTimer();
    var obj: DisplayObject = this.__doMouse(e);

    time = getTimer();
    if (e.type === MouseEvent.MOUSE_MOVE) {
      var t: DisplayObject = this.lastMouseOverObj;
      while (t) {
        if (t == obj) {
          break;
        } else {
          t.dispatchEvent(
            new MouseEvent(
              MouseEvent.MOUSE_OUT,
              false,
              false,
              e.localX,
              e.localY,
              null,
              e.ctrlKey,
              e.altKey,
              e.shiftKey,
              e.buttonDown
            )
          );

          //trace("t: " + t.getBounds(t));
          //trace("obj: " + obj.getBounds(obj));

          if (
            !obj ||
            (t instanceof DisplayObjectContainer &&
              !(t as DisplayObjectContainer).__containsNestedChild(obj)) ||
            (obj &&
              t.hasEventListener(MouseEvent.ROLL_OUT) &&
              !t.getBounds(t).containsRect(obj.getBounds(obj)))
          ) {
            // if we are still a child of the mouse over object, don't roll out.
            //trace(name + ", Mouse Out: " + t.name + ", New Mouse Obj: " + obj.name);
            t.dispatchEvent(
              new MouseEvent(
                MouseEvent.ROLL_OUT,
                false,
                false,
                e.localX,
                e.localY,
                null,
                e.ctrlKey,
                e.altKey,
                e.shiftKey,
                e.buttonDown
              )
            );
          }
        }
        t = t.parent;
      }

      //mouse over
      if (obj && obj != t) {
        var over: MouseEvent = new MouseEvent(
          MouseEvent.MOUSE_OVER,
          true,
          false,
          e.localX,
          e.localY,
          null,
          e.ctrlKey,
          e.altKey,
          e.shiftKey,
          e.buttonDown
        );
        var rollover: MouseEvent = new MouseEvent(
          MouseEvent.ROLL_OVER,
          true,
          false,
          e.localX,
          e.localY,
          null,
          e.ctrlKey,
          e.altKey,
          e.shiftKey,
          e.buttonDown
        );
        obj.dispatchEvent(over);
        obj.dispatchEvent(rollover);
      }

      this.lastMouseOverObj = obj;
    }

    if (obj) obj.dispatchEvent(e);
  };

  protected __doMouse(e: MouseEvent): DisplayObject {
    return null;
  }

  public dispatchEvent = (event: AEvent): boolean => {
    var b: boolean = super.dispatchEvent(event);

    if (event.bubbles && this.parent) {
      this.parent.dispatchEvent(event);
    }

    return b;
  };



  public get tabEnabled():boolean  { return true }
	
	public set tabEnabled(param1:boolean)  {/**/ }
	
	public get tabIndex():number  { return 0 }
	
	public set tabIndex(param1:number)  {/**/ }
	
	public get focusRect():Object  { return {} }
	
	public set focusRect(param1:Object)  {/**/ }
	
	public get mouseEnabled():boolean  { return this._mouseEnabled }
	
	public set mouseEnabled(v:boolean)  { this._mouseEnabled = v; }
	
	public get doubleClickEnabled():boolean  { return this._doubleClickEnabled }
	
	public set doubleClickEnabled(v:boolean)  { this._doubleClickEnabled = v; }
	
	// public function get accessibilityImplementation() : AccessibilityImplementation;
	
	//public function set accessibilityImplementation(param1:AccessibilityImplementation) : void;
	
	public get softKeyboardInputAreaOfInterest():Rectangle  { return new Rectangle() }
	
	public set softKeyboardInputAreaOfInterest(param1:Rectangle)  {/**/ }
	
	public get needsSoftKeyboard():boolean  { return false }
	
	public set needsSoftKeyboard(param1:boolean)  {/**/ }
	
	public requestSoftKeyboard():boolean  { return false }

	//public function get contextMenu() : ContextMenu;

	//public function set contextMenu(param1:ContextMenu) : void;
}
