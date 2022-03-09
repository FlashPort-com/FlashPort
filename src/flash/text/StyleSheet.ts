import { TextFormat } from "./TextFormat.js";

   import { EventDispatcher } from "../events/EventDispatcher.js";
   
   export class StyleSheet extends EventDispatcher
   {
       
      private _css:Object;
      
      constructor(){
         super();
         this._css = {};
         this._styles = {};
      }
      
      public getStyle(styleName:string) : Object
      {
         return this._copy(this._css[styleName.toLowerCase()]);
      }
      
      public setStyle(styleName:string, styleObject:Object) : void
      {
         var lowerStr:string = styleName.toLowerCase();
         this._css[lowerStr] = this._copy(styleObject);
         this.doTransform(lowerStr);
         this._update();
      }
      
      public clear() : void
      {
         this._css = {};
         this._styles = {};
         this._update();
      }
      
      public get styleNames() : any[]
      {
         var n:Object = null;
         var a:any[] = [];
         for(n in this._css)
         {
            a.push(n);
         }
         return a;
      }
      
      public transform(formatObject:any) : TextFormat
      {
         if(formatObject == null)
         {
            return null;
         }
         var f:TextFormat = new TextFormat();
         var v:any = formatObject.textAlign;
         if(v)
         {
            f.align = v;
         }
         v = formatObject.fontSize;
         if(v)
         {
            v = parseInt(v,10);
            if(v > 0)
            {
               f.size = v;
            }
         }
         v = formatObject.textDecoration;
         if(v == "none")
         {
            f.underline = false;
         }
         else if(v == "underline")
         {
            f.underline = true;
         }
         v = formatObject.marginLeft;
         if(v)
         {
            f.leftMargin = parseInt(v,10);
         }
         v = formatObject.marginRight;
         if(v)
         {
            f.rightMargin = parseInt(v,10);
         }
         v = formatObject.leading;
         if(v)
         {
            f.leading = parseInt(v,10);
         }
         v = formatObject.kerning;
         if(v == "true")
         {
            f.kerning = 1;
         }
         else if(v == "false")
         {
            f.kerning = 0;
         }
         else
         {
            f.kerning = parseInt(v,10);
         }
         v = formatObject.letterSpacing;
         if(v)
         {
            f.letterSpacing = parseFloat(v);
         }
         v = formatObject.fontFamily;
         if(v)
         {
            f.font = this._parseCSSFontFamily(v);
         }
         v = formatObject.display;
         if(v)
         {
            f.display = v;
         }
         v = formatObject.fontWeight;
         if(v == "bold")
         {
            f.bold = true;
         }
         else if(v == "normal")
         {
            f.bold = false;
         }
         v = formatObject.fontStyle;
         if(v == "italic")
         {
            f.italic = true;
         }
         else if(v == "normal")
         {
            f.italic = false;
         }
         v = formatObject.textIndent;
         if(v)
         {
            f.indent = parseInt(v,10);
         }
         v = formatObject.color;
         if(v)
         {
            v = this._parseColor(v);
            if(v != null)
            {
               f.color = v;
            }
         }
         return f;
      }
      
      public parseCSS(CSSText:string) : void
      {
         var n:string = null;
         var r:Object = this._parseCSSInternal(CSSText);
         if(r == null)
         {
            return;
         }
         
         for(n in r)
         {
            this._css[n] = this._copy(r[n]);
            this.doTransform(n);
         }
         this._update();
      }
      
       private get _styles() : Object{return null}
      
       private set _styles(param1:Object){/**/}
      
      private doTransform(n:string) : void
      {
         var f:TextFormat = this.transform(this._css[n]);
         this._styles[n] = f;
      }
      
      private _copy(o:Object) : Object
      {
         if(typeof o != "object")
         {
            return null;
         }
         var r:Object = {};
         for(var n in o)
         {
            r[n] = o[n];
         }
         return r;
      }
      
       private _update() : void{/**/}
      
       private _parseCSSInternal(param1:string) : Object{return null}
      
       private _parseCSSFontFamily(param1:string) : string{return null}
      
       private _parseColor(param1:string) : number{return 0;}
   }

