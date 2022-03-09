import { Sprite } from "./Sprite.js";
import { FrameLabel } from "./FrameLabel.js";
import { DisplayObject } from "./DisplayObject.js";
import { FlashPort } from "../../FlashPort.js";

import { Scene } from "./Scene.js";
import { AEvent } from "../events/AEvent.js";
import { Tweener } from "../../caurina/transitions/Tweener.js";
import { Equations } from "../../caurina/transitions/Equations.js";
import { Sound } from "../media/Sound.js";
import { SoundChannel } from "../media/SoundChannel.js";
import { SoundTransform } from "../media/SoundTransform.js";
import { URLRequest } from "../net/URLRequest.js";


export class MovieClip extends Sprite
{
	private _currentFrame:number = 1;
	private _currentKeyFrame:number = 0;
	private _currentFrameLabel:string = "";
	private _currentLabel:string = "";
	private _currentLabels:Array<FrameLabel> = [];
	private _currentScene:Scene;
	private _enabled:boolean = true;
	private _framesLoaded:number = 1;
	private _isPlaying:boolean = false;
	private _scenes:Array<any> = [];
	private _totalFrames:number = 1;
	private _trackAsMenu:boolean = false;
	
	private _keyframes:Object = {};
	private _tweens:Object = {};
	private _tweenEnds:Object = {};
	private _frame:number = 0;
	private _keyList:Array<number> = [];
	private _layerList:Array<any> = [];
	private _prevKeyframe:number = 0;
	
	private _frameScripts:Object = {};
	private _frameSounds:Object = {};
	private _playingSounds:Object = {};
	
	/**
	 * Animate Method Only
	 */
	public addLabels(frameLabels:Array<any>):void 
	{
		for  (let label of frameLabels) 
		{
			this._currentLabels.push(new FrameLabel(label.l, label.f));
			if (label.f == 1) this._currentLabel = label.l;
		}
	}
	
	/**
	 * Animate Method Only
	 */
	public addFrameObjects(frame:number, layer:number, frameEnd:number, frameObjects:any[]):void 
	{
		if (this._keyList.indexOf(frame) == -1) this._keyList.push(frame);
		
		//for each (var item:DisplayObject in frameObjects) item._off = true;
		
		this._keyList.sort(function(a:any, b:any):any {return a-b});
		this._totalFrames = Math.max(this._totalFrames, frameEnd);
		
		if (this._keyframes[frame] == undefined) this._keyframes[frame] = {};
		if (this._keyframes[frame][layer] == undefined)
		{
			this._keyframes[frame][layer] = {elements:[], duration:1};
		}
		this._keyframes[frame][layer]['elements'] = this._keyframes[frame][layer]['elements'].concat(frameObjects);
		this._keyframes[frame][layer]['duration'] = frameEnd;
	}
	
	/**
	 * Animate Method Only
	 */
	public addFrameTween(start:number, end:number, obj:DisplayObject, props:Object):void 
	{
		if (this._tweens[start] == undefined) this._tweens[start] = [];
		this._tweens[start].push({start:start, end:end, obj:obj, props:props});
		
		if (start != end)
		{
			if (this._tweenEnds[end] == undefined) this._tweenEnds[end] = [];
			this._tweenEnds[end].push({start:start, end:end, obj:obj, props:props});
		}
	}
	
	private navigate(frame:number, force:boolean = false):void 
	{
		let _this = this;
		if (this._frame == frame && !force) return;
		
		this._currentFrame = (frame + 1 > this._totalFrames) ? 1 : frame + 1;
		this._frame = (frame > this._totalFrames - 1) ? 0 : frame;
		
		if (this._keyframes[this._frame] != undefined) this._currentKeyFrame = this._frame;
		
		// call frame script code if there is any.
		if (this._frameScripts[this._currentKeyFrame] != undefined) this._frameScripts[this._currentKeyFrame]();
		
		if (this._isPlaying || force)
		{
			// turn off elements whose duration has expired.
			if (this._keyframes[this._prevKeyframe] != undefined)
			{
				for (var layerID of this._keyframes[this._prevKeyframe])
				{
					var duration:number = this._keyframes[this._prevKeyframe][layerID]['duration'];
					if ((this._frame + 1) > duration || this._frame < this._prevKeyframe)
					{
						for  (let prevElement of this._keyframes[this._prevKeyframe][layerID]['elements'])
						{
							prevElement._off = true;
						}
					}
				}
			}
			
			// turn on elements for current keyframe that haven't expired
			if (this._keyframes[this._currentKeyFrame] != undefined)
			{
				for (layerID in this._keyframes[this._currentKeyFrame])
				{
					duration = this._keyframes[this._currentKeyFrame][layerID]['duration'];
					if ((this._frame + 1) <= duration)
					{
						for  (let element of this._keyframes[this._currentKeyFrame][layerID]['elements'])
						{
							if (element) element._off = false;
						}
					}
				}
			}
			
			this._prevKeyframe = this._currentKeyFrame;
			this.updateTweens(this._currentKeyFrame);
			FlashPort.dirtyGraphics = true;
			
			// play timeline sounds
			if (this._frameSounds[this._currentKeyFrame] != undefined && this._isPlaying)
			{
				var snds:any[] = this._frameSounds[this._currentKeyFrame];
				for  (let sndItem of snds) 
				{
					var playingID:string = sndItem.id + this._currentKeyFrame.toString();
					if (this._playingSounds[playingID + "_channel"] != undefined)
					{
						var playingChannel:SoundChannel = this._playingSounds[playingID + "_channel"];
						var playingSound:Sound = this._playingSounds[playingID + "_sound"];
						playingChannel.stop();
						playingSound.load(new URLRequest(sndItem.id));
					}
					else
					{
						var snd:Sound = new Sound();
						snd.__envelops = sndItem.vols;
						snd.addEventListener(AEvent.COMPLETE, function():void {
							var sndTransform:SoundTransform = new SoundTransform();
							sndTransform.leftToLeft = sndItem.vols[0].l;
							sndTransform.rightToRight = sndItem.vols[0].r;
							_this._playingSounds[playingID + "_channel"] = snd.play(sndItem.start, 0, sndTransform);
							_this._playingSounds[playingID + "_sound"] = snd;
						});
						snd.load(new URLRequest(sndItem.id));
					}
					
				}
			}
		}
	}
	
