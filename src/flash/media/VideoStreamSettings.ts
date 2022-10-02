
export class VideoStreamSettings extends Object
{
	private _bandwidth:number = 0;
	private _codec:string = "";
	private _fps:number = 0;
	private _height:number = 0;
	private _keyFrameInterval:number;
	private _quality:number;
	private _width:number;
	
	public get bandwidth():number { return this._bandwidth; }

	public get codec():string { return this._codec; }

	public get fps():number { return this._fps; }

	public get height():number { return this._height; }

	public get keyFrameInterval():number { return this._keyFrameInterval; }

	public get quality():number { return this._quality; }

	public get width():number { return this._width; }

	public setKeyFrameInterval(keyFrameInterval:number):void
	{
		this._keyFrameInterval = keyFrameInterval;
	}

	public setMode(width:number, height:number, fps:number):void
	{
		this._width = width;
		this._height = height;
		this._fps = fps;
	}

	public setQuality(bandwidth:number, quality:number):void
	{
		this._bandwidth = bandwidth;
		this._quality = this._quality;
	}

	constructor(){
		super();
	}
}