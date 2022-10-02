import { AEvent } from "./AEvent";

	
export class MouseEvent extends AEvent
{
	
	public static CLICK:string = "click";
	
	public static DOUBLE_CLICK:string = "doubleClick";
	
	public static MOUSE_DOWN:string = "mouseDown";
	
	public static MOUSE_MOVE:string = "mouseMove";
	
	public static MOUSE_OUT:string = "mouseOut";
	
	public static MOUSE_OVER:string = "mouseOver";
	
	public static MOUSE_UP:string = "mouseUp";
	
	public static RELEASE_OUTSIDE:string = "releaseOutside";
	
	public static MOUSE_WHEEL:string = "mouseWheel";
	
	public static ROLL_OUT:string = "rollOut";
	
	public static ROLL_OVER:string = "rollOver";
	
	public static MIDDLE_CLICK:string = "middleClick";
	
	public static MIDDLE_MOUSE_DOWN:string = "middleMouseDown";
	
	public static MIDDLE_MOUSE_UP:string = "middleMouseUp";
	
	public static RIGHT_CLICK:string = "rightClick";
	
	public static RIGHT_MOUSE_DOWN:string = "rightMouseDown";
	
	public static RIGHT_MOUSE_UP:string = "rightMouseUp";
	
	public static CONTEXT_MENU:string = "contextMenu";
	
	private m_relatedObject:Object;
	
	private m_ctrlKey:boolean;
	
	private m_altKey:boolean;
	
	private m_shiftKey:boolean;
	
	private m_buttonDown:boolean;
	
	private m_delta:number;
	
	private m_isRelatedObjectInaccessible:boolean;
	
	private _localX:number = 0;
	private _localY:number = 0;
	
	constructor(type:string, bubbles:boolean = true, cancelable:boolean = false, localX:number = undefined, localY:number = undefined, relatedObject:Object = null, ctrlKey:boolean = false, altKey:boolean = false, shiftKey:boolean = false, buttonDown:boolean = false, delta:number = 0)
	{
		super(type, bubbles, cancelable);
		
		this._localX = localX;
		this._localY = localY;
		this.m_relatedObject = relatedObject;
		this.m_ctrlKey = ctrlKey;
		this.m_altKey = altKey;
		this.m_shiftKey = shiftKey;
		this.m_buttonDown = buttonDown;
		this.m_delta = delta;
	}
	
	/*override*/ public clone():AEvent
	{
		return new MouseEvent(this.type, this.bubbles, this.cancelable, this.localX, this.localY, this.m_relatedObject, this.m_ctrlKey, this.m_altKey, this.m_shiftKey, this.m_buttonDown, this.m_delta);
	}
	
	/*override*/ public toString():string
	{
		return this.formatToString("MouseEvent", "type", "bubbles", "cancelable", "eventPhase", "localX", "localY", "stageX", "stageY", "relatedObject", "ctrlKey", "altKey", "shiftKey", "buttonDown", "delta");
	}
	
	public get localX():number  { return this._localX; }
	
	public set localX(v:number)  { this._localX = v; }
	
	public get localY():number  { return this._localY }
	
	public set localY(v:number)  { this._localY = v; }
	
	public get relatedObject():Object
	{
		return this.m_relatedObject;
	}
	
	public set relatedObject(value:Object)
	{
		this.m_relatedObject = value;
	}
	
	public get ctrlKey():boolean
	{
		return this.m_ctrlKey;
	}
	
	public set ctrlKey(value:boolean)
	{
		this.m_ctrlKey = value;
	}
	
	public get altKey():boolean
	{
		return this.m_altKey;
	}
	
	public set altKey(value:boolean)
	{
		this.m_altKey = value;
	}
	
	public get shiftKey():boolean
	{
		return this.m_shiftKey;
	}
	
	public set shiftKey(value:boolean)
	{
		this.m_shiftKey = value;
	}
	
	public get buttonDown():boolean
	{
		return this.m_buttonDown;
	}
	
	public set buttonDown(value:boolean)
	{
		this.m_buttonDown = value;
	}
	
	public get delta():number
	{
		return this.m_delta;
	}
	
	public set delta(value:number)
	{
		this.m_delta = value;
	}
	
	public get stageX():number
	{
		if (isNaN(this.localX) || isNaN(this.localY))
		{
			return Number.NaN;
		}
		return this.getStageX();
	}
	
	public get stageY():number
	{
		if (isNaN(this.localX) || isNaN(this.localY))
		{
			return Number.NaN;
		}
		return this.getStageY();
	}
	
	public updateAfterEvent():void
	{
	}
	
	private getStageX():number  { return this.localX }
	
	private getStageY():number  { return this.localY }
	
	public get isRelatedObjectInaccessible():boolean
	{
		return this.m_isRelatedObjectInaccessible;
	}
	
	public set isRelatedObjectInaccessible(value:boolean)
	{
		this.m_isRelatedObjectInaccessible = value;
	}
	
	public get movementX():number  { return 0 }
	
	public set movementX(param1:number)
	{
	}
	
	public get movementY():number  { return 0 }
	
	public set movementY(param1:number)
	{
	}
}