	private updateTweens(currentKeyFrame:number):void 
	{
		var twArr:any[] = this._tweens[currentKeyFrame];
		if (!twArr) twArr = this._tweenEnds[currentKeyFrame];
		
		if (twArr)
		{
			var len:number = twArr.length;
			for (var i:number = 0; i < len; i++) 
			{
				var tw:any = twArr[i];
				var t:number = (tw.end - tw.start) / (this.stage.frameRate - 1);
				if (currentKeyFrame != this._frame)
				{
					for (var p in tw.props) 
					{
						if (p != "time" && p != "transition")
						{
							var propValue:number = tw.props[p];
							var percent:number = ((this._frame - tw.start) / (tw.end - tw.start));
							tw.obj[p] = propValue * percent;
						}
					}
				}
				else
				{
					if (tw.end == currentKeyFrame) t = 0;
					tw.props.transition = Equations.easeNone;
					tw.props.time = t;
					if (this._isPlaying || t==0) Tweener.addTween(tw.obj, tw.props);
				}
				
			}
		}
	}
	
	/**
	 * Animate Only
	 * @param	id
	 * @param	frame
	 * @param	envelops
	 */
	public _addSnd(id:string, start:number, end:number, frame:number, envelops:any[]):void 
	{
		if (this._frameSounds[frame] == undefined) this._frameSounds[frame] = [];
		this._frameSounds[frame].push({id:id, start:start, end:end, vols:envelops});
	}
	
	/**
	 * Specifies the number of the frame in which the playhead is located in the timeline of 
	 * the MovieClip instance. If the movie clip has multiple scenes, this value is the 
	 * frame number in the current scene.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get currentFrame():number { return this._currentFrame; }

	/**
	 * The label at the current frame in the timeline of the MovieClip instance.
	 * If the current frame has no label, currentLabel is null.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 * @playerversion	Lite 4
	 */
	public get currentFrameLabel():string { return this._currentFrameLabel; }

