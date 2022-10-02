import { AEvent } from "./AEvent";

export class TextEvent extends AEvent
{
   
   public static LINK:string = "link";
   
   public static TEXT_INPUT:string = "textInput";
      
   private m_text:string;
   
   constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, text:string = ""){
      super(type,bubbles,cancelable);
      this.m_text = text;
   }
   
   public get text() : string
   {
      return this.m_text;
   }
   
   public set text(value:string)
   {
      this.m_text = value;
   }
   
   /*override*/ public clone() : AEvent
   {
      var te:TextEvent = new TextEvent(this.type,this.bubbles,this.cancelable,this.m_text);
      te.copyNativeData(this);
      return te;
   }
   
   /*override*/ public toString() : string
   {
      return this.formatToString("TextEvent","type","bubbles","cancelable","eventPhase","text");
   }
   
   private copyNativeData(param1:TextEvent) : void{}
}