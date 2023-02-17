import { TextFieldType } from "./TextFieldType";
import { TextFormat } from "./TextFormat";
import { TextFieldAutoSize } from "./TextFieldAutoSize";
import { FlashPort } from "../../FlashPort";
import { StyleSheet } from "./StyleSheet";
import { TextLineMetrics } from "./TextLineMetrics";
import { GLDrawable } from "../__native/GLDrawable";
import { GLIndexBufferSet } from "../__native/GLIndexBufferSet";
import { Char } from "../__native/te/Char";
import { LineInfo } from "../__native/te/LineInfo";
import { UVTexture } from "../__native/te/UVTexture";
import { BitmapData } from "../display/BitmapData";
import { BlendMode } from "../display/BlendMode";
import { Graphics } from "../display/Graphics";
import { Sprite } from "../display/Sprite";
import { AEvent } from "../events/AEvent";
import { MouseEvent } from "../events/MouseEvent";
import { FocusEvent } from "../events/FocusEvent";
import { Matrix } from "../geom/Matrix";
import { Rectangle } from "../geom/Rectangle";
import { DisplayObject } from "../display/DisplayObject";
import { Canvas, EmbindEnumEntity, Font, FontMgr, Paint, Paragraph, ParagraphBuilder, ParagraphStyle } from "canvaskit-wasm";
import { IRenderer } from "../__native/IRenderer";
import { ColorTransform } from "../geom";
import { BitmapFilter } from "../filters/BitmapFilter";
import { SkiaRenderer } from "../__native/SkiaRenderer";

export class TextField extends DisplayObject 
{
  private paragraph:Paragraph;
  private paraBuilder:ParagraphBuilder;
  private paraStyle:ParagraphStyle;
  private paraFontMgr:FontMgr;
  private font:Font;
  private textPaint:Paint;
  private input: HTMLInputElement;
  private _type: string = TextFieldType.DYNAMIC;
  private graphics: Graphics = new Graphics();
  private graphicsDirty: boolean = true;
  private glDirty: boolean = false;
  private _text: string = "";
  private lines: any[] = [];
  private _textFormat: TextFormat = new TextFormat();
  private _width: number = 100;
  private _height: number = 100;
  private _autoSize: string = TextFieldAutoSize.NONE;
  private _background: boolean = false;
  private _backgroundColor: number = 0xffffff;
  private _border: boolean = false;
  private _borderColor: number = 0x000000;
  private _cacheImage: BitmapData;
  private _cacheOffsetX: number = 0;
  private _cacheOffsetY: number = 0;

  //for webgl
  public chars: any[];
  private static indexPool: Object = {};
  private static DRAWABLE_POOL: Object = {};
  private da: GLDrawable;
  private indexBufferSet: GLIndexBufferSet;
  private nowKey: number = 0;
  private num: number = 0;
  private charVersion: number = 1;
  public disWrapper: Sprite;
  public _textWidth: number = -1;
  public _textHeight: number = -1;
  private _wordWrap: boolean = false;
  private static lineInfos: any[] = [];
  public hasATag: boolean = false;
  public tagas: any[] = [];
  private href: string;
  private _htmlText: string;

  constructor() {
    super();

    this.textPaint = new FlashPort.canvasKit.Paint();
    this.textPaint.setColor(FlashPort.canvasKit.Color(40, 0, 0, 1.0));
    this.textPaint.setAntiAlias(true);
    this.font = new FlashPort.canvasKit.Font(null, 12);
    
    this.textColor = 0x000000;
    this.addEventListener(AEvent.REMOVED_FROM_STAGE, this.removedFromStage);
  }

  private removedFromStage = (e: AEvent): void => {
    if (this.input && this.input.parentElement) {
      this.input.parentElement.removeChild(this.input);
    }
  };

  public static isFontCompatible = (
    param1: string,
    param2: string
  ): boolean => {
    return false;
  };

  public get alwaysShowSelection(): boolean {
    return false;
  }

  public set alwaysShowSelection(param1: boolean) {
    /**/
  }

  public get antiAliasType(): string {
    return null;
  }

  public set antiAliasType(param1: string) {
    /**/
  }

  public get autoSize(): string {
    return this._autoSize;
  }

  public set autoSize(param1: string) {
    this._autoSize = param1;
    this.graphicsDirty = true;
    FlashPort.dirtyGraphics = true;
  }

