import { DisplayObjectContainer } from "./DisplayObjectContainer";
import { StageQuality } from "./StageQuality";
import { FlashPort } from "../../FlashPort";
import { Rectangle } from "../geom/Rectangle";
//import flash.media.StageVideo;
import { Stage3D } from "./Stage3D";
import { DisplayObject } from "./DisplayObject";
import { AccessibilityProperties } from "../accessibility/AccessibilityProperties";
import { AccessibilityImplementation } from "../accessibility/AccessibilityImplementation";
import { TextSnapshot } from "../text/TextSnapshot";
import { ContextMenu } from "../ui/ContextMenu";
import { StageAlign } from "./StageAlign";
import { StageScaleMode } from "./StageScaleMode";
import { MouseEvent } from "../events/MouseEvent";
import { AEvent } from "../events/AEvent";
import { TouchEvent } from "../events/TouchEvent";
import { KeyboardEvent } from "../events/KeyboardEvent";
import { Transform } from "../geom/Transform";
import { Tweener } from "../../caurina/transitions/Tweener";
import { Canvas, CanvasKit, Surface } from "canvaskit-wasm";
import { SkiaRenderer } from "../__native/SkiaRenderer";
import { Equations } from "../../caurina/transitions/Equations";

export class Stage extends DisplayObjectContainer
{
	private static _instance:Stage;
	private static _instantiate:boolean = false;
	
	public __rootHtmlElement:HTMLElement;
	public __htmlWrapper:HTMLElement;
	
	private _canvas:HTMLCanvasElement;
	private _skiaCanvas:Canvas;
	private _canvasKit:CanvasKit;
	private _surface:Surface;
	private _ctx:CanvasRenderingContext2D;
	private _ctx2d:CanvasRenderingContext2D;
	
	private prevTime:number;
	private needSendMouseMove:Object;
	private needSendTouchMove:Object = false;
	private origWidth:number = -1;
	private origHeight:number = -1;
	
	private _align:string = StageAlign.TOP_LEFT;
	private _allowsFullScreen:boolean = true;
	private _allowsFullScreenInteractive:boolean = true;
	private _browserZoomFactor:number = 1;
	private _color:number = 0xFFFFFF;
	private _colorCorrection:string;
	private _colorCorrectionSupport:string;
	private _contentsScaleFactor:number = 1;
	private _contextMenu:ContextMenu;
	private _displayContextInfo:string;
	private _displayState:string;
	private _focus:DisplayObject;
	private _focusRect:Object;
	private _frameRate:number;
	private _fullScreenHeight:number;
	private _fullScreenSourceRect:Rectangle;
	private _fullScreenWidth:number;
	private _mouseLock:boolean = false;
	private _stageMouseX:number = 0;
	private _stageMouseY:number = 0;
	private _quality:string = StageQuality.BEST;
	private _scaleMode:string = StageScaleMode.SHOW_ALL;
	private _showDefaultContextMenu:boolean = true;
	private _softKeyboardRect:Rectangle;
	private _stage3Ds:Stage3D[];
	private _stageFocusRec:boolean = true;
	private _stageHeight:number = 0;
	//private _stageVideos:StageVideo[];
	private _stageWidth:number = 0;
	private _textSnapshot:TextSnapshot;
	private isButtonDown:boolean = false;
	private _pauseRendering:boolean = false;
	public __enterframeSprites:any[] = [];
	
