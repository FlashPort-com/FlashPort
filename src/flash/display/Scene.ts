export class Scene extends Object
{
	private _labels:any[] = [];
	private _name:string = "Scene 1";
	private _numFrames:number = 1;
	
	/**
	 * An array of FrameLabel objects for the scene. Each FrameLabel object contains
	 * a frame property, which specifies the frame number corresponding to the 
	 * label, and a name property.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get labels():any[] { return this._labels; }

	/**
	 * The name of the scene.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get name():string { return this._name; }

	/**
	 * The number of frames in the scene.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get numFrames():number { return this._numFrames; }

	constructor (name:string, labels:any[], numFrames:number){
		super();
		this._name = name;
		this._labels = labels;
		this._numFrames = numFrames;
	}
}
