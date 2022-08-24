import { TextFieldType } from "./TextFieldType";
import { TextFormat } from "./TextFormat";
import { TextFieldAutoSize } from "./TextFieldAutoSize";
import { FlashPort } from "../../FlashPort";
import { StyleSheet } from "./StyleSheet";
import { TextLineMetrics } from "./TextLineMetrics";

import { GLCanvasRenderingContext2D } from "../__native/GLCanvasRenderingContext2D";
import { GLDrawable } from "../__native/GLDrawable";
import { GLIndexBufferSet } from "../__native/GLIndexBufferSet";
import { WebGLRenderer } from "../__native/WebGLRenderer";
import { Char } from "../__native/te/Char";
import { LineInfo } from "../__native/te/LineInfo";
import { UVTexture } from "../__native/te/UVTexture";
import { BitmapData } from "../display/BitmapData";
import { BlendMode } from "../display/BlendMode";
import { Graphics } from "../display/Graphics";
import { InteractiveObject } from "../display/InteractiveObject";
import { Sprite } from "../display/Sprite";
import { AEvent } from "../events/AEvent";
import { MouseEvent } from "../events/MouseEvent";
import { FocusEvent } from "../events/FocusEvent";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { DisplayObject } from "../display/DisplayObject";

export class TextField extends InteractiveObject
{
	private input:HTMLInputElement;
	private _type:string = TextFieldType.DYNAMIC;
	private graphics:Graphics = new Graphics;
	private graphicsDirty:boolean = true;
	private glDirty:boolean = false;
	private static richTextFields:any[] = ["font", "size", "color", "bold", "italic", "underline", "url", "target", "align", "leftMargin", "rightMargin", "indent", "leading", "blockIndent", "kerning", "letterSpacing", "display"];
	private _text:string="";
	private lines:any[] = [];
	private _textFormat:TextFormat=new TextFormat;
	private _width:number = 100;
	private _height:number = 100;
	private _autoSize:string=TextFieldAutoSize.NONE;
	private _background:boolean = false;
	private _backgroundColor:number = 0xFFFFFF;
	private _border:boolean = false;
	private _borderColor:number = 0x000000;
	private boundHelpRect:Rectangle = new Rectangle;
	private _fullBounds:Rectangle;
	
	private _cacheCanvas:HTMLCanvasElement;
	private _cacheCTX:CanvasRenderingContext2D;
	private _cacheImage:BitmapData;
	private _cacheMatrix:Matrix;
	private _cacheOffsetX:number = 0;
	private _cacheOffsetY:number = 0;
	
	
	//for webgl
	public chars:any[]; 
	private static indexPool:Object = {};
	private static DRAWABLE_POOL:Object = {};
	private da:GLDrawable;
	private indexBufferSet:GLIndexBufferSet;
	private nowKey:number = 0;
	private num:number = 0;
	private charVersion:number = 1;
	public disWrapper:Sprite;
	public _textWidth:number = -1;
	public _textHeight:number = -1;
	private _wordWrap:boolean = false;
	private static lineInfos:any[] = [];
	public hasATag:boolean = false;//有a标签
	public tagas:any[] = [];
	private href:string;
	private _htmlText:string;
	
	
	constructor()
	{
		super();
		this.textColor = 0x000000;
		this.addEventListener(AEvent.REMOVED_FROM_STAGE, this.removedFromStage);
	}
	
	private removedFromStage = (e:AEvent):void =>
	{
		if (this.input && this.input.parentElement){
			this.input.parentElement.removeChild(this.input);
		}
	}
	
	public static isFontCompatible = (param1:string, param2:string):boolean => { return false; }
	
	public get alwaysShowSelection():boolean  { return false; }
	
	public set alwaysShowSelection(param1:boolean)  {/**/ }
	
	public get antiAliasType():string  { return null; }
	
	public set antiAliasType(param1:string)  {/**/ }
	
	public get autoSize():string  { return this._autoSize; }
	
	public set autoSize(param1:string)  {
		this._autoSize = param1; 
		this.graphicsDirty = true;
		FlashPort.dirtyGraphics = true;
	}
	
	public get background():boolean  { return this._background; }
	
	public set background(param1:boolean)  {
		this._background = param1;
		this.graphicsDirty = true;
		FlashPort.dirtyGraphics = true;
	}
	
	public get backgroundColor():number  { return this._backgroundColor; }
	
	public set backgroundColor(param1:number)  {
		this._backgroundColor=param1 
		this.graphicsDirty = true;
		FlashPort.dirtyGraphics = true;
	}
	
	public get border():boolean  { return this._border; }
	
	public set border(param1:boolean)  {
		this._border = param1;
		this.graphicsDirty = true;
		FlashPort.dirtyGraphics = true;
	}
	
	public get borderColor():number  { return this._borderColor; }
	
	public set borderColor(param1:number)  {
		this._borderColor = param1 ;
		this.graphicsDirty = true;
		FlashPort.dirtyGraphics = true;
	}
	
	public get bottomScrollV():number  { return 0; }
	
	public get caretIndex():number  { return 0; }
	
	public get condenseWhite():boolean  { return false; }
	
	public set condenseWhite(param1:boolean)  {/**/ }
	
	public get defaultTextFormat():TextFormat  { return this._textFormat; }
	
	public set defaultTextFormat(param1:TextFormat)  {
		this._textFormat = param1;
		this.graphicsDirty = true;
		FlashPort.dirtyGraphics = true;
	}
	
