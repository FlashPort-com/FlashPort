import { Error } from "../../Error.js";
export class IllegalOperationError extends Error
{  
   constructor(message:string = "", id:number = 0)
   {
      super(message,id);
   }
}