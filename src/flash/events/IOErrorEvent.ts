import { ErrorEvent } from "./ErrorEvent";
import { AEvent } from "./AEvent";

export class IOErrorEvent extends ErrorEvent
{
   
   public static IO_ERROR:string = "ioError";
   
   /*[Inspectable(environment="none")]*/
   public static NETWORK_ERROR:string = "networkError";
   
   /*[Inspectable(environment="none")]*/
   public static DISK_ERROR:string = "diskError";
   
   /*[Inspectable(environment="none")]*/
   public static VERIFY_ERROR:string = "verifyError";
      
   constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, text:string = "", id:number = 0){
      super(type,bubbles,cancelable,text,id);
   }
   
   /*override*/ public clone() : AEvent
   {
      return new IOErrorEvent(this.type,this.bubbles,this.cancelable,this.text,this.errorID);
   }
   
   /*override*/ public toString() : string
   {
      return this.formatToString("IOErrorEvent","type","bubbles","cancelable","eventPhase","text");
   }
}