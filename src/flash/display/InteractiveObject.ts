/**
 * @suppress {lateProvide}
 */
import { DisplayObject } from "./DisplayObject.js";
import { Rectangle } from "../geom/Rectangle.js";

export class InteractiveObject extends DisplayObject
{
	private _mouseEnabled:boolean = true;
	private _doubleClickEnabled:boolean = false;
	
	constructor(){
		super();
	}
	
	public get tabEnabled():boolean  { return true }
	
	public set tabEnabled(param1:boolean)  {/**/ }
	
	public get tabIndex():number  { return 0 }
	
	public set tabIndex(param1:number)  {/**/ }
	
	public get focusRect():Object  { return null }
	
	public set focusRect(param1:Object)  {/**/ }
	
	public get mouseEnabled():boolean  { return this._mouseEnabled }
	
	public set mouseEnabled(v:boolean)  { this._mouseEnabled = v; }
	
	public get doubleClickEnabled():boolean  { return this._doubleClickEnabled }
	
	public set doubleClickEnabled(v:boolean)  { this._doubleClickEnabled = v; }
	
	// public function get accessibilityImplementation() : AccessibilityImplementation;
	
	//public function set accessibilityImplementation(param1:AccessibilityImplementation) : void;
	
	public get softKeyboardInputAreaOfInterest():Rectangle  { return null }
	
	public set softKeyboardInputAreaOfInterest(param1:Rectangle)  {/**/ }
	
	public get needsSoftKeyboard():boolean  { return false }
	
	public set needsSoftKeyboard(param1:boolean)  {/**/ }
	
	public requestSoftKeyboard():boolean  { return false }

	//public function get contextMenu() : ContextMenu;

	//public function set contextMenu(param1:ContextMenu) : void;
}