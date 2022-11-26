export class AEvent extends Object
{
	
	public static ACTIVATE:string = "activate";
	
	public static ADDED:string = "added";
	
	public static ADDED_TO_STAGE:string = "addedToStage";
	
	public static BROWSER_ZOOM_CHANGE:string = "browserZoomChange";
	
	public static CANCEL:string = "cancel";
	
	public static CHANGE:string = "change";
	
	public static CLEAR:string = "clear";
	
	public static CLOSE:string = "close";
	
	public static COMPLETE:string = "complete";
	
	public static CONNECT:string = "connect";
	
	public static COPY:string = "copy";
	
	public static CUT:string = "cut";
	
	public static DEACTIVATE:string = "deactivate";
	
	public static ENTER_FRAME:string = "enterFrame";
	
	public static FRAME_CONSTRUCTED:string = "frameConstructed";
	
	public static EXIT_FRAME:string = "exitFrame";
	
	public static FRAME_LABEL:string = "frameLabel";
	
	public static ID3:string = "id3";
	
	public static INIT:string = "init";
	
	public static MOUSE_LEAVE:string = "mouseLeave";
	
	public static OPEN:string = "open";
	
	public static PASTE:string = "paste";
	
	public static REMOVED:string = "removed";
	
	public static REMOVED_FROM_STAGE:string = "removedFromStage";
	
	public static RENDER:string = "render";
	
	public static RESIZE:string = "resize";
	
	public static SCROLL:string = "scroll";
	
	public static TEXT_INTERACTION_MODE_CHANGE:string = "textInteractionModeChange";
	
	public static SELECT:string = "select";
	
	public static SELECT_ALL:string = "selectAll";
	
	public static SOUND_COMPLETE:string = "soundComplete";
	
	public static TAB_CHILDREN_CHANGE:string = "tabChildrenChange";
	
	public static TAB_ENABLED_CHANGE:string = "tabEnabledChange";
	
	public static TAB_INDEX_CHANGE:string = "tabIndexChange";
	
	public static UNLOAD:string = "unload";
	
	public static FULLSCREEN:string = "fullScreen";
	
	public static CONTEXT3D_CREATE:string = "context3DCreate";
	
	public static TEXTURE_READY:string = "textureReady";
	
	public static VIDEO_FRAME:string = "videoFrame";
	
	public static SUSPEND:string = "suspend";
	
	public static CHANNEL_MESSAGE:string = "channelMessage";
	
	public static CHANNEL_STATE:string = "channelState";
	
	public static WORKER_STATE:string = "workerState";
	
	private _type:string;
	private _bubbles:boolean;
	private _cancelable:boolean;
	private _target:any;
	private _currentTarget:any;
	public _stopImmediatePropagation:boolean = false;

	constructor(type:string, bubbles:boolean = false, cancelable:boolean = false)
	{
		super();
		this.ctor(type, bubbles, cancelable);
	}
	
	public formatToString(className:string, ... args):string
	{
		return null
	}
	
	private ctor = (type:string, bubbles:boolean, cancelable:boolean):void =>
	{
		this._type = type;
		this._bubbles = bubbles;
		this._cancelable = cancelable;
	}
	
	public clone():AEvent
	{
		return new AEvent(this.type, this.bubbles, this.cancelable);
	}
	
	public toString():string
	{
		return this.formatToString("Event", "type", "bubbles", "cancelable", "eventPhase");
	}
	
	public get type():string  { return this._type }
	
	public get bubbles():boolean  { return this._bubbles }
	
	public get cancelable():boolean  { return this._cancelable }
	
	public get target():any  { return this._target }
	
	public set target(value:any)  { this._target = value }
	
	public get currentTarget():any  { return this._currentTarget }
	
	public set currentTarget(value:any)  { this._currentTarget = value }
	
	public get eventPhase():number  { return 0 }
	
	public stopPropagation():void
	{
	}
	
	public stopImmediatePropagation():void
	{
		this._stopImmediatePropagation = true;
	}
	
	public preventDefault():void
	{
	}
	
	public isDefaultPrevented():boolean  { return false }
}