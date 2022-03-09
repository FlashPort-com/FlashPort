import { TextFormat } from "./TextFormat.js";

   /*[ExcludeClass]*/
   export class TextRun extends Object
   {
       
      public beginIndex:number;
      
      public endIndex:number;
      
      public textFormat:TextFormat;
      
      constructor(beginIndex:number, endIndex:number, textFormat:TextFormat){
         super();
         this.beginIndex = beginIndex;
         this.endIndex = endIndex;
         this.textFormat = textFormat;
      }
   }

