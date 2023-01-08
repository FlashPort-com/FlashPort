import { IBitmapDrawable } from "./IBitmapDrawable";
import { FlashPort } from "../../FlashPort";
import { BitmapDataChannel } from "./BitmapDataChannel";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { ByteArray } from "../utils/ByteArray";
import { Image } from "canvaskit-wasm";

export class BitmapData implements IBitmapDrawable
{
	public __data:Uint8ClampedArray;
	public image:Image;
	//private var data32:Uint32Array;
	private imageData:ImageData;
	private imageSource:CanvasImageSource;

	private _lock:boolean = false;
	public ctx:CanvasRenderingContext2D;
	private _transparent:boolean;
	private _fillColor:number;
	private _width:number;
	private _height:number;
	
	constructor(width:number, height:number, transparent:boolean = true, fillColor:number = 0xffffffff){
		
		this._transparent = transparent;
		this._fillColor = fillColor;
		this.imageSource = (<HTMLCanvasElement>document.createElement("canvas") );
		this.imageSource.width = this._width = width;
		this.imageSource.height = this._height = height;
		this.ctx = (<CanvasRenderingContext2D>this.imageSource.getContext("2d", {willReadFrequently: true}) );
		this.imageData = this.ctx.getImageData(0, 0, this.imageSource.width, this.imageSource.height);
		this.__data = this.imageData.data;
		//data32 = new Uint32Array(imageData.data);
		this.fillRect(this.rect, fillColor);
	}
	
	public fromImage(img:any,dx:number=0,dy:number=0,opt_dw:number=0,opt_dy:number=0):void {
		this.ctx.drawImage(img, dx, dy);
		FlashPort.dirtyGraphics = true;
		this.imageData = this.ctx.getImageData(0, 0, this._width, this._height);
		this.__data = this.imageData.data;
		this.image = FlashPort.canvasKit.MakeImageFromCanvasImageSource(this.imageSource);
	}
	
	public clone():BitmapData  
	{ 
		let bmdClone:BitmapData = new BitmapData((this.imageSource as HTMLCanvasElement).width, (this.imageSource as HTMLCanvasElement).height, this._transparent, this._fillColor);
		bmdClone.__data = this.__data;
		bmdClone.image = this.image;
		
		return bmdClone 
	}
	
	public get width():number  { return this._width }
	
	public get height():number  { return this._height }
	
	public get transparent():boolean  { return this._transparent; }
	
	public get rect():Rectangle
	{
		return new Rectangle(0, 0, this._width, this._height);
	}
	
	public getPixel(x:number, y:number):number  { 
		var p:number = (y * this._width + x) * 4;
		return (this.__data[p] << 16) | (this.__data[p + 1] << 8) | this.__data[p + 2];
		/*var p:number = y * width + x;
		return data32[p]&0xffffff;*/
	}
	
	public getPixel32(x:number, y:number):number  { 
		var p:number = (y * this.width + x) * 4;
		return (this.__data[p + 3] << 24) | (this.__data[p] << 16) | (this.__data[p + 1] << 8) | this.__data[p + 2];
		/*var p:number = y * width + x;
		return data32[p];*/
	}
	
	public setPixel(x:number, y:number, color:number):void  {
		var p:number = (y * this._width + x) * 4;
		this.__data[p] = (color>>16)&0xff;//r
		this.__data[p + 1] = (color>>8)&0xff;//g
		this.__data[p + 2] = color & 0xff;//b
		/*var p:number = y * width + x;
		data32[p] = 0xff000000 | color;*/
		if (!this._lock) {
			this.ctx.putImageData(this.imageData, 0, 0);
			this.image = FlashPort.canvasKit.MakeImageFromCanvasImageSource(this.imageSource);
			FlashPort.dirtyGraphics = true;
		}
	}
	
	public setPixel32(x:number, y:number, color:number):void  {
		var p:number = (y * this._width + x) * 4;
		this.__data[p] = (color>>16)&0xff;//r
		this.__data[p + 1] = (color>>8)&0xff;//g
		this.__data[p + 2] = color&0xff;//b
		this.__data[p + 3] = color >>> 24;//a
		/*var p:number = y * width + x;
		data32[p] = color;*/
		if (!this._lock) {
			this.ctx.putImageData(this.imageData,0,0);
			this.image = FlashPort.canvasKit.MakeImageFromCanvasImageSource(this.imageSource);
			FlashPort.dirtyGraphics = true;
		}
	}
	
	public colorTransform(rect:Rectangle, ct:ColorTransform) : void {
		
	}
	
	public compare(b:BitmapData):Object  { return null }
	
	public copyChannel(b:BitmapData, r:Rectangle, p:Point, param4:number, param5:number):void  {/**/ }
	