	public get embedFonts():boolean  { return false; }
	
	public set embedFonts(param1:boolean)  {/**/ }
	
	public get gridFitType():string  { return null; }
	
	public set gridFitType(param1:string)  {/**/ }
	
	
	public get length():number  { return 0; }
	
	public get textInteractionMode():string  { return null; }
	
	public get maxChars():number  { return 0; }
	
	public set maxChars(param1:number)  {/**/ }
	
	public get maxScrollH():number  { return 0; }
	
	public get maxScrollV():number  { return 0; }
	
	public get mouseWheelEnabled():boolean  { return false; }
	
	public set mouseWheelEnabled(param1:boolean)  {/**/ }
	
	public get multiline():boolean  { return false; }
	
	public set multiline(param1:boolean)  {/**/ }
	
	public get numLines():number  { return 0; }
	
	public get displayAsPassword():boolean  { return false; }
	
	public set displayAsPassword(param1:boolean)  {/**/ }
	
	public get restrict():string  { return null; }
	
	public set restrict(param1:string)  {/**/ }
	
	public get scrollH():number  { return 0; }
	
	public set scrollH(param1:number)  {/**/ }
	
	public get scrollV():number  { return 0; }
	
	public set scrollV(param1:number)  {/**/ }
	
	public get selectable():boolean  { return false; }
	
	public set selectable(param1:boolean)  {/**/ }
	
	public get selectedText():string
	{
		return this.text.substring(this.selectionBeginIndex, this.selectionEndIndex);
	}
	
	public get selectionBeginIndex():number  { return 0; }
	
	public get selectionEndIndex():number  { return 0; }
	
	public get sharpness():number  { return 0; }
	
	public set sharpness(param1:number)  {/**/ }
	
	public get styleSheet():StyleSheet  { return null; }
	
	public set styleSheet(param1:StyleSheet)  {/**/ }
	
	
	public get htmlText():string  { return null; }
	
	public set htmlText(value:string)  {
		this.hasATag = false;
		this.glDirty = true;
		if (value != null){
			this.tagas = [];
			//charsLength = 0;
			this._text = "";
			value = value.replace(/\\n/g, "<br/>")
			.replace(/\n/g, "<br/>")
			.replace(/<br>/g, "<br/>");
			this._htmlText = value;
			try{
				var xmllist:DOMParser = new DOMParser();
				var hd:Document = this.parseFromString(value);
				
				for(var i:number=0;i<hd.body.childNodes.length;i++){
					this.doXML(hd.body.childNodes[i] as Element,this._textFormat.font, Number(this._textFormat.size),Number(this._textFormat.color),null,Number(this._textFormat.indent),Number(this._textFormat.underline));
				}
				
				//for e(var xml:XML in xmllist){
					//doXML(xml, _defFont, _defSize, _defColor,null,_indent,_defUnderline);
				//}
			}catch (err){
				this.text = value;
			}
		}
	}
	
	private doXML = (xml:Element, font:string, size:number, color:number, href:string, indent:number, underline:number):void =>
	{
		this.href = href;
		if (xml==null){
			return;
		}
		var l:string = xml.localName;
		if (l === "br"){
			var txt:string = "\n";
		}else if(xml.nodeType===3){
			txt = xml.nodeValue.replace(/&nbsp;/g," ");
			txt = txt.replace(/ﾠ/g," ");
		}if(xml.attributes){
			if (l === "font"){
				if (xml.attributes.getNamedItem("face")){
					font = xml.attributes.getNamedItem("face").nodeValue;
				}
				if (xml.attributes.getNamedItem("size")){
					size = Number(xml.attributes.getNamedItem("size").nodeValue);
				}
				if (xml.attributes.getNamedItem("color")){
					color = parseInt(xml.attributes.getNamedItem("color").nodeValue.replace("#",""),16);
				}
			}else if (l === "a"){
				if (xml.attributes.getNamedItem("href")){
					this.hasATag = true;
					href = xml.attributes.getNamedItem("href").nodeValue;
					this.href = href;
				}
			}else if (l === "img"){
				if (xml.attributes.getNamedItem("src")){
					var imgsrc:string = xml.attributes.getNamedItem("src").nodeValue;
					if (xml.attributes.getNamedItem("width")){
						var imgwidth:number = parseFloat(xml.attributes.getNamedItem("width").nodeValue);
					}
				}
			}else if (l === "textformat"){
				if (xml.attributes.getNamedItem("indent")){
					indent= Number(xml.attributes.getNamedItem("@indent").nodeValue);
				}
			}
		}
		if (l==="u"){
			underline = 1;
		}
		this._textFormat.font = font?font.toLowerCase():font;
		this._textFormat.size = size;
		this._textFormat.color = color;
		this._textFormat.indent = indent;
		this._textFormat.underline = underline;
		
		/*if (imgsrc){
			appendImg(id2img[imgsrc],imgwidth);
		}*/
		
		if (txt && txt.length > 0){
			this.appendText(txt);
		}
		
		
		if (xml.childNodes) {
			for(var i:number=0;i<xml.childNodes.length;i++){
				this.doXML(xml.childNodes[i] as Element,font,size,color,href,indent,underline);
			}
		}
	}
	
	public get text():string  { return this._text; }
	
