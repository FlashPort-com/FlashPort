import { Error } from "./Error.js";
export class ArgumentError extends Error
{
   public static len:number = 1;
   
   constructor(message:any = "", id:any = 0){
      super(message,id);
      this.name = "ArgumentError";
   }
}