	public copyPixels(sourceBitmapData:BitmapData, sourceRect:Rectangle, destPoint:Point, alphaBitmapData:BitmapData=null, alphaPoint:Point=null, mergeAlpha:boolean=false):void  {
		this.lock();
		for (var x:number = 0; x < sourceRect.width;x++ ) {
			for (var y:number = 0; y < sourceRect.height; y++ ) {
				this.setPixel32(x+destPoint.x, y+destPoint.y, sourceBitmapData.getPixel32(x+sourceRect.x,y+sourceRect.y));
			}
		}
		this.unlock();
	}
	
	public dispose():void  {
		throw Error("dispose method not implemented yet");
	}
	
	public draw(source:IBitmapDrawable, matrix:Matrix = null, colorTransform:ColorTransform = null, blendMode:string = null, clipRect:Rectangle = null, smoothing:boolean = false):void  {
		this.drawWithQuality(source, matrix, colorTransform, blendMode, clipRect, smoothing);
	}
	
	public drawWithQuality(source:IBitmapDrawable, matrix:Matrix=null, colorTransform:ColorTransform=null, blendMode:string=null, clipRect:Rectangle=null, smoothing:boolean=false, quality:string=null):void  {
		if (source instanceof BitmapData){
			var bmd:BitmapData = (<BitmapData>source );
			this.fromImage(bmd.ctx);
		}/*else if(source is TextField){
			var tf:TextField = source as TextField;
			tf.__draw(ctx,matrix);
		}else if (source is Sprite){
			var sp:Sprite = source as Sprite;
			sp.graphics.draw(ctx, sp.worldMatrix, 1, sp.blendMode, sp.transform.colorTransform);
		}else if (source is Shape){
			var sha:Shape = source as Shape;
			sha.graphics.draw(ctx, sha.worldMatrix, 1, sha.blendMode, sha.transform.colorTransform);
		}*/
	}
	
	public fillRect(rect:Rectangle, fillColor:number):void  {
		this.lock();
		for (var y:number = 0; y < this.height; ++y) {
			for (var x:number = 0; x < this.width; ++x) {
				this.setPixel32(x, y,this.transparent?fillColor:(0xff000000|fillColor));
			}
		}
		this.unlock();
	}
	
	public floodFill(param1:number, param2:number, param3:number):void  {/**/ }
	
	//native public function generateFilterRect(param1:Rectangle, param2:BitmapFilter) : Rectangle;
	
	public getColorBoundsRect(param1:number, param2:number, param3:boolean = true):Rectangle  { return null }
	
	public getPixels(param1:Rectangle):ByteArray  { return null }
	
	public copyPixelsToByteArray(param1:Rectangle, param2:ByteArray):void  {/**/ }
	
	public getVector(param1:Rectangle):number[]  { return null }
	
	public hitTest(param1:Point, param2:number, param3:Object, param4:Point = null, param5:number = 1):boolean  { return false }
	
	public merge(param1:BitmapData, param2:Rectangle, param3:Point, param4:number, param5:number, param6:number, param7:number):void  {/**/ }
	
	public noise(randomSeed:number, low:number=0, high:number=255, channelOptions:number=7, grayScale:boolean=false):void  {
		this.lock();
		for (var y:number = 0; y < this._height; ++y) {
			for (var x:number = 0; x < this._width; ++x) {
				this.setPixel32(x, y, 0xff000000|0xffffff*Math.random());
			}
		}
		this.unlock();
	}
	
	public paletteMap(param1:BitmapData, param2:Rectangle, param3:Point, param4:any[] = null, param5:any[] = null, param6:any[] = null, param7:any[] = null):void  {/**/ }
	