	public set text(value:string)  {
		/*_text = txt; 
		FlashPort.dirtyGraphics = true;
		graphicsDirty = true;
		
		if (txt && txt.length > 0 && FlashPort.renderer is WebGLRenderer){
			glDirty = true;
			chars = [];
			var l:number = txt.length;
			for (var i:number = 0; i < l;i++ ){
				var c:Char = new Char(txt.charAt(i),_textFormat.size as int,_textFormat.font,_textFormat.color as uint);//color font size etc
				chars.push(c);
				WebGLRenderer.textCharSet.add(c);
			}
		}else{
			lines = txt.split("\n");
		}*/
		if (value === null){
			value = "";
		}
		if (this._text===value){
			return;
		}
		this.hasATag = false;
		this.chars = null;
		this.lines = null;
		this._text = null;
		this.appendText(value);
	}
	
	public appendText = (value:string):void =>
	{
		FlashPort.dirtyGraphics = true;
		this.graphicsDirty = true;
		if(this._text!=null){
			this._text += value;
		}else{
			this._text = value;
		}
		
		if (this._text && this._text.length > 0 && FlashPort.renderer instanceof WebGLRenderer)
		{
			this.glDirty = true;
			var tl:number = value.length;
			this.chars = this.chars||[];
			for (var i:number = 0; i < tl;i++ ){
				var c:Char = new Char(value.charAt(i), this._textFormat.size, this._textFormat.font, this._textFormat.color);//color font size etc
				this.chars.push(c);
				WebGLRenderer.textCharSet.add(c);
			}
		}
		else
		{
			this.lines = this.lines || [];
			this.lines = this.lines.concat(value.split("\n"));
		}
	}
	
	private static PUSH_POOL = (key:number,da:GLDrawable):void =>
	{
		var arr:any[] = TextField.DRAWABLE_POOL[key];
		if (arr==null){
			arr = TextField.DRAWABLE_POOL[key] = [];
		}
		arr.push(da);
	}
	
	private static POP_POOL = (pow2num:number):GLDrawable =>
	{
		var arr:any[] = TextField.DRAWABLE_POOL[pow2num];
		if (arr==null){
			arr = TextField.DRAWABLE_POOL[pow2num] = [];
		}
		if (arr.length==0){
			var da:GLDrawable  = new GLDrawable(new Float32Array(pow2num * 8),new Float32Array(pow2num*8),null,WebGLRenderingContext.DYNAMIC_DRAW);
			return da;
		}
		return arr.pop();
	}
	
