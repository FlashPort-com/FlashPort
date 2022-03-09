import { ErrorEvent } from "./ErrorEvent.js";
import { AEvent } from "./AEvent.js";

export class SecurityErrorEvent extends ErrorEvent
{
   
   public static SECURITY_ERROR:string = "securityError";
      
   constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, text:string = "", id:number = 0){
      super(type,bubbles,cancelable,text,id);
   }
   
   /*override*/ public clone() : AEvent
   {
      return new SecurityErrorEvent(this.type,this.bubbles,this.cancelable,this.text,this.errorID);
   }
   
   /*override*/ public toString() : string
   {
      return this.formatToString("SecurityErrorEvent","type","bubbles","cancelable","eventPhase","text");
   }
}