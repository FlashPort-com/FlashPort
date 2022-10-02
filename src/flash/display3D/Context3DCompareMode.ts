export class Context3DCompareMode extends Object
{
	
	public static ALWAYS:string = "always";//int = gl.ALWAYS;//
	
	public static NEVER:string = "never";//int = gl.NEAREST;//
	
	public static LESS:string = "less";//int = gl.LESS;//
	
	public static LESS_EQUAL:string = "lessEqual";//int = gl.LESS|gl.EQUAL;//
	
	public static EQUAL:string = "equal";//int = gl.EQUAL;//
	
	public static GREATER_EQUAL:string = "greaterEqual";//int = gl.GREATER|gl.EQUAL;//
	
	public static GREATER:string = "greater";//int = gl.GREATER;//
	
	public static NOT_EQUAL:string = "notEqual";//int = gl.NOTEQUAL;//
	
	constructor()
	{
		super();
	}
	
	public static getGLVal(gl:WebGLRenderingContext,str:string):number
	{
		switch (str)
		{
			case Context3DCompareMode.ALWAYS: 
				return gl.ALWAYS;
			case Context3DCompareMode.NEVER: 
				return gl.NEAREST;
			case Context3DCompareMode.LESS: 
				return gl.LESS;
			case Context3DCompareMode.LESS_EQUAL: 
				return gl.LESS | gl.EQUAL;
			case Context3DCompareMode.EQUAL: 
				return gl.EQUAL;
			case Context3DCompareMode.GREATER_EQUAL: 
				return gl.GREATER | gl.EQUAL;
			case Context3DCompareMode.GREATER: 
				return gl.GREATER;
			case Context3DCompareMode.NOT_EQUAL: 
				return gl.NOTEQUAL;
		}
		
		return 0;
	}
}