	private __updateBuff = ():void =>
	{
		if(this.glDirty&&this.chars&&this.chars.length>0){
			var currentLineNum:number = -1;
			this.num = 0;
			this.charVersion++;
			//更新char相对位置
			var clen:number = 1;//todo  多个动态文本一起渲染
			for (var i:number = 0; i < clen; i++){
				var line:TextField = this;
				
				if(line.disWrapper){
					while(line.disWrapper.numChildren>0){
						line.disWrapper.removeChildAt(0);
					}
				}
				
				line._textWidth = 0;
				//line.textMatrixVer = line.worldVersion;
				var startLineNum:number = currentLineNum+1;
				var cs:any[] = line.chars;
				if (cs && line.chars.length){
					currentLineNum++;
					var lineInfo:LineInfo = TextField.lineInfos[currentLineNum] = TextField.lineInfos[currentLineNum] || new LineInfo;
					lineInfo.maxFontSize = 0;
					var tx:number = 2;
					var ty:number = 2;
					lineInfo.offsetY = ty;
					var tlen:number = line.chars.length;
					for (var j:number = 0; j < tlen; j++ ){
						var txt:Char = cs[j];
						txt.lineInfo = lineInfo;
						var char:UVTexture = txt.texture;
						if (char.u0==-1){
							return;
						}
						var tscale:number = txt.size / char.fontSize;
						if (txt.v=="\n"){
							tx = 2;
							ty += lineInfo.maxFontSize+txt.leading;
							currentLineNum++;
							if(lineInfo&&line._textWidth<lineInfo.width){
								line._textWidth = lineInfo.width;
							}
							lineInfo = TextField.lineInfos[currentLineNum] = TextField.lineInfos[currentLineNum] || new LineInfo;
							lineInfo.maxFontSize = 0;
							lineInfo.width = 0;
							lineInfo.offsetY = ty;
							continue;
						}else if (txt.v==""){
							console.log("img");
							/*if (char.dis){
								if (line.disWrapper==null){
									line.disWrapper = new Sprite;
									line.add(line.disWrapper);
								}
								line.disWrapper.addChild(char.dis);
								char.dis.x = tx;
								char.dis.y = ty;
							}*/
						}
						
						//tx为文字起始点 ts为文字末尾点
						if (line.wordWrap){
							if ((tx + char.width*tscale) > line._width){
								tx = 2;
								ty += lineInfo.maxFontSize+txt.leading;
								currentLineNum++;
								if(lineInfo&&line._textWidth<lineInfo.width){
									line._textWidth = lineInfo.width;
								}
								lineInfo = TextField.lineInfos[currentLineNum] = TextField.lineInfos[currentLineNum] || new LineInfo;
								lineInfo.maxFontSize = 0;
								lineInfo.width = 0;
								lineInfo.offsetY = ty;
							}
						}else{
							if(line.autoSize==TextFieldAutoSize.NONE){
								if ((tx+char.width*tscale)>line._width){
									//找下一个\n
									continue;
								}
							}
						}
						
						if (lineInfo.maxFontSize < txt.size) {
							lineInfo.maxFontSize = txt.size;
						}
						
						txt.charVersion = this.charVersion;
						txt.lineInfo = lineInfo;
						txt.x0 = tx;
						lineInfo.width = txt.x1 = tx+char.width*tscale;
						txt.y0 = ty - txt.size;
						txt.y1 = txt.y0 + char.height*tscale;
						tx += char.xadvance*tscale;
						this.num++;
						if (txt.underline){
							this.num++;
						}
					}
					
					line._textHeight = ty + lineInfo.maxFontSize;
					if(lineInfo && line._textWidth < lineInfo.width){
						line._textWidth = lineInfo.width;
					}
					for (j = startLineNum; j <= currentLineNum;j++ ){
						lineInfo = TextField.lineInfos[j];
						if (line.autoSize==TextFieldAutoSize.CENTER){
							lineInfo.offsetX = line._width / 2 - lineInfo.width / 2;
						}else if (line.autoSize==TextFieldAutoSize.RIGHT){
							lineInfo.offsetX = line._width - lineInfo.width;
						}else{
							lineInfo.offsetX = 0;
						}
					}
					//查找隐藏的txt
					if (line.autoSize == TextFieldAutoSize.NONE && line._textHeight > line._height){
						var offsetY:number = (line._height - line._textHeight) * line.scrollV;
						for (j = 0; j < tlen; j++ ){
							txt = cs[j];
							lineInfo = txt.lineInfo;
							if (txt.charVersion==this.charVersion){
								if ((txt.y0 + offsetY + lineInfo.maxFontSize) < 0 || (txt.y0 + offsetY + lineInfo.maxFontSize) > line._height){
									this.num--;
									if (txt.underline){
										this.num--;
									}
									txt.charVersion--;
								}
							}
						}
					}
				}
			}
		
			//构建vbuff ibuff

			var pow2num:number = this.getNextPow2(this.num);
			if (this.da==null){
				this.nowKey = pow2num;
				this.da = TextField.POP_POOL(pow2num);
			}else if(this.nowKey!=pow2num){
				TextField.PUSH_POOL(this.nowKey, this.da);
				this.da = TextField.POP_POOL(pow2num);
				this.nowKey = pow2num;
			}
			
			this.indexBufferSet= TextField.indexPool[pow2num];
			var needNew:boolean = this.indexBufferSet == null;
			if (needNew){
				this.indexBufferSet = TextField.indexPool[pow2num] = new GLIndexBufferSet(new Uint16Array(pow2num*6),WebGLRenderingContext.STATIC_DRAW);
				var indexd:Uint16Array = this.indexBufferSet.data;
				for (i = 0; i < pow2num;i++ ){
					indexd[i * 6]  = i * 4;
					indexd[i * 6+1]  =indexd[i * 6+3] =i * 4+2;
					indexd[i * 6+2] = indexd[i * 6+4] =i * 4+1;
					indexd[i * 6+5] = i * 4+3;
				}
			}
			this.da.pos.dirty = true;
			this.da.color.dirty = true;
			this.da.uv.dirty = true;
			var posd:Float32Array = (<Float32Array>this.da.pos.data );
			var colord:Uint32Array = (<Uint32Array>this.da.color.data );
			var uvd:Float32Array = (<Float32Array>this.da.uv.data );
			
			var k:number = 0;
			for (i = 0; i < clen;i++ ){
				line = this;
				var alpha:number = 1;// (line.a*0xff) << 24;
				cs = line.chars;
				if (cs && cs.length){
					tlen = cs.length;
					offsetY = (line._height - line._textHeight) * line.scrollV;
					if (offsetY>0){
						offsetY = 0;
					}
					for (j = 0; j < tlen; j++ ){
						txt = cs[j];
						if (txt.charVersion != this.charVersion){
							continue;
						}
						char = txt.texture;
						var maxFontSize:number = txt.lineInfo.maxFontSize + offsetY;
						var offsetX:number = txt.lineInfo.offsetX;
						
						posd[k * 8] = posd[k * 8 + 4] =txt.x0 + offsetX;
						posd[k * 8 + 1] = posd[k * 8 + 3] =txt.y0 + maxFontSize;
						posd[k * 8 + 2] =posd[k * 8 + 6] = txt.x1 + offsetX;
						posd[k * 8 + 5] =posd[k * 8 + 7] = txt.y1 + maxFontSize;
						

						uvd[k * 8] = uvd[k * 8 + 4] = char.u0;
						uvd[k * 8 + 1] = uvd[k * 8 + 3] = char.v0;
						uvd[k * 8 + 2] = uvd[k * 8 + 6] = char.u1;
						uvd[k * 8 + 5] = uvd[k * 8 + 7] = char.v1;
						
						/*var abgr:uint = alpha|txt.bgr;
						if (char.channel==0){
							var channel:uint = 
							0xffff00;
						}else{
							channel = 
							0xff0000ff;
						}*/
						
						/*fastmem.fastSetI32(abgr, k * 32);
						fastmem.fastSetI32(channel, k * 32+4);
						fastmem.fastSetI32(abgr, k * 32+8);
						fastmem.fastSetI32(channel, k * 32+12);
						fastmem.fastSetI32(abgr, k * 32+16);
						fastmem.fastSetI32(channel, k * 32+20);
						fastmem.fastSetI32(abgr, k * 32 + 24);
						fastmem.fastSetI32(channel, k * 32+28);*/
						
						/*colord.position = k * 32;
						colord.writeUnsignedInt(abgr);
						colord.writeUnsignedInt(channel);
						colord.writeUnsignedInt(abgr);
						colord.writeUnsignedInt(channel);
						colord.writeUnsignedInt(abgr);
						colord.writeUnsignedInt(channel);
						colord.writeUnsignedInt(abgr);
						colord.writeUnsignedInt(channel);*/
						var color:number = 0xff000000|txt.bgr;
						colord[k * 4] = color;
						colord[k * 4+1] = color;
						colord[k * 4+2] = color;
						colord[k * 4+3] = color;
						
						k++;
						
						/*if (txt.underline){//下划线
							posd[k * 12] = pout[0] + (txt.x0 +offsetX)*pout[3]+(txt.lineInfo.offsetY+maxFontSize) * pout[6];
							posd[k * 12 + 1] = pout[1] +(txt.x0+offsetX)* pout[4]+(txt.lineInfo.offsetY+maxFontSize) * pout[7];
							posd[k * 12 + 2] = pout[2] + (txt.x0+offsetX) * pout[5]+(txt.lineInfo.offsetY+maxFontSize) * pout[8];
							
							posd[k * 12 + 3] = pout[0] + (txt.x1+offsetX) * pout[3]+(txt.lineInfo.offsetY+maxFontSize) * pout[6];
							posd[k * 12 + 4] = pout[1] + (txt.x1+offsetX) * pout[4]+(txt.lineInfo.offsetY+maxFontSize) * pout[7];
							posd[k * 12 + 5] = pout[2] + (txt.x1+offsetX) * pout[5]+(txt.lineInfo.offsetY+maxFontSize) * pout[8];
							
							posd[k * 12 + 6] = pout[0]  + (txt.x1+offsetX) * pout[3]+(txt.lineInfo.offsetY+txt.underline+maxFontSize) * pout[6];
							posd[k * 12 + 7] = pout[1] + (txt.x1+offsetX) * pout[4]+(txt.lineInfo.offsetY+txt.underline+maxFontSize) * pout[7];
							posd[k * 12 + 8] = pout[2] + (txt.x1+offsetX) * pout[5]+(txt.lineInfo.offsetY+txt.underline+maxFontSize) * pout[8];
							
							posd[k * 12 + 9] = pout[0] + (txt.x0+offsetX) * pout[3]+(txt.lineInfo.offsetY+txt.underline+maxFontSize) * pout[6];
							posd[k * 12 + 10] = pout[1] + (txt.x0+offsetX) * pout[4]+(txt.lineInfo.offsetY+txt.underline+maxFontSize) * pout[7];
							posd[k * 12 + 11] = pout[2] + (txt.x0+offsetX) * pout[5]+(txt.lineInfo.offsetY+txt.underline+maxFontSize) * pout[8];
							
							uvd[k * 8] = uvd[k * 8 + 6] = 1-1/2048//char.u0;最后一像素为黑色
							uvd[k * 8 + 1] = uvd[k * 8 + 3] = 1//char.v0;
							uvd[k * 8 + 2] = uvd[k * 8 + 4] = 1-1/2048//char.u1;
							uvd[k * 8 + 5] = uvd[k * 8 + 7] = 1////char.v1;
							
							colord.position = k * 32;
							colord.writeUnsignedInt(abgr);
							colord.writeUnsignedInt(channel);
							colord.writeUnsignedInt(abgr);
							colord.writeUnsignedInt(channel);
							colord.writeUnsignedInt(abgr);
							colord.writeUnsignedInt(channel);
							colord.writeUnsignedInt(abgr);
							colord.writeUnsignedInt(channel);
							
							k++;
						}*/
					}
				}
			}
			this.glDirty = false;
		}
	}
	
