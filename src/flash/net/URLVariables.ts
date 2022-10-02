import { Error } from "../../Error";

export class URLVariables extends Object
{
   constructor(source:string = null)
   {
      super();
      if(source != null)
      {
         this.decode(source);
      }
   }
   
   public decode(source:string) : void
   {
      var param:string = null;
      var equalsIndex:any = 0;
      var name:string = null;
      var value:string = null;
      var oldValue:any = undefined;
      var params:any[] = source.split("&");
      for(var i:number = 0; i < params.length; i++)
      {
         param = params[i];
         equalsIndex = param.indexOf("=");
         if(equalsIndex == -1)
         {
            Error.throwError(Error,2101);
         }
         else
         {
            name = unescape(param.substr(0,equalsIndex));
            value = unescape(param.substr(equalsIndex + 1));
            oldValue = this[name];
            if(oldValue != undefined)
            {
               if(!(oldValue instanceof Array))
               {
                  this[name] = oldValue = [oldValue];
               }
               oldValue.push(value);
            }
            else
            {
               this[name] = value;
            }
         }
      }
   }
   
   /*public function toString() : String
   {
      var name:string = null;
      var escapedName:string = null;
      var value:* = undefined;
      var i:uint = 0;
      var s:string = "";
      var first:Boolean = true;
      for(name in this)
      {
         escapedName = escapeMultiByte(name);
         value = this[name];
         if(value is Array)
         {
            for(i = 0; i < value.length; i++)
            {
               if(!first)
               {
                  s = s + "&";
               }
               s = s + escapedName;
               s = s + "=";
               s = s + escapeMultiByte(String(value[i]));
               first = false;
            }
         }
         else
         {
            if(!first)
            {
               s = s + "&";
            }
            s = s + escapedName;
            s = s + "=";
            s = s + escapeMultiByte(String(value));
            first = false;
         }
      }
      return s;
   }
   
   private function _unescape(value:string) : String
   {
      return unescapeMultiByte(value.replace(new RegExp("\\+","g")," "));
   }*/
}