export class GraphicsPathCommand extends Object
{
   
   public static NO_OP:number = 0;
   
   public static MOVE_TO:number = 1;
   
   public static LINE_TO:number = 2;
   
   public static CURVE_TO:number = 3;
   
   public static WIDE_MOVE_TO:number = 4;
   
   public static WIDE_LINE_TO:number = 5;
   
   public static CUBIC_CURVE_TO:number = 6;
   
   public static ARC:number = 7;
   
   public static CLOSE_PATH:number = 8;
   public static DRAW_TRIANGLES:number = 9;
      
   constructor(){
      super();
   }
}