	public __updateGL = (ctx:GLCanvasRenderingContext2D):void =>
	{
		if(this.chars&&this.chars.length>0){
			this.__updateBuff();
			//draw vbuff ibuff
			if(this.num>0){
				this.da.index = this.indexBufferSet;
				this.da.numTriangles = this.num * 2;
				ctx.renderImage(WebGLRenderer.textCharSet.image, this.da, this.transform.concatenatedMatrix, null, false, false, true);
			}
		}
	}
	
	public get textColor():number  { return Number(this._textFormat.color); }
	
	public set textColor(color:number)
	{
		this._textFormat.color = color;
		this.graphicsDirty = true;
		FlashPort.dirtyGraphics = true;
	}
	
	public get textHeight():number  {
		this.__updateBuff();
		if (this._textHeight !=-1){
			return this._textHeight;
		}
		var h:number = this.lines?Number(this.defaultTextFormat.size) * this.lines.length : 0;
		return h;
	}
	
	public get textWidth():number  {
		this.__updateBuff();
		if(this._textWidth!=-1){
			return this._textWidth;
		}
		if (this.stage && this.lines)
		{
			var ctx:CanvasRenderingContext2D = this.stage.ctx2d;
			ctx.font = this.defaultTextFormat.css;
			var w:number = 0;
			for (var i:number = 0; i < this.lines.length;i++ ){
				var w2:number = ctx.measureText(this.lines[i]).width;
				if (w2>w){
					w = w2;
				}
			}
			return w;
		}
		return 0; 
	}
	
