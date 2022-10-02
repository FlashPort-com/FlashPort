import { AEvent } from "./AEvent";

export class TouchEvent extends AEvent
{ 
   public static TOUCH_BEGIN:string = "touchBegin";
   
   public static TOUCH_END:string = "touchEnd";
   
   public static TOUCH_MOVE:string = "touchMove";
   
   public static TOUCH_OVER:string = "touchOver";
   
   public static TOUCH_OUT:string = "touchOut";
   
   public static TOUCH_ROLL_OVER:string = "touchRollOver";
   
   public static TOUCH_ROLL_OUT:string = "touchRollOut";
   
   public static TOUCH_TAP:string = "touchTap";
   
   public static PROXIMITY_BEGIN:string = "proximityBegin";
   
   public static PROXIMITY_END:string = "proximityEnd";
   
   public static PROXIMITY_MOVE:string = "proximityMove";
   
   public static PROXIMITY_OUT:string = "proximityOut";
   
   public static PROXIMITY_OVER:string = "proximityOver";
   
   public static PROXIMITY_ROLL_OUT:string = "proximityRollOut";
   
   public static PROXIMITY_ROLL_OVER:string = "proximityRollOver";
      
   private m_touchPointID:number;
   
   private m_isPrimaryTouchPoint:boolean;
   
   private m_sizeY:number;
   
   private m_sizeX:number;
   
   private m_pressure:number;
   
   private m_relatedObject:Object;
   
   private m_isRelatedObjectInaccessible:boolean;
   
   private m_ctrlKey:boolean;
   
   private m_altKey:boolean;
   
   private m_shiftKey:boolean;
   
   constructor(type:string, bubbles:boolean = true, cancelable:boolean = false, touchPointID:number = 0, isPrimaryTouchPoint:boolean = false, localX:number = NaN, localY:number = NaN, sizeX:number = NaN, sizeY:number = NaN, pressure:number = NaN, relatedObject:Object = null, ctrlKey:boolean = false, altKey:boolean = false, shiftKey:boolean = false){
      super(type,bubbles,cancelable);
      this.m_touchPointID = touchPointID;
      this.m_isPrimaryTouchPoint = isPrimaryTouchPoint;
      this.localX = localX;
      this.localY = localY;
      this.m_sizeX = sizeX;
      this.m_sizeY = sizeY;
      this.m_pressure = pressure;
      this.m_relatedObject = relatedObject;
      this.m_ctrlKey = ctrlKey;
      this.m_altKey = altKey;
      this.m_shiftKey = shiftKey;
   }
   
   /*override*/ public clone() : AEvent
   {
      return new TouchEvent(this.type,this.bubbles,this.cancelable,this.m_touchPointID,this.m_isPrimaryTouchPoint,this.localX,this.localY,this.m_sizeX,this.m_sizeY,this.m_pressure,this.m_relatedObject,this.m_ctrlKey,this.m_altKey,this.m_shiftKey);
   }
   
   /*override*/ public toString() : string
   {
      return this.formatToString("TouchEvent","type","bubbles","cancelable","eventPhase","touchPointID","isPrimaryTouchPoint","localX","localY","stageX","stageY","sizeX","sizeY","pressure","relatedObject","ctrlKey","altKey","shiftKey");
   }
   
   public get localX() : number{return 0}
   
   public set localX(param1:number){}
   
   public get localY() : number{return 0}
   
   public set localY(param1:number){}
   
   public get touchPointID() : number
   {
      return this.m_touchPointID;
   }
   
   public set touchPointID(value:number)
   {
      this.m_touchPointID = value;
   }
   
   public get isPrimaryTouchPoint() : boolean
   {
      return this.m_isPrimaryTouchPoint;
   }
   
   public set isPrimaryTouchPoint(value:boolean)
   {
      this.m_isPrimaryTouchPoint = value;
   }
   
   public get sizeX() : number
   {
      return this.m_sizeX;
   }
   
   public set sizeX(value:number)
   {
      this.m_sizeX = value;
   }
   
   public get sizeY() : number
   {
      return this.m_sizeY;
   }
   
   public set sizeY(value:number)
   {
      this.m_sizeY = value;
   }
   
   public get pressure() : number
   {
      return this.m_pressure;
   }
   
   public set pressure(value:number)
   {
      this.m_pressure = value;
   }
   
   public get relatedObject() : Object
   {
      return this.m_relatedObject;
   }
   
   public set relatedObject(value:Object)
   {
      this.m_relatedObject = value;
   }
   
   public get ctrlKey() : boolean
   {
      return this.m_ctrlKey;
   }
   
   public set ctrlKey(value:boolean)
   {
      this.m_ctrlKey = value;
   }
   
   public get altKey() : boolean
   {
      return this.m_altKey;
   }
   
   public set altKey(value:boolean)
   {
      this.m_altKey = value;
   }
   
   public get shiftKey() : boolean
   {
      return this.m_shiftKey;
   }
   
   public set shiftKey(value:boolean)
   {
      this.m_shiftKey = value;
   }
   
   public get stageX() : number
   {
      if(isNaN(this.localX) || isNaN(this.localY))
      {
         return Number.NaN;
      }
      return this.getStageX();
   }
   
   public get stageY() : number
   {
      if(isNaN(this.localX) || isNaN(this.localY))
      {
         return Number.NaN;
      }
      return this.getStageY();
   }
   
   public updateAfterEvent() : void{}
   
   private getStageX() : number{return 0}
   
   private getStageY() : number{return 0}
   
   public get isRelatedObjectInaccessible() : boolean
   {
      return this.m_isRelatedObjectInaccessible;
   }
   
   public set isRelatedObjectInaccessible(value:boolean)
   {
      this.m_isRelatedObjectInaccessible = value;
   }
}