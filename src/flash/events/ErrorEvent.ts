import { TextEvent } from "./TextEvent";
import { AEvent } from "./AEvent";
export class ErrorEvent extends TextEvent
{
   public static ERROR:string = "error";
      
   private m_errorID:number;
   
   constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, text:string = "", id:number = 0)
   {
      super(type,bubbles,cancelable,text);
      this.m_errorID = id;
   }
   
   public get errorID() : number
   {
      return this.m_errorID;
   }
   
   /*override*/ public clone() : AEvent
   {
      return new ErrorEvent(this.type,this.bubbles,this.cancelable,this.text,this.m_errorID);
   }
   
   /*override*/ public toString() : string
   {
      return this.formatToString("ErrorEvent","type","bubbles","cancelable","eventPhase","text");
   }
}