	public get thickness():number  { return 0; }
	
	public set thickness(param1:number)  {/**/ }
	
	public get type():string  { return this._type; }
	
	public set type(param1:string)  {
		this._type = param1;
		if (this._type==TextFieldType.INPUT){
			if (this.input==null){
				this.input = (<HTMLInputElement>document.createElement("input") );
				this.input.oninput = this.input_change;
				this.input.style.position = "absolute";
				this.input.style.backgroundColor = "transparent";
				this.input.style.borderWidth = "0";
				this.input.style.outline = "none";
			}
		}
	}
	
	private input_change = (e:Event):void =>
	{
		this.text = this.input.value;
	}
	
	public get wordWrap():boolean  { return this._wordWrap; }
	
	public set wordWrap(param1:boolean)  {this._wordWrap = param1; }
	
	/*public function appendText(newText:string):void
	{
		this.replaceText(this.text.length, this.text.length, newText);
	}*/
	
	/*override*/ public get width():number 
	{
		return this.autoSize==TextFieldAutoSize.LEFT?(this.textWidth+4):this._width;
	}
	
	/*override*/ public set width(value:number) 
	{
		this._width = value;
	}
	
	/*override*/ public get height():number 
	{
		return this.autoSize==TextFieldAutoSize.LEFT?(this.textHeight+2):this._height;
	}
	
	/*override*/ public set height(value:number) 
	{
		this._height = value;
	}
	
	/*private function copyRichText() : String
		{
		return this.getXMLText(this.selectionBeginIndex,this.selectionEndIndex);
		}*/
		
	/*override*/ public getBounds = (v:DisplayObject):Rectangle =>
	{ 
		var bounds:Rectangle = new Rectangle(0, 0, this.textWidth, this.textHeight);
		if (this.border || this.background) bounds.inflate(4, 4);
		return bounds;
	}
	
	/*override*/ public getFullBounds = (v:DisplayObject):Rectangle =>
	{
		var bounds:Rectangle = new Rectangle(0, 0, this.textWidth, this.textHeight);
		if (this.border || this.background) bounds.inflate(3.5, 3);
		
		// adjust bounds for rotation
		var radians:number = this.rotation * (Math.PI / 180);
		var w:number = Math.round((bounds.height * Math.sin(radians) + bounds.width * Math.cos(radians)) * 10) / 10;
		var h:number = Math.round((bounds.height * Math.cos(radians) + bounds.width * Math.sin(radians)) * 10) / 10;
		
		// adjust rectangle bigger if needed
		w = (w > bounds.width) ? w - bounds.width : 0;
		h = (h > bounds.height) ? h - bounds.width : 0;
		bounds.inflate(w / 2, h / 2);
		
		this._fullBounds = bounds.clone();
		
		return bounds;
	}
	
	public getCharBoundaries = (param1:number):Rectangle => { return null; }
	
	public getCharIndexAtPoint = (param1:number, param2:number):number => { return 0; }
	
	private getCharIndexNearestPoint = (param1:number, param2:number):number => { return 0; }
	
	public getFirstCharInParagraph = (param1:number):number => { return 0; }
	
	public getLineIndexAtPoint = (param1:number, param2:number):number => { return 0; }
	
	public getLineIndexOfChar = (param1:number):number => { return 0; }
	
	public getLineLength = (param1:number):number => { return 0; }
	
	public getLineMetrics = (param1:number):TextLineMetrics => { return null; }
	
	public getLineOffset = (param1:number):number => { return 0; }
	
	public getLineText = (param1:number):string => { return null; }
	
	public getParagraphLength = (param1:number):number => { return 0; }
	
	public getTextFormat = (param1:number = -1, param2:number = -1):TextFormat => { return this._textFormat; }
	
	public getTextRuns = (param1:number = 0, param2:number = 2147483647):any[] => { return null; }
	
	public getRawText = ():string => { return null; }
	