	/**
	 * Stage is a singular instance per window and cannot be instantiated twice.
	 */
	constructor(){	
		
		super();
		
		if (Stage._instance && !Stage._instantiate) throw new Error("Stage is a singular instance and can't be instantiated twice. Access using instance.");
		
		console.log("Powered by FlashPort");

		FlashPort.renderer = new SkiaRenderer(FlashPort.canvasKit);
		
		this.transform = new Transform(this as any);
		this.prevTime = window.performance.now();
		
		if (FlashPort.rootHTMLElement)
		{
			this.__rootHtmlElement = FlashPort.rootHTMLElement;
			this.__rootHtmlElement.innerHTML = '';
		}
		else
		{
			this.__rootHtmlElement = document.createElement("div");
			document.body.appendChild(this.__rootHtmlElement);
		}
		
		this.__htmlWrapper = document.createElement("div");
		this.__htmlWrapper.style.position = "absolute";
		this.__htmlWrapper.style.left = "0px";
		this.__htmlWrapper.style.top = "0px";
		this.__htmlWrapper.style.zIndex = "0";
		document.body.appendChild(this.__htmlWrapper);
		
		if (FlashPort.startTime===0)  FlashPort.startTime = Date.now();
			
		this._frameRate = 60;
		this._stage3Ds = Array<Stage3D>(new Stage3D, new Stage3D, new Stage3D, new Stage3D);

		Stage._instance = this;
		Stage._instance.name = "Stage";
		Tweener.setController(this);
		Equations.init();
		
		
        this.createCanvas(FlashPort.canvasKit);
		this.window_resize();

		//window.addEventListener('focus', handleVisibilityChange);
		//window.addEventListener('blur', handleVisibilityChange);
		//document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener("resize", this.window_resize, false);
		window.addEventListener("orientationchange", this.window_resize, false);
	}
	
	private handleVisibilityChange(e:Event):void 
	{
		if (document.hidden || e.type == "blur")
		{
			this._pauseRendering = true;
			//Tweener.pauseAllTweens();
		}
		else
		{
			this.prevTime = window.performance.now();
			this._pauseRendering = false;
			//Tweener.resumeAllTweens();
			this._surface.requestAnimationFrame(this._updateStage);
		}
	}
	
	public static get instance():Stage
	{
		if (!this._instance)
		{
			this._instantiate = true;
			this._instance = new Stage();
			this._instantiate = false;
		}
		
		return this._instance;
	}
	
	private window_resize = (e?:any):void =>
	{
		if (this.origWidth == -1) this.origWidth = FlashPort.stageWidth;
		if (this.origHeight == -1) this.origHeight = FlashPort.stageHeight;
		
		FlashPort.dirtyGraphics = true;
		if (FlashPort.autoSize){
			FlashPort.stageWidth = (FlashPort.rootHTMLElement) ? FlashPort.rootHTMLElement.clientWidth : window.innerWidth;
			FlashPort.stageHeight = (FlashPort.rootHTMLElement) ? FlashPort.rootHTMLElement.clientHeight : window.innerHeight;
		}
		
		let dpi:number = window.devicePixelRatio;
		this._stageWidth = FlashPort.stageWidth * dpi;
		this._stageHeight = FlashPort.stageHeight * dpi;
		this._canvas.width = this._stageWidth;
		this._canvas.height = this._stageHeight;
		this._canvas.style.width = this._stageWidth + "px";
		this._canvas.style.height = this._stageHeight + "px";
		this._stage3Ds[0].canvas.width = this._stageWidth;
		this._stage3Ds[0].canvas.height = this._stageHeight;
		this._stage3Ds[0].canvas.style.width = this._stageWidth + "px";
		this._stage3Ds[0].canvas.style.height = this._stageHeight + "px";

		if (Stage._instance && Stage._instance.root)
		{
			if (Stage._instance.scaleMode == StageScaleMode.SHOW_ALL)
			{
				Stage._instance.root.scaleX = FlashPort.stageWidth / this.origWidth;
				Stage._instance.root.scaleY = Stage._instance.root.scaleX;
				if (Stage._instance.root.scaleY * this.origHeight > this._stageHeight)
				{
					Stage._instance.root.scaleY = FlashPort.stageHeight / this.origHeight;
					Stage._instance.root.scaleX = Stage._instance.root.scaleY;
				}
			}
			else if (Stage._instance.scaleMode == StageScaleMode.EXACT_FIT)
			{
				Stage._instance.root.scaleX = FlashPort.stageWidth / this.origWidth;
				Stage._instance.root.scaleY = FlashPort.stageHeight / this.origHeight;
			}

			
			Stage._instance.dispatchEvent(new AEvent(AEvent.RESIZE));
		}
	}
	
