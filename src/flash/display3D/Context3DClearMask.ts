export class Context3DClearMask extends Object
{
   
   public static COLOR:number = 1 << 0;
   
   public static DEPTH:number = 1 << 1;
   
   public static STENCIL:number = 1 << 2;
   
   public static ALL:number = Context3DClearMask.COLOR | Context3DClearMask.DEPTH | Context3DClearMask.STENCIL;
      
   constructor()
   {
      super();
   }
}