	/*public function getXMLText(beginIndex:number = 0, endIndex:number = 2147483647) : String
		{
		var run:TextRun = null;
		var format:TextFormat = null;
		var text:string = null;
		var runXML:XML = null;
		var j:uint = 0;
		var name:string = null;
		var value:* = undefined;
		var runs:Array = this.getTextRuns(beginIndex,endIndex);
		var entireText:string = this.getRawText();
		var result:XML = <flashrichtext version="1"/>;
		for(var i:uint = 0; i < runs.length; i++)
		{
		run = runs[i];
		format = run.textFormat;
		text = entireText.substring(run.beginIndex,run.endIndex);
		text = "(" + text + ")";
		runXML = <textformat>{text}</textformat>;
		for(j = 0; j < richTextFields.length; j++)
		{
		name = richTextFields[j];
		value = format[name];
		if(value != null)
		{
		runXML["@" + name] = value;
		}
		}
		result.flashrichtext = result.flashrichtext + runXML;
		}
		return result.toXMLString();
		}
	
		public function insertXMLText(beginIndex:number, endIndex:number, richText:string, pasting:Boolean = false) : void
		{
		var run:XML = null;
		var temp:* = 0;
		var attributes:XMLList = null;
		var format:TextFormat = null;
		var attribute:XML = null;
		var text:string = null;
		var name:string = null;
		var value:string = null;
		var spaceAvail:* = 0;
		var richTextXML:XML = XML(richText);
		if(richTextXML.@version != "1")
		{
		Error.throwError(Error,2138);
		}
		if(beginIndex > endIndex)
		{
		temp = beginIndex;
		beginIndex = endIndex;
		endIndex = temp;
		}
		var first:Boolean = true;
		for each(run in richTextXML..textformat)
		{
		attributes = run.attributes();
		format = new TextFormat();
		for each(attribute in attributes)
		{
		name = attribute.name().localName;
		value = String(attribute);
		if(name == "bold" || name == "italic" || name == "underline")
		{
		format[name] = value == "true";
		}
		else
		{
		format[name] = value;
		}
		}
		text = String(run.children());
		text = text.substring(1,text.length - 1);
		if(this.maxChars > 0 && pasting == true)
		{
		spaceAvail = this.maxChars - this.length + (endIndex - beginIndex);
		if(spaceAvail < text.length)
		{
		if(spaceAvail <= 0)
		{
		return;
		}
		text = text.substring(0,spaceAvail);
		}
		}
		this.replaceText(beginIndex,endIndex,text);
		this.setTextFormat(format,beginIndex,beginIndex + text.length);
		beginIndex = beginIndex + text.length;
		endIndex = beginIndex;
		if(pasting)
		{
		this.setSelection(beginIndex,endIndex);
		}
		first = false;
		}
		if(first)
		{
		this.replaceText(beginIndex,endIndex,"");
		}
		}
	
		private function pasteRichText(richText:string) : Boolean
		{
		if(richText == null)
		{
		Error.throwError(TypeError,2007,"richText");
		}
		try
		{
		this.insertXMLText(this.selectionBeginIndex,this.selectionEndIndex,richText,true);
		}
		catch(e:Error)
		{
		return false;
		}
		return true;
		}*/
	
	public replaceSelectedText = (param1:string):void => {/**/ }
	
	public replaceText = (beginIndex:number, endIndex:number, newText:string):void => {
		this.text = this._text.substr(0, beginIndex) + newText + this._text.substr(endIndex);
	}
	
	public setSelection = (param1:number, param2:number):void => {/**/ }
	
	public setTextFormat = (param1:TextFormat, param2:number = -1, param3:number = -1):void => { this._textFormat = param1; }
	
	public getImageReference = (param1:string):DisplayObject => { return null; }
	
	public get useRichTextClipboard():boolean  { return false; }
	
	public set useRichTextClipboard(param1:boolean)  {/**/ }
	
	/*override*/ public set cacheAsBitmap(value:boolean) 
	{
		if (value && this._type != TextFieldType.INPUT)
		{
			if (!this._cacheImage) this._cacheImage = new BitmapData(1, 1);
			var bounds:Rectangle = this.getFullBounds(this);
			
			bounds.inflate(this._filterOffsetX, this._filterOffsetY); // add space for filter effects
			
			this._cacheCanvas = (<HTMLCanvasElement>document.createElement("canvas") );
			this._cacheCanvas.width = bounds.width;
			this._cacheCanvas.height = bounds.height;
			this._cacheCTX = (<CanvasRenderingContext2D>this._cacheCanvas.getContext('2d') );
			//_cacheCTX.fillStyle = "blue";
			//_cacheCTX.fillRect(0, 0, _cacheCanvas.width, _cacheCanvas.height);
			this._cacheOffsetX = bounds.width - bounds.right - this.x - 2;
			this._cacheOffsetY = bounds.height - bounds.bottom - this.y - 3;
			
			if (this.parent) 
			{
				this._cacheOffsetX -= this.parent.x;
				this._cacheOffsetY -= this.parent.y;
			}
			
			var mat:Matrix = this.transform.concatenatedMatrix.clone();
			mat.translate(this._cacheOffsetX, this._cacheOffsetY);
			
			this.__draw(this._cacheCTX, mat);
			
			this._cacheOffsetX = bounds.left + 2;
			this._cacheOffsetY = bounds.top + 3;
			
			
			this._cacheImage.image = this._cacheCanvas;
			this.updateTransforms();
			
			// cache after drawing all graphics
			this._cacheAsBitmap = value;
			
			this.graphicsDirty = true;
		}
		else
		{
			this._cacheCanvas = null;
			this._cacheCTX = null;
			this._cacheAsBitmap = false;
			this.graphicsDirty = true;
		}
	}
	
	public get cacheImage():BitmapData 
	{
		return this._cacheImage;
	}
	
	public get cacheOffsetX():number 
	{
		return this._cacheOffsetX;
	}
	
	public get cacheOffsetY():number 
	{
		return this._cacheOffsetY;
	}
	
	/*override*/ public __update = (ctx:CanvasRenderingContext2D, offsetX:number = 0, offsetY:number = 0, parentIsCached:boolean = false):void =>
	{
		if (!parentIsCached || (parentIsCached && !this._parentCached))
		{
			super.__update(ctx, offsetX, offsetY, parentIsCached);
			if (this._text != null && this.visible)
			{
				FlashPort.renderer.renderRichText(ctx, this, offsetX, offsetY);
				FlashPort.drawCounter++;
			}
		}
		
		this._parentCached = parentIsCached;
	}
	
