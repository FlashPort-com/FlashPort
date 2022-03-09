import { DisplayObject } from "./DisplayObject.js";
import { URLVariables } from "../net/URLVariables.js";
import { ByteArray } from "../utils/ByteArray.js";
import { EventDispatcher } from "../events/EventDispatcher.js";
import { Loader } from "./Loader.js";

export class LoaderInfo extends EventDispatcher
{
	private _content:DisplayObject;
	
	constructor()
	{
		super();
	}
	
	public static getLoaderInfoByDefinition(param1:Object):LoaderInfo  { return null; }
	
	public get loaderURL():string  { return this.url; }
	
	public get url():string  { return window.location.href; }
	
	public get isURLInaccessible():boolean  { return false }
	
	public get bytesLoaded():number  { return 0; }
	
	public get bytesTotal():number  { return 0; }
	
	//public function get applicationDomain() : ApplicationDomain;
	
	public get swfVersion():number  { return 0; }
	
	public get actionScriptVersion():number  { return 0; }
	
	public get frameRate():number  { return 0; }
	
	public get parameters():Object
	{
		var k:string = null;
		var args:Object = this._getArgs();
		var rtn:Object = {};
		for (k in args)
		{
			rtn[k] = args[k];
		}
		return rtn;
	}
	
	public get width():number  { return 0; }
	
	public get height():number  { return 0; }
	
	public get contentType():string  { return "spriteflexjs"; }
	
	public get sharedEvents():EventDispatcher  { return null; }
	
	public get parentSandboxBridge():Object  { return null; }
	
	public set parentSandboxBridge(param1:Object)
	{
	
	}
	
	public get childSandboxBridge():Object  { return null; }
	
	public set childSandboxBridge(param1:Object)
	{
	
	}
	
	public get sameDomain():boolean  { return false; }
	
	public get childAllowsParent():boolean  { return false; }
	
	public get parentAllowsChild():boolean  { return false }
	
	public get loader():Loader  { return null }
	
	public set content(value:DisplayObject)  { this._content = value; }
	
	public get content():DisplayObject  { return this._content; }
	
	public get bytes():ByteArray  { return null }
	
	private _getArgs():Object  { 
		try{
		var uv:URLVariables = new URLVariables(window.location.search.substr(1));
		}catch(err){}
		return uv;
	}
}