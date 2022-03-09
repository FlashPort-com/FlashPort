import { Error } from "../../Error.js";
export class IOError extends Error
{
   constructor(message:string = "", id:number = 0)
   {
      super(message,id);
   }
}