	public __updateCanvas = (ctx:CanvasRenderingContext2D, offsetX:number = 0, offsetY:number = 0):void =>{
		if (!this._parentCached)
		{
			if (this.filters.length && !this.cacheAsBitmap && !this.parent.cacheAsBitmap) this.cacheAsBitmap = true;
				
			if (this.cacheAsBitmap && !this.parent.cacheAsBitmap && this._type != TextFieldType.INPUT)
			{
				FlashPort.renderer.renderImage(ctx, this._cacheImage, this.transform.concatenatedMatrix, this.blendMode, this.transform.concatenatedColorTransform, -this.x - this._cacheOffsetX, -this.y - this._cacheOffsetY);
			}
			else
			{
				var mat:Matrix = this.transform.concatenatedMatrix.clone();
				mat.tx += offsetX;
				mat.ty += offsetY;
				this.__draw(ctx, mat);
			}
		}
	}
	
	public __draw = (ctx:CanvasRenderingContext2D, m:Matrix):void =>
	{
		if ((this._border || this._background) && !this.cacheAsBitmap)
		{
			if (this.graphicsDirty)
			{
				this.graphicsDirty = false;
				this.graphics.clear();
				if (this.border) this.graphics.lineStyle(0, this.borderColor);
				if (this.background) this.graphics.beginFill(this.backgroundColor);
				this.graphics.drawRect( -2, 0, this.width + 4, this.height + 2);
			}
			FlashPort.renderer.renderGraphics(ctx, this.graphics, m, this.blendMode, this.transform.concatenatedColorTransform);
			this.ApplyFilters(ctx, this.graphics.lastFill != null, this.graphics.lastStroke != null);
		}
		
		if (this.type == TextFieldType.DYNAMIC)
		{
			if (!this._background) this.ApplyFilters(ctx, this.graphics.lastFill != null, this.graphics.lastStroke != null, true, true);  // shadows need to be applied before rendering text.
			for (var i:number = 0; i < this.lines.length; i++ ){
				//var textYpos:number = i * int(defaultTextFormat.size) * scaleY;
				var size:number = Number(this.defaultTextFormat.size);
				var textYpos:number = (i * size) * this.scaleY;
				var textXpos:number = (this.defaultTextFormat.align == "right") ? this.width / this.scaleX : (this.defaultTextFormat.align == "center" ?  (((this._width - this._textWidth) / 2) / this.scaleX) : 2);
				FlashPort.renderer.renderText(ctx, this.lines[i], this.defaultTextFormat, m, this.blendMode, this.transform.concatenatedColorTransform, textXpos, textYpos + 4);
			}
			if (!this._background) this.ApplyFilters(ctx, this.graphics.lastFill != null, this.graphics.lastStroke != null, true, false, true);
		}
		else
		{
			//var posX:number = m.tx + ((width - textWidth) / 2);
			this.input.style.left = m.tx +"px";
			this.input.style.top = m.ty + "px";
			this.input.style.width = this.width + "px";
			this.input.style.height = this.height + "px";
			this.input.style.fontFamily = this.defaultTextFormat.font;
			this.input.style.fontSize = this.defaultTextFormat.size+"px";
			this.input.style.color = this.defaultTextFormat.csscolor;
			this.input.addEventListener("mousedown", this.handleHTMLMouseDown)
			//input.style.textAlign = defaultTextFormat.align;
			if(this.input.value!=this.text)
			this.input.value = this.text;
			//input.style.transform = "matrix("+m.a+","+m.b+","+m.c+","+m.d+","+m.tx+","+m.ty+")";
			if(this.input.parentElement==null){
				this.stage.__htmlWrapper.appendChild(this.input);
			}
		}
	}
	
	private handleHTMLMouseDown = (e:Event):void =>
	{
		this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN));
		if (this.hasEventListener(FocusEvent.FOCUS_IN)) this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN));
	}
	
	/*override*/ protected __doMouse = (e:MouseEvent):DisplayObject =>
	{
		if (this.mouseEnabled && this.visible) {
			if (this.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) {
				if (e.type == MouseEvent.MOUSE_DOWN)
				{
					this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN));
				}
				return this;
			}
		}
		return null;
	}
	
	/*override*/ public hitTestPoint = (x:number, y:number, shapeFlag:boolean = false):boolean =>
	{
		
		var rect:Rectangle = this.__getRect();
		if (rect) return rect.containsPoint(this.globalToLocal(new Point(x,y)));
		return false;
	}
	
	/*override*/ public __getRect = ():Rectangle =>
	{
		if (this.text && this.text != "") {
			this.boundHelpRect.width = this.width;
			this.boundHelpRect.height = this.height;
			return this.boundHelpRect;
		}
		return null;
	}
	
	private getNextPow2 = (v:number):number =>
	{
		var r:number = 1;
		while (r < v) {
			r *= 2;
		}
		return r;
	}
	
	private parseFromString = (markup:string):HTMLDocument =>
	{
		return (new DOMParser().parseFromString(markup, "text/html") );
		// Firefox/Opera/IE throw errors on unsupported types
		/*try {
			// WebKit returns null on unsupported types
			if ((new DOMParser()).parseFromString("", "text/html")) {
				// text/html parsing is natively supported
				
			}
		} catch (ex) {}
		
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var
				doc = document.implementation.createHTMLDocument("")
			;
				if (markup.toLowerCase().indexOf('<!doctype') > -1) {
					doc.documentElement.innerHTML = markup;
				}
				else {
					doc.body.innerHTML = markup;
				}
			return doc;
		} else {
			return nativeParse.apply(this, arguments);
		}*/
	}
}