  public get background(): boolean {
    return this._background;
  }

  public set background(param1: boolean) {
    this._background = param1;
    this.graphicsDirty = true;
    FlashPort.dirtyGraphics = true;
  }

  public get backgroundColor(): number {
    return this._backgroundColor;
  }

  public set backgroundColor(param1: number) {
    this._backgroundColor = param1;
    this.graphicsDirty = true;
    FlashPort.dirtyGraphics = true;
  }

  public get border(): boolean {
    return this._border;
  }

  public set border(param1: boolean) {
    this._border = param1;
    this.graphicsDirty = true;
    FlashPort.dirtyGraphics = true;
  }

  public get borderColor(): number {
    return this._borderColor;
  }

  public set borderColor(param1: number) {
    this._borderColor = param1;
    this.graphicsDirty = true;
    FlashPort.dirtyGraphics = true;
  }

  public get bottomScrollV(): number {
    return 0;
  }

  public get caretIndex(): number {
    return 0;
  }

  public get condenseWhite(): boolean {
    return false;
  }

  public set condenseWhite(param1: boolean) {
    /**/
  }

  public get defaultTextFormat(): TextFormat {
    return this._textFormat;
  }

  public set defaultTextFormat(param1: TextFormat) {
    this._textFormat = param1;
    this.graphicsDirty = true;
    FlashPort.dirtyGraphics = true;
  }

  public get embedFonts(): boolean {
    return false;
  }

  public set embedFonts(param1: boolean) {
    /**/
  }

  public get gridFitType(): string {
    return null;
  }

  public set gridFitType(param1: string) {
    /**/
  }

  public get length(): number {
    return 0;
  }

  public get textInteractionMode(): string {
    return null;
  }

  public get maxChars(): number {
    return 0;
  }

  public set maxChars(param1: number) {
    /**/
  }

  public get maxScrollH(): number {
    return 0;
  }

  public get maxScrollV(): number {
    return 0;
  }

  public get mouseWheelEnabled(): boolean {
    return false;
  }

  public set mouseWheelEnabled(param1: boolean) {
    /**/
  }

  public get multiline(): boolean {
    return false;
  }

  public set multiline(param1: boolean) {
    /**/
  }

  public get numLines(): number {
    return 0;
  }

  public get displayAsPassword(): boolean {
    return false;
  }

  public set displayAsPassword(param1: boolean) {
    /**/
  }

  public get restrict(): string {
    return null;
  }

  public set restrict(param1: string) {
    /**/
  }

  public get scrollH(): number {
    return 0;
  }

  public set scrollH(param1: number) {
    /**/
  }

  public get scrollV(): number {
    return 0;
  }

  public set scrollV(param1: number) {
    /**/
  }

  public get selectable(): boolean {
    return false;
  }

  public set selectable(param1: boolean) {
    /**/
  }

  public get selectedText(): string {
    return this.text.substring(
      this.selectionBeginIndex,
      this.selectionEndIndex
    );
  }

  public get selectionBeginIndex(): number {
    return 0;
  }

  public get selectionEndIndex(): number {
    return 0;
  }

  public get sharpness(): number {
    return 0;
  }

  public set sharpness(param1: number) {
    /**/
  }

  public get styleSheet(): StyleSheet {
    return null;
  }

  public set styleSheet(param1: StyleSheet) {
    /**/
  }

  public get htmlText(): string {
    return null;
  }

  public set htmlText(value: string) {
    this.hasATag = false;
    this.glDirty = true;
    if (value != null) {
      this.tagas = [];
      //charsLength = 0;
      this._text = "";
      value = value
        .replace(/\\n/g, "<br/>")
        .replace(/\n/g, "<br/>")
        .replace(/<br>/g, "<br/>");
      this._htmlText = value;
      try {
        var xmllist: DOMParser = new DOMParser();
        var hd: Document = this.parseFromString(value);

        for (var i: number = 0; i < hd.body.childNodes.length; i++) {
          this.doXML(
            hd.body.childNodes[i] as Element,
            this._textFormat.font,
            Number(this._textFormat.size),
            Number(this._textFormat.color),
            null,
            Number(this._textFormat.indent),
            Number(this._textFormat.underline)
          );
        }

        //for e(var xml:XML in xmllist){
        //doXML(xml, _defFont, _defSize, _defColor,null,_indent,_defUnderline);
        //}
      } catch (err) {
        this.text = value;
      }
    }
  }

