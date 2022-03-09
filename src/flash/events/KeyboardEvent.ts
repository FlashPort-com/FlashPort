import { AEvent } from "./AEvent.js";

export class KeyboardEvent extends AEvent
{
   
   public static KEY_DOWN:string = "keyDown";
   
   public static KEY_UP:string = "keyUp";
      
   private m_keyLocation:number;
   private m_keyCode:number;
   private m_ctrlKey:boolean;
   private m_altKey:boolean;
   private m_shiftKey:boolean;

   constructor(type:string, bubbles:boolean = true, cancelable:boolean = false, charCodeValue:number = 0, keyCodeValue:number = 0, keyLocationValue:number = 0, ctrlKeyValue:boolean = false, altKeyValue:boolean = false, shiftKeyValue:boolean = false)
   {
      super(type,bubbles,cancelable);
      
      this.charCode = charCodeValue;
      this.keyCode = keyCodeValue;
      this.keyLocation = keyLocationValue;
      this.ctrlKey = ctrlKeyValue;
      this.altKey = altKeyValue;
      this.shiftKey = shiftKeyValue;
   }
   
   /*override*/ public clone() : AEvent
   {
      return new KeyboardEvent(this.type,this.bubbles,this.cancelable,this.charCode,this.keyCode,this.keyLocation,this.ctrlKey,this.altKey,this.shiftKey);
   }
   
   /*override*/ public toString() : string
   {
      return this.formatToString("KeyboardEvent","type","bubbles","cancelable","eventPhase","charCode","keyCode","keyLocation","ctrlKey","altKey","shiftKey");
   }
   
   public get charCode() : number{return 0}
   
   public set charCode(param1:number){}
   
   public get keyCode() : number
   {
      return this.m_keyCode;
   }
   
   public set keyCode(value:number)
   {
      this.m_keyCode = value;
   }
   
   public get keyLocation() : number
   {
      return this.m_keyLocation;
   }
   
   public set keyLocation(value:number)
   {
      this.m_keyLocation = value;
   }
   
   public get ctrlKey() : boolean
   {
      return this.m_ctrlKey;
   }
   
   public set ctrlKey(param1:boolean)
   {
      this.m_ctrlKey = param1;
   }
   
   public get altKey() : boolean
   {
      return this.m_altKey;
   }
   
   public set altKey(param1:boolean)
   {
      this.m_altKey = param1;
   }
   
   public get shiftKey() : boolean
   {
      return this.m_shiftKey;
   }
   
   public set shiftKey(param1:boolean)
   {
      this.m_shiftKey = param1;
   }
   
   public updateAfterEvent() : void{}
}