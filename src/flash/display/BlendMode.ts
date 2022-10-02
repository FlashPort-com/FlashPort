
export class BlendMode extends Object
{
	
	public static NORMAL:string = "source-over";
	
	public static LAYER:string = "layer";
	
	public static MULTIPLY:string = "multiply";
	
	public static SCREEN:string = "screen";
	
	public static LIGHTEN:string = "lighten";
	
	public static DARKEN:string = "darken";
	
	public static ADD:string = "lighter";
	
	public static SUBTRACT:string = "subtract";
	
	public static DIFFERENCE:string = "difference";
	
	public static INVERT:string = "invert";
	
	public static OVERLAY:string = "overlay";
	
	public static HARDLIGHT:string = "hard-light";// "hardlight";
	
	public static ALPHA:string = "alpha";
	
	public static ERASE:string = "erase";
	
	public static SHADER:string = "shader";
	
	constructor(){
		super();
	}
	/*public static function getCompVal(str:string):string {
		switch (str)
		{
			case LAYER:return null;
			case MULTIPLY:return "multiply";
			case SCREEN:return "screen";
			case LIGHTEN:return "lighten";
			case DARKEN:return "darken";
			case ADD:return "color-burn";
			case SUBTRACT:return "color-dodge";
			case DIFFERENCE:return "difference";
			case INVERT:return null;
			case OVERLAY:return "overlay";
			case HARDLIGHT:return "hard-light";
			case ALPHA:return null;
			case ERASE:return "exclusion";
			case SHADER:return null;
		}
		
		return null;
	}*/
}