  private doXML = (
    xml: Element,
    font: string,
    size: number,
    color: number,
    href: string,
    indent: number,
    underline: number
  ): void => {
    this.href = href;
    if (xml == null) {
      return;
    }
    var l: string = xml.localName;
    if (l === "br") {
      var txt: string = "\n";
    } else if (xml.nodeType === 3) {
      txt = xml.nodeValue.replace(/&nbsp;/g, " ");
      txt = txt.replace(/ﾠ/g, " ");
    }
    if (xml.attributes) {
      if (l === "font") {
        if (xml.attributes.getNamedItem("face")) {
          font = xml.attributes.getNamedItem("face").nodeValue;
        }
        if (xml.attributes.getNamedItem("size")) {
          size = Number(xml.attributes.getNamedItem("size").nodeValue);
        }
        if (xml.attributes.getNamedItem("color")) {
          color = parseInt(
            xml.attributes.getNamedItem("color").nodeValue.replace("#", ""),
            16
          );
        }
      } else if (l === "a") {
        if (xml.attributes.getNamedItem("href")) {
          this.hasATag = true;
          href = xml.attributes.getNamedItem("href").nodeValue;
          this.href = href;
        }
      } else if (l === "img") {
        if (xml.attributes.getNamedItem("src")) {
          var imgsrc: string = xml.attributes.getNamedItem("src").nodeValue;
          if (xml.attributes.getNamedItem("width")) {
            var imgwidth: number = parseFloat(
              xml.attributes.getNamedItem("width").nodeValue
            );
          }
        }
      } else if (l === "textformat") {
        if (xml.attributes.getNamedItem("indent")) {
          indent = Number(xml.attributes.getNamedItem("@indent").nodeValue);
        }
      }
    }
    if (l === "u") {
      underline = 1;
    }
    this._textFormat.font = font ? font.toLowerCase() : font;
    this._textFormat.size = size;
    this._textFormat.color = color;
    this._textFormat.indent = indent;
    this._textFormat.underline = underline;

    /*if (imgsrc){
			appendImg(id2img[imgsrc],imgwidth);
		}*/

    if (txt && txt.length > 0) {
      this.appendText(txt);
    }

    if (xml.childNodes) {
      for (var i: number = 0; i < xml.childNodes.length; i++) {
        this.doXML(
          xml.childNodes[i] as Element,
          font,
          size,
          color,
          href,
          indent,
          underline
        );
      }
    }
  };

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    if (value === null) {
      value = "";
    }
    if (this._text === value) {
      return;
    }
    this.hasATag = false;
    this.chars = null;
    this.lines = null;
    this._text = null;
    this.appendText(value);
  }

  public appendText = (value: string): void => {
    FlashPort.dirtyGraphics = true;
    this.graphicsDirty = true;

    if (this._text != null) {
      this._text += value;
    } else {
      this._text = value;
    }

    this.lines = this.lines || [];
    this.lines = this.lines.concat(value.split("\n"));
  };

  private static PUSH_POOL = (key: number, da: GLDrawable): void => {
    var arr: any[] = TextField.DRAWABLE_POOL[key];
    if (arr == null) {
      arr = TextField.DRAWABLE_POOL[key] = [];
    }
    arr.push(da);
  };

  private static POP_POOL = (pow2num: number): GLDrawable => {
    var arr: any[] = TextField.DRAWABLE_POOL[pow2num];
    if (arr == null) {
      arr = TextField.DRAWABLE_POOL[pow2num] = [];
    }
    if (arr.length == 0) {
      var da: GLDrawable = new GLDrawable(
        new Float32Array(pow2num * 8),
        new Float32Array(pow2num * 8),
        null,
        WebGLRenderingContext.DYNAMIC_DRAW
      );
      return da;
    }
    return arr.pop();
  };

  private __updateBuff = (): void => {
    if (this.glDirty && this.chars && this.chars.length > 0) {
      var currentLineNum: number = -1;
      this.num = 0;
      this.charVersion++;

      var clen: number = 1;
      for (var i: number = 0; i < clen; i++) {
        var line: TextField = this;

        if (line.disWrapper) {
          while (line.disWrapper.numChildren > 0) {
            line.disWrapper.removeChildAt(0);
          }
        }

        line._textWidth = 0;
        //line.textMatrixVer = line.worldVersion;
        var startLineNum: number = currentLineNum + 1;
        var cs: any[] = line.chars;
        if (cs && line.chars.length) {
          currentLineNum++;
          var lineInfo: LineInfo = (TextField.lineInfos[currentLineNum] =
            TextField.lineInfos[currentLineNum] || new LineInfo());
          lineInfo.maxFontSize = 0;
          var tx: number = 2;
          var ty: number = 2;
          lineInfo.offsetY = ty;
          var tlen: number = line.chars.length;
          for (var j: number = 0; j < tlen; j++) {
            var txt: Char = cs[j];
            txt.lineInfo = lineInfo;
            var char: UVTexture = txt.texture;
            if (char.u0 == -1) {
              return;
            }
            var tscale: number = txt.size / char.fontSize;
            if (txt.v == "\n") {
              tx = 2;
              ty += lineInfo.maxFontSize + txt.leading;
              currentLineNum++;
              if (lineInfo && line._textWidth < lineInfo.width) {
                line._textWidth = lineInfo.width;
              }
              lineInfo = TextField.lineInfos[currentLineNum] =
                TextField.lineInfos[currentLineNum] || new LineInfo();
              lineInfo.maxFontSize = 0;
              lineInfo.width = 0;
              lineInfo.offsetY = ty;
              continue;
            } else if (txt.v == "") {
              console.log("TextField img");
            }

            if (line.wordWrap) {
              if (tx + char.width * tscale > line._width) {
                tx = 2;
                ty += lineInfo.maxFontSize + txt.leading;
                currentLineNum++;
                if (lineInfo && line._textWidth < lineInfo.width) {
                  line._textWidth = lineInfo.width;
                }
                lineInfo = TextField.lineInfos[currentLineNum] =
                  TextField.lineInfos[currentLineNum] || new LineInfo();
                lineInfo.maxFontSize = 0;
                lineInfo.width = 0;
                lineInfo.offsetY = ty;
              }
            } else {
              if (line.autoSize == TextFieldAutoSize.NONE) {
                if (tx + char.width * tscale > line._width) {
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
            lineInfo.width = txt.x1 = tx + char.width * tscale;
            txt.y0 = ty - txt.size;
            txt.y1 = txt.y0 + char.height * tscale;
            tx += char.xadvance * tscale;
            this.num++;
            if (txt.underline) {
              this.num++;
            }
          }

          line._textHeight = ty + lineInfo.maxFontSize;
          if (lineInfo && line._textWidth < lineInfo.width) {
            line._textWidth = lineInfo.width;
          }
          for (j = startLineNum; j <= currentLineNum; j++) {
            lineInfo = TextField.lineInfos[j];
            if (line.autoSize == TextFieldAutoSize.CENTER) {
              lineInfo.offsetX = line._width / 2 - lineInfo.width / 2;
            } else if (line.autoSize == TextFieldAutoSize.RIGHT) {
              lineInfo.offsetX = line._width - lineInfo.width;
            } else {
              lineInfo.offsetX = 0;
            }
          }

          if (
            line.autoSize == TextFieldAutoSize.NONE &&
            line._textHeight > line._height
          ) {
            var offsetY: number =
              (line._height - line._textHeight) * line.scrollV;
            for (j = 0; j < tlen; j++) {
              txt = cs[j];
              lineInfo = txt.lineInfo;
              if (txt.charVersion == this.charVersion) {
                if (
                  txt.y0 + offsetY + lineInfo.maxFontSize < 0 ||
                  txt.y0 + offsetY + lineInfo.maxFontSize > line._height
                ) {
                  this.num--;
                  if (txt.underline) {
                    this.num--;
                  }
                  txt.charVersion--;
                }
              }
            }
          }
        }
      }

      var pow2num: number = this.getNextPow2(this.num);
      if (this.da == null) {
        this.nowKey = pow2num;
        this.da = TextField.POP_POOL(pow2num);
      } else if (this.nowKey != pow2num) {
        TextField.PUSH_POOL(this.nowKey, this.da);
        this.da = TextField.POP_POOL(pow2num);
        this.nowKey = pow2num;
      }

      this.indexBufferSet = TextField.indexPool[pow2num];
      var needNew: boolean = this.indexBufferSet == null;
      if (needNew) {
        this.indexBufferSet = TextField.indexPool[pow2num] =
          new GLIndexBufferSet(
            new Uint16Array(pow2num * 6),
            WebGLRenderingContext.STATIC_DRAW
          );
        var indexd: Uint16Array = this.indexBufferSet.data;
        for (i = 0; i < pow2num; i++) {
          indexd[i * 6] = i * 4;
          indexd[i * 6 + 1] = indexd[i * 6 + 3] = i * 4 + 2;
          indexd[i * 6 + 2] = indexd[i * 6 + 4] = i * 4 + 1;
          indexd[i * 6 + 5] = i * 4 + 3;
        }
      }
      this.da.pos.dirty = true;
      this.da.color.dirty = true;
      this.da.uv.dirty = true;
      var posd: Float32Array = <Float32Array>this.da.pos.data;
      var colord: Uint32Array = <Uint32Array>this.da.color.data;
      var uvd: Float32Array = <Float32Array>this.da.uv.data;

      var k: number = 0;
      for (i = 0; i < clen; i++) {
        line = this;
        var alpha: number = 1; // (line.a*0xff) << 24;
        cs = line.chars;
        if (cs && cs.length) {
          tlen = cs.length;
          offsetY = (line._height - line._textHeight) * line.scrollV;
          if (offsetY > 0) {
            offsetY = 0;
          }
          for (j = 0; j < tlen; j++) {
            txt = cs[j];
            if (txt.charVersion != this.charVersion) {
              continue;
            }
            char = txt.texture;
            var maxFontSize: number = txt.lineInfo.maxFontSize + offsetY;
            var offsetX: number = txt.lineInfo.offsetX;

            posd[k * 8] = posd[k * 8 + 4] = txt.x0 + offsetX;
            posd[k * 8 + 1] = posd[k * 8 + 3] = txt.y0 + maxFontSize;
            posd[k * 8 + 2] = posd[k * 8 + 6] = txt.x1 + offsetX;
            posd[k * 8 + 5] = posd[k * 8 + 7] = txt.y1 + maxFontSize;

            uvd[k * 8] = uvd[k * 8 + 4] = char.u0;
            uvd[k * 8 + 1] = uvd[k * 8 + 3] = char.v0;
            uvd[k * 8 + 2] = uvd[k * 8 + 6] = char.u1;
            uvd[k * 8 + 5] = uvd[k * 8 + 7] = char.v1;

            var color: number = 0xff000000 | txt.bgr;
            colord[k * 4] = color;
            colord[k * 4 + 1] = color;
            colord[k * 4 + 2] = color;
            colord[k * 4 + 3] = color;

            k++;
          }
        }
      }
      this.glDirty = false;
    }
  };

  public get textColor(): number {
    return Number(this._textFormat.color);
  }

  public set textColor(color: number) {
    this._textFormat.color = color;
    this.graphicsDirty = true;
    FlashPort.dirtyGraphics = true;
  }

  public get textHeight(): number {
    this.__updateBuff();
    if (this._textHeight != -1) {
      return this._textHeight;
    }
    var h: number = this.lines
      ? Number(this.defaultTextFormat.size) * this.lines.length
      : 0;
    return h;
  }

  public get textWidth(): number {
    this.__updateBuff();
    if (this._textWidth != -1) {
      return this._textWidth;
    }
    if (this.stage && this.lines) {
      var ctx: CanvasRenderingContext2D = this.stage.ctx2d;
      ctx.font = this.defaultTextFormat.css;
      var w: number = 0;
      for (var i: number = 0; i < this.lines.length; i++) {
        var w2: number = ctx.measureText(this.lines[i]).width;
        if (w2 > w) {
          w = w2;
        }
      }
      return w;
    }
    return 0;
  }

  public get thickness(): number {
    return 0;
  }

  public set thickness(param1: number) {
    /**/
  }

  public get type(): string {
    return this._type;
  }

  public set type(param1: string) {
    this._type = param1;
    if (this._type == TextFieldType.INPUT) {
      if (this.input == null) {
        this.input = <HTMLInputElement>document.createElement("input");
        this.input.oninput = this.input_change;
        this.input.style.position = "absolute";
        this.input.style.backgroundColor = "transparent";
        this.input.style.borderWidth = "0";
        this.input.style.outline = "none";
      }
    }
  }

  private input_change = (e: Event): void => {
    this.text = this.input.value;
  };

  public get wordWrap(): boolean {
    return this._wordWrap;
  }

  public set wordWrap(param1: boolean) {
    this._wordWrap = param1;
  }

  /*public function appendText(newText:string):void
	{
		this.replaceText(this.text.length, this.text.length, newText);
	}*/

  /*override*/ public get width(): number {
    return this.autoSize == TextFieldAutoSize.LEFT
      ? this.textWidth + 4
      : this._width;
  }

  /*override*/ public set width(value: number) {
    this._width = value;
  }

  /*override*/ public get height(): number {
    return this.autoSize == TextFieldAutoSize.LEFT
      ? this.textHeight + 2
      : this._height;
  }

  /*override*/ public set height(value: number) {
    this._height = value;
  }

  /*override*/ public getBounds = (v: DisplayObject): Rectangle => {
    var bounds: Rectangle = new Rectangle(
      0,
      0,
      this.textWidth,
      this.textHeight
    );
    if (this.border || this.background) bounds.inflate(4, 4);
    return bounds;
  };

  /*override*/ public getFullBounds = (v: DisplayObject): Rectangle => {
    var bounds: Rectangle = new Rectangle(
      0,
      0,
      this.textWidth,
      this.textHeight
    );
    if (this.border || this.background) bounds.inflate(3.5, 3);

    // adjust bounds for rotation
    var radians: number = this.rotation * (Math.PI / 180);
    var w: number =
      Math.round(
        (bounds.height * Math.sin(radians) + bounds.width * Math.cos(radians)) *
          10
      ) / 10;
    var h: number =
      Math.round(
        (bounds.height * Math.cos(radians) + bounds.width * Math.sin(radians)) *
          10
      ) / 10;

    // adjust rectangle bigger if needed
    w = w > bounds.width ? w - bounds.width : 0;
    h = h > bounds.height ? h - bounds.width : 0;
    bounds.inflate(w / 2, h / 2);

    return bounds;
  };

  public getCharBoundaries = (param1: number): Rectangle => {
    return null;
  };

  public getCharIndexAtPoint = (param1: number, param2: number): number => {
    return 0;
  };

  private getCharIndexNearestPoint = (
    param1: number,
    param2: number
  ): number => {
    return 0;
  };

  public getFirstCharInParagraph = (param1: number): number => {
    return 0;
  };

  public getLineIndexAtPoint = (param1: number, param2: number): number => {
    return 0;
  };

  public getLineIndexOfChar = (param1: number): number => {
    return 0;
  };

  public getLineLength = (param1: number): number => {
    return 0;
  };

  public getLineMetrics = (param1: number): TextLineMetrics => {
    return null;
  };

  public getLineOffset = (param1: number): number => {
    return 0;
  };

  public getLineText = (param1: number): string => {
    return null;
  };

  public getParagraphLength = (param1: number): number => {
    return 0;
  };

  public getTextFormat = (
    param1: number = -1,
    param2: number = -1
  ): TextFormat => {
    return this._textFormat;
  };

  public getTextRuns = (
    param1: number = 0,
    param2: number = 2147483647
  ): any[] => {
    return null;
  };

  public getRawText = (): string => {
    return null;
  };

  public replaceSelectedText = (param1: string): void => {
    /**/
  };

  public replaceText = (
    beginIndex: number,
    endIndex: number,
    newText: string
  ): void => {
    this.text =
      this._text.substr(0, beginIndex) + newText + this._text.substr(endIndex);
  };

  public setSelection = (param1: number, param2: number): void => {
    /**/
  };

  public setTextFormat = (
    param1: TextFormat,
    param2: number = -1,
    param3: number = -1
  ): void => {
    this._textFormat = param1;
  };

  public getImageReference = (param1: string): DisplayObject => {
    return null;
  };

  public get useRichTextClipboard(): boolean {
    return false;
  }

  public set useRichTextClipboard(param1: boolean) {
    /**/
  }

  /*override*/
  public __update = (ctx: Canvas, offsetX: number = 0, offsetY: number = 0, filters: BitmapFilter[] = []): void => 
  {
    super.__update(ctx, offsetX, offsetY, filters);

    if (this._text != null && this.visible)
    {
      this.__draw(ctx, this.transform.concatenatedMatrix, filters);

      if (this.paragraph)
      {
        (FlashPort.renderer as SkiaRenderer).renderParagraph(ctx, this.paragraph, this.transform.concatenatedMatrix);
      }

      FlashPort.drawCounter++;
    }

  };

  public __draw = (ctx: Canvas, m: Matrix, filters:BitmapFilter[]): void => 
  {
    if (this._border || this._background) 
    {
      this.graphics.clear();
      if (this.border) this.graphics.lineStyle(0, this.borderColor);
      if (this.background) this.graphics.beginFill(this.backgroundColor);
      this.graphics.drawRect(-2, 0, this.width + 4, this.height + 2);
      var filts:BitmapFilter[] = this.filters.concat(filters);
      FlashPort.renderer.renderGraphics(ctx, this.graphics.graphicsData, m, this.blendMode, this.transform.concatenatedColorTransform, filts);
    }

    if (this.graphicsDirty)
    {
      if (this.type == TextFieldType.DYNAMIC)
      {
        //if (!this._background) this.ApplyFilters(ctx);
        
        let color = (FlashPort.renderer as IRenderer).getRGBAColor(this._textFormat.color, this.alpha, this.transform.colorTransform);
        let alignment:EmbindEnumEntity = this._textFormat.align == "left" ? FlashPort.canvasKit.TextAlign.Left : (this._textFormat.align == "right" ? FlashPort.canvasKit.TextAlign.Right : FlashPort.canvasKit.TextAlign.Center);
        
        this.paraStyle = new FlashPort.canvasKit.ParagraphStyle(
          {
            textStyle: {
              color: color,
              fontFamilies:[this._textFormat.font],
              fontSize: this._textFormat.size,
              fontStyle: {
                weight: this._textFormat.bold ? FlashPort.canvasKit.FontWeight.Bold : FlashPort.canvasKit.FontWeight.Normal,
                slant: this._textFormat.italic ? FlashPort.canvasKit.FontSlant.Italic : FlashPort.canvasKit.FontSlant.Upright
              }
            },
            textAlign: alignment
          }
        );
        
        if (this.paragraph) this.paragraph.delete();
        
        this.paraFontMgr = FlashPort.canvasKit.FontMgr.FromData(FlashPort.fonts[this._textFormat.font]);
        this.paraBuilder = FlashPort.canvasKit.ParagraphBuilder.Make(this.paraStyle, this.paraFontMgr);
        this.paraBuilder.addText(this._text);
        this.paragraph = this.paraBuilder.build();
        this.paragraph.layout(this._textFormat.size * this._text.length);

        this.paraFontMgr.delete();
        this.paraBuilder.delete();
        

        //if (!this._background) this.ApplyFilters(ctx);
      } 
      else 
      {
        this.input.style.left = m.tx + "px";
        this.input.style.top = m.ty + "px";
        this.input.style.width = this.width + "px";
        this.input.style.height = this.height + "px";
        this.input.style.fontFamily = this.defaultTextFormat.font;
        this.input.style.fontSize = this.defaultTextFormat.size + "px";
        this.input.style.color = this.defaultTextFormat.csscolor;
        this.input.addEventListener("mousedown", this.handleHTMLMouseDown);
        //input.style.textAlign = defaultTextFormat.align;
        if (this.input.value != this.text) this.input.value = this.text;
      }
    }

    if (this.type == TextFieldType.INPUT)
    {
      if (this.input.parentElement == null) {
        this.stage.__htmlWrapper.appendChild(this.input);
      }
    }

    this.graphicsDirty = false;
  };

  private handleHTMLMouseDown = (e: Event): void => {
    this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN));
    if (this.hasEventListener(FocusEvent.FOCUS_IN))
      this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN));
  };

  /*override*/ protected __doMouse = (e: MouseEvent): DisplayObject => {
    if (this.mouseEnabled && this.visible) {
      if (this.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) {
        if (e.type == MouseEvent.MOUSE_DOWN) {
          this.dispatchEvent(new FocusEvent(FocusEvent.FOCUS_IN));
        }
        return this;
      }
    }
    return null;
  };

  /*override*/ public hitTestPoint = (
    x: number,
    y: number,
    shapeFlag: boolean = false
  ): boolean => {
    //var rect:Rectangle = this.getRect(this);
    //if (rect) return rect.containsPoint(this.globalToLocal(new Point(x,y)));
    return false;
  };

  private getNextPow2 = (v: number): number => {
    var r: number = 1;
    while (r < v) {
      r *= 2;
    }
    return r;
  };

  private parseFromString = (markup: string): HTMLDocument => {
    return new DOMParser().parseFromString(markup, "text/html");
  };
}
