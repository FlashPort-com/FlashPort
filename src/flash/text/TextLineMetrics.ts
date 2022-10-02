
   export class TextLineMetrics extends Object
   {
       
      public x:number;
      
      public width:number;
      
      public height:number;
      
      public ascent:number;
      
      public descent:number;
      
      public leading:number;
      
      constructor(x:number, width:number, height:number, ascent:number, descent:number, leading:number){
         super();
         this.x = x;
         this.width = width;
         this.height = height;
         this.ascent = ascent;
         this.descent = descent;
         this.leading = leading;
      }
   }