	private static perm:any[] = [151,160,137,91,90,15,
	131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
	190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
	88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,
	77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
	102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,
	135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,
	5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
	223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,
	129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,
	251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,
	49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
	138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
	//https://zh.wikipedia.org/zh-hans/Perlin%E5%99%AA%E5%A3%B0
	public perlinNoise(baseX:number, baseY:number, numOctaves:number, randomSeed:number, stitch:boolean, fractalNoise:boolean, channelOptions:number = 7, grayScale:boolean = false, offsets:any[] = null):void  {
		var bw:number = this._width;
		var bh:number = this._height;
		if(!this._lock){
			var nowlock:boolean = this._lock;
			this.lock();
		}
		this.fillRect(this.rect, 0xff000000);
		var chs:any[] = [];// [[0, 0], [1, grayScale?0:5], [2, grayScale?0:10]];
		if (channelOptions&BitmapDataChannel.RED){
			chs.push([0, randomSeed]);
		}
		if (channelOptions&BitmapDataChannel.GREEN){
			chs.push([1, randomSeed+(grayScale?0:5)]);
		}
		if (channelOptions&BitmapDataChannel.BLUE){
			chs.push([2, randomSeed+(grayScale?0:10)]);
		}
		var chlen:number = chs.length;
		var octaves:number = numOctaves;
		var totalAmplitude:number = 0;
		var amplitude:number = 1;
		var baseXB:number = baseX;
		var baseYB:number = baseY;
		var persistance:number = 0.6;
		while (true){
			totalAmplitude+= amplitude;
			baseX = Number(baseX);
			baseY = Number(baseY);
			if (octaves<=0||baseX<=1||baseY<=1){
				break;
			}
			amplitude *= persistance;
			octaves--;
			baseX /= 2;
			baseY /= 2;
		}
		baseX = baseXB;
		baseY = baseYB;
		amplitude = 1;
		octaves = numOctaves;
		while (true){
			baseX = Number(baseX);
			baseY = Number(baseY);
			if (octaves<=0||baseX<=1||baseY<=1){
				break;
			}
			var offsetX:number = 0;
			var offsetY:number = 0;
			if (offsets){
				var offset:Point = (<Point>offsets[numOctaves - octaves] );
				if (offset){
					offsetX = Number(offset.x/16);
					offsetY = Number(offset.y/16);
				}
			}
			var nx:number = Math.ceil(bw/baseX);
			var ny:number = Math.ceil(bh / baseY);
			for (var y:number = 0; y <=ny; y++ ){
				for (var x:number = 0; x <= nx; x++ ){
					if (x != 0 && y != 0){
						for (var i:number = 0; i < chlen; i++ ){
							var chci:number = chs[i][0];
							var chpi:number = chs[i][1];
							var r00:number = BitmapData.perm[((x-1+chpi+offsetX) % 16) + ((y-1+chpi+offsetY) % 16) * 16];
							var r10:number = BitmapData.perm[((x+chpi+offsetX) % 16) + ((y-1+chpi+offsetY) % 16) * 16];
							var r01:number = BitmapData.perm[((x-1+chpi+offsetX) % 16) + ((y+chpi+offsetY) % 16) * 16];
							var r11:number = BitmapData.perm[((x+chpi+offsetX) % 16) + ((y+chpi+offsetY) % 16) * 16];
							var w:number = x * baseX;
							if (w>bw){
								w = bw;
							}
							var h:number = y * baseY;
							if (h>bh){
								h = bh;
							}
							var sx:number = (x - 1) * baseX;
							var sy:number = (y - 1) * baseY;
							for (var bx:number = sx; bx < w;bx++ ){
								var tx:number = (bx - sx) / baseX;
								tx = tx * tx * (3   - 2 * tx);
								//tx = 6 * tx * tx * tx * tx * tx - 15 * tx * tx * tx * tx + 10 * tx * tx * tx;
								for (var by:number = sy; by < h; by++ ){
									var ty:number = (by - sy) / baseY;
									ty = ty * ty * (3   - 2 * ty);
									//ty = 6 * ty * ty * ty * ty * ty - 15 * ty * ty * ty * ty + 10 * ty * ty * ty;
									var cx0:number = r10 * tx + r00 * (1 - tx);
									var cx1:number = r11 * tx + r01 * (1 - tx);
									var c:number = cx1 * ty + cx0 * (1 - ty);
									this.__data[(bx + by * bw) * 4 + chci] += c * amplitude / totalAmplitude;
									//vec[bx + by * bw] += c/numOctaves;
								}
							}
						}
					}
				}
			}
			octaves--;
			baseX /= 2;
			baseY /= 2;
			amplitude *= persistance;
		}
		this._lock = nowlock;
		if (!this._lock) {
			this.ctx.putImageData(this.imageData,0,0);
			FlashPort.dirtyGraphics = true;
		}
		//setVector(rect, vec);
	}
	
	public pixelDissolve(param1:BitmapData, param2:Rectangle, param3:Point, param4:number = 0, param5:number = 0, param6:number = 0):number  { return 0 }
	
	public scroll(param1:number, param2:number):void  {/**/ }
	
	public setPixels(param1:Rectangle, param2:ByteArray):void  {/**/ }
	
	public setVector(param1:Rectangle, param2:number[]):void  {
		this.lock();
		for (var x:number = 0; x < this._width;x++ ){
			for (var y:number = 0; y < this._height; y++ ){
				this.setPixel(x, y, param2[x + y * this._width]);
			}
		}
		this.unlock();
	}
	
	public threshold(param1:BitmapData, param2:Rectangle, param3:Point, param4:string, param5:number, param6:number = 0, param7:number = 4.294967295E9, param8:boolean = false):number  { return 0 }
	
	public lock():void  {
		this._lock = true;
	}
	
	public unlock(param1:Rectangle = null):void  {
		this._lock = false;
		this.ctx.putImageData(this.imageData, 0, 0);
		this.image = FlashPort.canvasKit.MakeImageFromCanvasImageSource(this.imageSource);
		FlashPort.dirtyGraphics = true;
	}
	
	public histogram(param1:Rectangle = null):any[]  { return null }
	
	public encode(param1:Rectangle, param2:Object, param3:ByteArray = null):ByteArray  { return null }
}