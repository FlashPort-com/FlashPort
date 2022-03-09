import { ByteArray } from "../utils/ByteArray.js";
export class Program3D extends Object
{
	public fshader:WebGLShader;
	public vshader:WebGLShader;
	public program:WebGLProgram;
	public gl:WebGLRenderingContext;
	private uniformLocations:any = { };
	private attribLocations:any = { };

	constructor()
	{
		super();
	}
	
	public upload(vcode:ByteArray, fcode:ByteArray):void
	{
		this.fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.vshader = this.gl.createShader(this.gl.VERTEX_SHADER);
		vcode.position = fcode.position = 0;
		this.gl.shaderSource(this.vshader, vcode.readUTFBytes(vcode.length));
		this.gl.compileShader(this.vshader);

		if (!this.gl.getShaderParameter(this.vshader,this.gl.COMPILE_STATUS)) 
		{
			throw this.vshader+"\n"+vcode+"\n" + (this.gl.getShaderInfoLog(this.vshader));
		}

		this.gl.shaderSource(this.fshader, fcode.readUTFBytes(fcode.length));
		this.gl.compileShader(this.fshader);

		if (!this.gl.getShaderParameter(this.fshader,this.gl.COMPILE_STATUS)) 
		{
			throw fcode+"\n" + (this.gl.getShaderInfoLog(this.fshader));
		}

		this.gl.attachShader(this.program, this.vshader);
		this.gl.attachShader(this.program, this.fshader);
		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS)) 
		{
			throw (this.gl.getProgramInfoLog(this.program));
		}
	}
	
	public dispose():void
	{
		this.gl.deleteShader(this.fshader);
		this.gl.deleteShader(this.vshader);
		this.gl.deleteProgram(this.program);
	}
	
	public getUniformLocation(name:string):WebGLUniformLocation 
	{
		var loc:WebGLUniformLocation = this.uniformLocations[name];
		if (loc==null) {
			loc = this.uniformLocations[name] = this.gl.getUniformLocation(this.program,name);
		}
		return loc;
	}

	public getAttribLocation(name:string):number 
	{
		var loc:Object = this.attribLocations[name];
		if (loc==null) {
			loc = this.attribLocations[name] = this.gl.getAttribLocation(this.program,name);
		}
		var locnum:number = Number(loc);
		this.gl.enableVertexAttribArray(locnum);
		return locnum;
	}
}