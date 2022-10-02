

export class Context3DBlendFactor extends Object
{
	
	public static ONE:string="one";//int = gl.ONE;//
	
	public static ZERO:string="zero";//int = gl.ZERO;//
	
	public static SOURCE_ALPHA:string="sourceAlpha";//int = gl.SRC_ALPHA;//
	
	public static SOURCE_COLOR:string="sourceColor";//int = gl.SRC_COLOR;//
	
	public static ONE_MINUS_SOURCE_ALPHA:string="oneMinusSourceAlpha";//int = gl.ONE_MINUS_SRC_ALPHA;//
	
	public static ONE_MINUS_SOURCE_COLOR:string="oneMinusSourceColor";//int = gl.ONE_MINUS_SRC_COLOR;//
	
	public static DESTINATION_ALPHA:string="destinationAlpha";//int = gl.DST_ALPHA;//
	
	public static DESTINATION_COLOR:string="destinationColor";//int = gl.DST_COLOR;//
	
	public static ONE_MINUS_DESTINATION_ALPHA:string="oneMinusDestinationAlpha";//int = gl.ONE_MINUS_DST_ALPHA;//
	
	public static ONE_MINUS_DESTINATION_COLOR:string="oneMinusDestinationColor";//int = gl.ONE_MINUS_DST_COLOR;//
	
	constructor()
	{
		super();
	}
	
	public static getGLVal(gl:WebGLRenderingContext,str:string):number 
	{
		switch(str) {
		case Context3DBlendFactor.ONE:
			return gl.ONE;
		case Context3DBlendFactor.ZERO:
			return gl.ZERO;
		case Context3DBlendFactor.SOURCE_ALPHA:
			return gl.SRC_ALPHA;
		case Context3DBlendFactor.SOURCE_COLOR:
			return gl.SRC_COLOR;
		case Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA:
			return gl.ONE_MINUS_SRC_ALPHA;
		case Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR:
			return gl.ONE_MINUS_SRC_COLOR;
		case Context3DBlendFactor.DESTINATION_ALPHA:
			return gl.DST_ALPHA;
		case Context3DBlendFactor.DESTINATION_COLOR:
			return gl.DST_COLOR;
		case Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA:
			return gl.ONE_MINUS_DST_ALPHA;
		case Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR:
			return gl.ONE_MINUS_DST_COLOR;
		}
		return 0;
	}
}