	private _updateStage = (canvas:Canvas):void =>
	{
		if (this._pauseRendering) return;
		
		if(this._stageWidth != FlashPort.stageWidth || this._stageHeight != FlashPort.stageHeight){
			this.window_resize(null);
		}
		
		if (this.needSendMouseMove) {
			this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_MOVE, true, false, this._stageMouseX, this._stageMouseY,null,this.needSendMouseMove['ctrlKey'],this.needSendMouseMove['altKey'],this.needSendMouseMove['shiftKey'],(this.needSendMouseMove['buttons'] != null)?(this.needSendMouseMove['buttons'] > 0):this.isButtonDown));
			this.needSendMouseMove = null;
		}
		if (this.needSendTouchMove) {
			this.dispatchEvent(new TouchEvent(TouchEvent.TOUCH_MOVE, true, false, 0, true, this._stageMouseX, this._stageMouseY,null,this.needSendTouchMove['ctrlKey'],this.needSendTouchMove['altKey'],this.needSendTouchMove['shiftKey'],(this.needSendTouchMove['buttons'] != null)?(this.needSendTouchMove['buttons'] > 0):this.isButtonDown));
			this.needSendTouchMove = null;
		}
		
		var fpsInterval:number = 1000 / this._frameRate;
		var now:number = window.performance.now();
		var elapsed:number = now - this.prevTime;
		if (elapsed >= fpsInterval)
		{
			for (let es of this.__enterframeSprites){
				es.dispatchEvent(new AEvent(AEvent.ENTER_FRAME));
			}
			
			this.prevTime = now - (elapsed % fpsInterval);
			this.dispatchEvent(new AEvent(AEvent.ENTER_FRAME, true));
			
			/* //this._mat.translate(1, 1);
			//this._mat.rotate(.01);
			let mat:number[] = [this._mat.a, this._mat.c, this._mat.tx, this._mat.b, this._mat.d, this._mat.ty, 0, 0, 1];
			
			// apply current matrix for path
			this._thePath.transform(mat);
			
			canvas.drawPath(this._thePath, this._fillPaint);
			canvas.drawPath(this._thePath, this._strokePaint);

			// reset matrix
			let invertedMat:number[] = this._canvasKit.Matrix.invert(mat);
			this._thePath.transform(invertedMat); */
		}

		this._surface.requestAnimationFrame(this._updateStage);
	}
	
	public get stageMouseX():number { return this._stageMouseX; }
	public get stageMouseY():number { return this._stageMouseY; }

	public set accessibilityImplementation (value:AccessibilityImplementation)
	{
		
	}

	public set accessibilityProperties (value:AccessibilityProperties)
	{
		
	}

	
	public get align ():string { return this._align; }
	public set align (value:string) { this._align = value; }

	
	public get allowsFullScreen ():boolean { return this._allowsFullScreen; }

	public get allowsFullScreenInteractive ():boolean { return this._allowsFullScreenInteractive; }
	
	

	public get browserZoomFactor ():number { return this._browserZoomFactor; }

	public get color ():number { return this._color; }
	public set color (color:number) { this._color = color; }

	
	public get colorCorrection ():string { return this._colorCorrection; }
	public set colorCorrection (value:string) { this._colorCorrection = value; }

	
	public get colorCorrectionSupport ():string { return this._colorCorrectionSupport; }

	public get contentsScaleFactor ():number { return this._contentsScaleFactor; }

	public set contextMenu (value:ContextMenu) { this._contextMenu = value; }

	public get displayContextInfo ():string { return this._displayContextInfo; }

	
	public get displayState():string
	{
		return (document["fullscreen"] || document["webkitIsFullScreen"] || document["mozFullScreen"]) ? "fullScreen" : "normal";
	}
	
	public set displayState (value:string)
	{
		if (value.indexOf("fullScreen")!=-1) {
			var requestFunc:Function = (this._canvas["requestFullscreen"] || this._canvas["webkitRequestFullScreen"] || this._canvas["mozRequestFullScreen"] || this._canvas["msRequestFullscreen"]);
			requestFunc.call(this._canvas);
		} else {
			var cancelFunc:Function = (document["exitFullscreen"] || document["webkitExitFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"]);
			cancelFunc.call(document);
		}
	}

	public get focus ():DisplayObject { return this._focus; }
	public set focus (newFocus:DisplayObject) { this._focus = newFocus; }

	
	public get frameRate ():number { return this._frameRate; }
	public set frameRate (value:number) { this._frameRate = value; }

	public get fullScreenHeight ():number { return this._fullScreenHeight; }

	
	public get fullScreenSourceRect ():Rectangle { return this._fullScreenSourceRect; }
	public set fullScreenSourceRect (value:Rectangle) { this._fullScreenSourceRect = value; }

	public get fullScreenWidth ():number { return this._fullScreenWidth; }
	
	public get mouseLock ():boolean { return this._mouseLock; }
	public set mouseLock (value:boolean) { this._mouseLock = value; }
	

	public get quality ():string { return this._quality; }
	public set quality (value:string) { this._quality = value; }

	public get scaleMode ():string { return this._scaleMode; }
	public set scaleMode (value:string) { this._scaleMode = value; }

	public get showDefaultContextMenu ():boolean { return this._showDefaultContextMenu; }
	public set showDefaultContextMenu (value:boolean) { this._showDefaultContextMenu = value; }

	public get softKeyboardRect ():Rectangle { return this._softKeyboardRect; }

	public get stage3Ds ():Stage3D[] { return this._stage3Ds; }

	public get stageFocusRect ():boolean { return this._stageFocusRec; }
	public set stageFocusRect (on:boolean) { this._stageFocusRec = on; }

	public get stageHeight ():number
	{ 
		if (FlashPort.autoSize) this._stageHeight = window.innerHeight;
		return this._stageHeight; 
	}
	public set stageHeight (value:number) { this._stageHeight = value; }

	
	//public function get stageVideos ():Vector.<flash.media.StageVideo>;

	public get stageWidth ():number 
	{ 
		if (FlashPort.autoSize) this._stageWidth = window.innerWidth;
		return this._stageWidth; 
	}
	public set stageWidth (value:number) { this._stageWidth = value; }

	
	public get textSnapshot ():TextSnapshot { return this._textSnapshot; }

	
	public invalidate ():void
	{
		FlashPort.dirtyGraphics = true;
	}

	public isFocusInaccessible ():boolean
	{
		return false;
	}
	
	private createCanvas = (canvasKit:CanvasKit):void =>
	{
		if (!this._canvas)
		{
			this._canvas = document.getElementById("flashportcanvas") as HTMLCanvasElement;

			if (this._canvas == undefined){
				this._canvas = document.createElement("canvas");
				this._canvas.id = "flashportcanvas";
				this._canvas.style.position = "absolute";
				this._canvas.style.left = "0px";
				this._canvas.style.top = "0px";
				this.__rootHtmlElement.appendChild(this._canvas);
				this.window_resize();
			}

			this._surface = canvasKit.MakeCanvasSurface("flashportcanvas");
			this._skiaCanvas = this._surface.getCanvas();
			
			this._canvas.addEventListener("click", this.canvas_mouseevent,false);
			this._canvas.addEventListener("contextmenu", this.canvas_mouseevent,false);
			this._canvas.addEventListener("dblclick", this.canvas_mouseevent,false);
			this._canvas.addEventListener("mousedown", this.canvas_mouseevent,false);
			this._canvas.addEventListener("mouseenter", this.canvas_mouseevent,false);
			this._canvas.addEventListener("mouseleave", this.canvas_mouseevent,false);
			this._canvas.addEventListener("mousemove", this.canvas_mouseevent,false);
			this._canvas.addEventListener("mouseover", this.canvas_mouseevent,false);
			this._canvas.addEventListener("mouseout", this.canvas_mouseevent,false);
			this._canvas.addEventListener("mouseup", this.canvas_mouseevent,false);
			this._canvas.addEventListener("mousewheel", this.canvas_mouseevent,this.supportsPassive ? {passive: true} : false);
			this._canvas.addEventListener("touchcancel", this.canvas_touchevent,false);
			this._canvas.addEventListener("touchend", this.canvas_touchevent,false);
			this._canvas.addEventListener("touchmove", this.canvas_touchevent,this.supportsPassive ? {passive: true} : false);
			this._canvas.addEventListener("touchstart", this.canvas_touchevent,this.supportsPassive ? {passive: true} : false);
			document.addEventListener("keydown", this.canvas_keyevent,false);
			document.addEventListener("keyup", this.canvas_keyevent, false);
			
			this._surface.requestAnimationFrame(this._updateStage); // start the render loop
		}
	}

	public get canvas():HTMLCanvasElement
	{
		return this._canvas;
	}
	
	private get supportsPassive():boolean 
	{
		var passiveAvailable:boolean = false;
		try {
			var opts:Object = Object.defineProperty({}, 'passive', {
			'get': function():void {
				passiveAvailable = true;
			}
			});
			window.addEventListener("testPassive", null, opts);
			window.removeEventListener("testPassive", null, opts);
		} catch (e) {}
		
		return passiveAvailable;
	}
	
	
	private canvas_touchevent = (e:Event):void =>
	{
		var jsType:string = e.type;
		var flashType:string = '';
		var flashType2:string = '';

		switch(jsType) {
			case "touchcancel":
				flashType = TouchEvent.TOUCH_END;
				flashType2 = MouseEvent.MOUSE_UP;
				this.isButtonDown = false;
				break;
			case "touchend":
				flashType = TouchEvent.TOUCH_END;
				flashType2 = MouseEvent.MOUSE_UP;
				this.isButtonDown = false;
				break;
			case "touchmove":
				flashType = TouchEvent.TOUCH_MOVE;
				flashType2 = MouseEvent.MOUSE_MOVE;
				break;
			case "touchstart":
				flashType = TouchEvent.TOUCH_BEGIN;
				flashType2 = MouseEvent.MOUSE_DOWN;
				this.isButtonDown = true;
				if (!this.supportsPassive) e.preventDefault();
				break;
		}
		
		if (flashType) 
		{
			if (e['targetTouches'].length) 
			{
				this._stageMouseX = e['targetTouches'][0].pageX - this._canvas.offsetLeft - (FlashPort.rootHTMLElement ?  FlashPort.rootHTMLElement.offsetLeft : 0);
				this._stageMouseY = e['targetTouches'][0].pageY - this._canvas.offsetTop - (FlashPort.rootHTMLElement ?  FlashPort.rootHTMLElement.offsetTop : 0);
			}
			
			if (this.hasEventListener(flashType))
			{
				if(flashType!=TouchEvent.TOUCH_MOVE){
					this.dispatchEvent(new TouchEvent(flashType, true, false, 0, true, this._stageMouseX, this._stageMouseY, 1, 1, 1, e['ctrlKey'], e['altKey'], e['shiftKey'],(e['buttons'] != null)?(e['buttons'] > 0):this.isButtonDown));
				}else {
					this.needSendTouchMove = true;
				}
			}
			
			if (this.hasEventListener(flashType2)) 
			{
				if(flashType2 != MouseEvent.MOUSE_MOVE){
					this.dispatchEvent(new MouseEvent(flashType2, true, false, this._stageMouseX, this._stageMouseY, this,e['ctrlKey'],e['altKey'],e['shiftKey'],(e['buttons'] != null)?(e['buttons'] > 0):this.isButtonDown));
				}else {
					this.needSendMouseMove = e;
				}
			}
			
			if (flashType === TouchEvent.TOUCH_END && this.hasEventListener(MouseEvent.CLICK))
			{
				this.dispatchEvent(new MouseEvent(MouseEvent.CLICK, true, false, this._stageMouseX, this._stageMouseY, this,e['ctrlKey'],e['altKey'],e['shiftKey'],(e['buttons'] != null)?(e['buttons'] > 0):this.isButtonDown));
			}
		}
	}
	
	private canvas_keyevent = (e:Event):void =>
	{
		var jsType:string = e.type;
		var flashType:string = '';
		switch(jsType) {
			case "keydown":
				flashType = KeyboardEvent.KEY_DOWN;
				break;
			case "keyup":
				flashType = KeyboardEvent.KEY_UP;
				break;
		}
		if (this.hasEventListener(flashType)) {
			this.dispatchEvent(new KeyboardEvent(flashType, true, false, e['charCode'], e['keyCode'], e['location'], e['ctrlKey'], e['altKey'], e['shiftKey']));
		}
	}
	
	private canvas_mouseevent = (e:Event):void =>
	{
		var jsType:string = e.type;
		var flashType:string = '';
		switch(jsType) {
			case "click":
				flashType = MouseEvent.CLICK;
				break;
			case "contextmenu":
				flashType = MouseEvent.CONTEXT_MENU;
				break;
			case "dblclick":
				flashType = MouseEvent.DOUBLE_CLICK;
				break;
			case "mousedown":
				flashType = MouseEvent.MOUSE_DOWN;
				this.isButtonDown = true;
				break;
			case "mouseenter":
				flashType = MouseEvent.ROLL_OVER;
				break;
			case "mouseleave":
				flashType = MouseEvent.ROLL_OUT;
				break;
			case "mousemove":
				flashType = MouseEvent.MOUSE_MOVE;
				break;
			case "mouseover":
				flashType = MouseEvent.MOUSE_OVER;
				break;
			case "mouseout":
				flashType = MouseEvent.MOUSE_OUT;
				break;
			case "mouseup":
				flashType = MouseEvent.MOUSE_UP;
				this.isButtonDown = false;
				break;
			case "mousewheel":
				flashType = MouseEvent.MOUSE_WHEEL;
				break;
				
		}
		if (flashType){
			this._stageMouseX = e['pageX'] - this._canvas.offsetLeft - (FlashPort.rootHTMLElement ?  FlashPort.rootHTMLElement.offsetLeft : 0);
			this._stageMouseY = e['pageY'] - this._canvas.offsetTop - (FlashPort.rootHTMLElement ?  FlashPort.rootHTMLElement.offsetTop : 0);
			if (this.hasEventListener(flashType)) {
				if (flashType != MouseEvent.MOUSE_MOVE){
					this.dispatchEvent(new MouseEvent(flashType,true,false,this._stageMouseX,this._stageMouseY,this,e['ctrlKey'],e['altKey'],e['shiftKey'],(e['buttons'] != null)?(e['buttons'] > 0):this.isButtonDown,(e['wheelDelta']/120)));
				} else {
					this.needSendMouseMove = e;
				}
			}
		}
	}
	
	public get ctx():CanvasRenderingContext2D
	{
		return this._ctx;
	}
	
	public get ctx2d():CanvasRenderingContext2D{
		if (!this._ctx2d)
		{
			var can:HTMLCanvasElement = document.createElement("canvas");
			this._ctx2d = (<CanvasRenderingContext2D>can.getContext("2d") );
		}
		return this._ctx2d;
	}
	
	public get surface():Surface
	{
		return this._surface;
	}

	public get canvasKit():CanvasKit
	{
		return this._canvasKit;
	}

	public get skiaCanvas():Canvas
	{
		return this._skiaCanvas;
	}
	
	public setRoot = (value:DisplayObject):void =>
	{
		this._root = value;
	}
}