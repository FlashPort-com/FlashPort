
   export class CSMSettings extends Object
   {
       
      public fontSize:number;
      
      public insideCutoff:number;
      
      public outsideCutoff:number;
      
      constructor(fontSize:number, insideCutoff:number, outsideCutoff:number){
         super();
         this.fontSize = fontSize;
         this.insideCutoff = insideCutoff;
         this.outsideCutoff = outsideCutoff;
      }
   }

