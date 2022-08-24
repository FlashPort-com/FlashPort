
import { Rectangle } from "../geom/Rectangle";


export class AccessibilityImplementation extends Object
{
	
	public errno:number;

	public stub:boolean;

	
	public accDoDefaultAction (childID:number):void
	{
		
	}

	
	constructor(){
		super();
	}

	
	public accLocation (childID:number):any
	{
		return null;
	}

	
	public accSelect (operation:number, childID:number):void 
	{
		
	}

	
	public get_accDefaultAction (childID:number):string
	{
		return null;
	}

	
	public get_accFocus ():number
	{
		return null;
	}

	
	public get_accName (childID:number):string
	{
		return null;
	}

	
	public get_accRole (childID:number):number
	{
		return null;
	}

	
	public get_accSelection ():any[]
	{
		return null;
	}

	
	public get_accState(childID:number):number
	{
		return null;
	}

	
	public get_accValue(childID:number):string
	{
		return null;
	}

	public get_selectionActiveIndex():any
	{
		return null;
	}

	public get_selectionAnchorIndex():any
	{
		return null;
	}

	
	public getChildIDArray():any[]
	{
		return null;
	}

	
	public isLabeledBy (labelBounds:Rectangle):boolean
	{
		return false;
	}
}