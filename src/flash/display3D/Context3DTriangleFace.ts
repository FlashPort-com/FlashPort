export class Context3DTriangleFace extends Object
{
	
	public static NONE:string = "none";//int =gl.NONE;//
	
	public static BACK:string = "back";//int = gl.BACK;//
	
	public static FRONT:string = "front";//int = gl.FRONT;//
	
	public static FRONT_AND_BACK:string = "frontAndBack";//int = gl.FRONT_AND_BACK; //
	
	constructor(){
		super();
	}
	
	public static getGLVal(gl:WebGLRenderingContext,str:string):number
	{
		switch (str)
		{
		case Context3DTriangleFace.NONE: 
			return gl.NONE;
		case Context3DTriangleFace.BACK: 
			return gl.FRONT;
		case Context3DTriangleFace.FRONT: 
			return gl.BACK;
		case Context3DTriangleFace.FRONT_AND_BACK: 
			return gl.FRONT_AND_BACK;
		}
		return 0;
	}
}