	/**
	 * The current label in which the playhead is located in the timeline of the MovieClip instance.
	 * If the current frame has no label, currentLabel is set to the name of the previous frame 
	 * that includes a label. If the current frame and previous frames do not include a label,
	 * currentLabel returns null.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get currentLabel():string { return this._currentLabel; }

	/**
	 * Returns an array of FrameLabel objects from the current scene. If the MovieClip instance does
	 * not use scenes, the array includes all frame labels from the entire MovieClip instance.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get currentLabels():any[] { return this._currentLabels; }

	/**
	 * The current scene in which the playhead is located in the timeline of the MovieClip instance.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get currentScene():Scene { return this._currentScene; }

	/**
	 * A Boolean value that indicates whether a movie clip is enabled. The default value of enabled
	 * is true. If enabled is set to false, the movie clip's
	 * Over, Down, and Up frames are disabled. The movie clip
	 * continues to receive events (for example, mouseDown,
	 * mouseUp, keyDown, and keyUp).
	 * 
	 *   The enabled property governs only the button-like properties of a movie clip. You
	 * can change the enabled property at any time; the modified movie clip is immediately
	 * enabled or disabled. If enabled is set to false, the object is not 
	 * included in automatic tab ordering.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get enabled():boolean { return this._enabled; }
	public set enabled (value:boolean)
	{
		
	}

	/**
	 * The number of frames that are loaded from a streaming SWF file. You can use the framesLoaded 
	 * property to determine whether the contents of a specific frame and all the frames before it
	 * loaded and are available locally in the browser. You can also use it to monitor the downloading 
	 * of large SWF files. For example, you might want to display a message to users indicating that 
	 * the SWF file is loading until a specified frame in the SWF file finishes loading.
	 * 
	 *   If the movie clip contains multiple scenes, the framesLoaded property returns the number 
	 * of frames loaded for all scenes in the movie clip.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get framesLoaded():number { return this._framesLoaded; }

	public get isPlaying():boolean { return this._isPlaying; }

	/**
	 * An array of Scene objects, each listing the name, the number of frames,
	 * and the frame labels for a scene in the MovieClip instance.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get scenes():any[] { return this._scenes; }

	/**
	 * The total number of frames in the MovieClip instance.
	 * 
	 *   If the movie clip contains multiple frames, the totalFrames property returns 
	 * the total number of frames in all scenes in the movie clip.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get totalFrames():number { return this._totalFrames; }

	/**
	 * Indicates whether other display objects that are SimpleButton or MovieClip objects can receive 
	 * mouse release events or other user input release events. The trackAsMenu property lets you create menus. You 
	 * can set the trackAsMenu property on any SimpleButton or MovieClip object.
	 * The default value of the trackAsMenu property is false.
	 * 
	 *   You can change the trackAsMenu property at any time; the modified movie 
	 * clip immediately uses the new behavior.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get trackAsMenu():boolean { return this._trackAsMenu; }
	public set trackAsMenu (value:boolean)
	{
		
	}

	public addFrameScript (frame:number, func:Function):void
	{
		this._frameScripts[frame] = func;
	}

	/**
	 * Starts playing the SWF file at the specified frame.  This happens after all 
	 * remaining actions in the frame have finished executing.  To specify a scene 
	 * as well as a frame, specify a value for the scene parameter.
	 * @param	frame	A number representing the frame number, or a string representing the label of the 
	 *   frame, to which the playhead is sent. If you specify a number, it is relative to the 
	 *   scene you specify. If you do not specify a scene, the current scene determines the global frame number to play. If you do specify a scene, the playhead
	 *   jumps to the frame number in the specified scene.
	 * @param	scene	The name of the scene to play. This parameter is optional.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public gotoAndPlay (frame:any, scene:string = null):void
	{
		this._isPlaying = true;
		if (frame instanceof String)
		{
			for  (let label of this._currentLabels) 
			{
				if (label.name == frame)
				{
					frame = label.frame - 1;
					this._currentLabel = label.name;
					break;
				}
			}
		}
		
		if (this._keyframes[frame - 1] == undefined)
		{
			for  (let key of this._keyList) 
			{
				if (frame - 1 > key)
				{
					this._currentKeyFrame = key;
				}
				else
				{
					break;
				}
			}
		}
		
		this.navigate(frame - 1, true);
	}

	/**
	 * Brings the playhead to the specified frame of the movie clip and stops it there.  This happens after all 
	 * remaining actions in the frame have finished executing.  If you want to specify a scene in addition to a frame, 
	 * specify a scene parameter.
	 * @param	frame	A number representing the frame number, or a string representing the label of the 
	 *   frame, to which the playhead is sent. If you specify a number, it is relative to the 
	 *   scene you specify. If you do not specify a scene, the current scene determines the global frame number at which to go to and stop. If you do specify a scene, 
	 *   the playhead goes to the frame number in the specified scene and stops.
	 * @param	scene	The name of the scene. This parameter is optional.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 * @throws	ArgumentError If the scene or frame specified are
	 *   not found in this movie clip.
	 */
	public gotoAndStop (frame:any, scene:string = null):void
	{
		this._isPlaying = false;
		if (frame instanceof String)
		{
			for  (let label of this._currentLabels) 
			{
				if (label.name == frame)
				{
					frame = label.frame;
					this._currentLabel = label.name;
					break;
				}
			}
		}
		
		if (this._keyframes[frame - 1] == undefined)
		{
			for  (let key of this._keyList) 
			{
				if (frame - 1 > key)
				{
					this._currentKeyFrame = key;
				}
				else
				{
					break;
				}
			}
		}
		
		this.navigate(frame - 1, true);
	}

	/**
	 * Creates a new MovieClip instance. After creating the MovieClip, call the 
	 * addChild() or addChildAt() method of a
	 * display object container that is onstage.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	constructor(){
		super();
		
		this.addEventListener(AEvent.ENTER_FRAME, this.onFrameEvent);
	}

	/**
	 * Sends the playhead to the next frame and stops it.  This happens after all 
	 * remaining actions in the frame have finished executing.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public nextFrame():void
	{
		
	}

	/**
	 * Moves the playhead to the next scene of the MovieClip instance.  This happens after all 
	 * remaining actions in the frame have finished executing.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public nextScene():void
	{
		
	}

	/**
	 * Moves the playhead in the timeline of the movie clip.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public play():void
	{
		
	}

	/**
	 * Sends the playhead to the previous frame and stops it.  This happens after all 
	 * remaining actions in the frame have finished executing.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public prevFrame():void
	{
		
	}

	/**
	 * Moves the playhead to the previous scene of the MovieClip instance.  This happens after all 
	 * remaining actions in the frame have finished executing.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public prevScene():void
	{
		
	}

	/**
	 * Stops the playhead in the movie clip.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public stop():void
	{
		this._isPlaying = false;
	}
	
	private onFrameEvent(e:Event):void 
	{
		if (this._isPlaying) this.navigate(this._frame + 1);
	}
}