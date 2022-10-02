import { EventDispatcher } from "../events/EventDispatcher";
import { TimerEvent } from "../events/TimerEvent";
import { Error } from "../../Error";

/**
 * Dispatched whenever it has completed the number of requests set by Timer.repeatCount.
 * @eventType	flash.events.TimerEvent.TIMER_COMPLETE
 */
/*[Event(name="timerComplete", type="flash.events.TimerEvent")]*/ 

/**
 * Dispatched whenever a Timer object reaches an interval specified according to the Timer.delay property.
 * @eventType	flash.events.TimerEvent.TIMER
 */
/*[Event(name="timer", type="flash.events.TimerEvent")]*/ 

/**
 * The Timer class is the interface to timers, which let you 
 * run code on a specified time sequence. Use the <codeph class="+ topic/ph pr-d/codeph ">start()</codeph> method to start a timer.
 * Add an event listener for the <codeph class="+ topic/ph pr-d/codeph ">timer</codeph> event to set up code to be run on the timer interval.
 * 
 *   <p class="- topic/p ">You can create Timer objects to run once or repeat at specified intervals to execute code on a schedule.
 * 
 *   <ph class="- topic/ph ">Depending on the SWF file's framerate or the runtime environment (available 
 * memory and other factors), the runtime may dispatch events at slightly 
 * offset intervals. For example, if a SWF file is set to play at 10 frames per second (fps), which is 100 millisecond 
 * intervals, but your timer is set to fire an event at 80 milliseconds, the event will be dispatched close to the 
 * 100 millisecond interval.</ph>
 * 
 *   Memory-intensive scripts may also offset the events.</p>
 * 
 *   EXAMPLE:
 * 
 *   The following example uses the class <codeph class="+ topic/ph pr-d/codeph ">TimerExample</codeph> to show how a
 * listener method <codeph class="+ topic/ph pr-d/codeph ">timerHandler()</codeph> can be set to listen for a new TimerEvent 
 * to be dispatched. The timer is started when <codeph class="+ topic/ph pr-d/codeph ">start()</codeph> is called, and after that point,
 * the timer events are dispatched.  
 * <codeblock xml:space="preserve" class="+ topic/pre pr-d/codeblock ">
 * package {
 * import flash.utils.Timer;
 * import flash.events.TimerEvent;
 * import flash.display.Sprite;
 * 
 *   public class TimerExample extends Sprite {
 * 
 *   public function TimerExample() {
 * var myTimer:Timer = new Timer(1000, 2);
 * myTimer.addEventListener("timer", timerHandler);
 * myTimer.start();
 * }
 * 
 *   public function timerHandler(event:TimerEvent):void {
 * trace("timerHandler: " + event);
 * }
 * }
 * }
 * </codeblock>
 * @langversion	3.0
 * @playerversion	Flash 9
 * @playerversion	Lite 4
 */
export class Timer extends EventDispatcher
{
	private _delay:number;
	private _repeatCount:number = 0;
	private _startTime:number = 0;
	private _stopTime:number = 0;
	private _delayTime:number = 0;
	private _interval:number;
	private _running:boolean = false;
	private _currentCount:number = 0;
	private _complete:boolean = false;
	
	/**
	 * The total number of times the timer has fired since it started
	 * at zero. If the timer has been reset, only the fires since
	 * the reset are counted.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get currentCount():number
	{
		return this._currentCount;
	}

	/**
	 * The delay, in milliseconds, between timer
	 * events. If you set the delay interval while
	 * the timer is running, the timer will restart
	 * at the same repeatCount iteration.
	 * Note: A delay lower than 20 milliseconds is not recommended. Timer frequency
	 * is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 * @throws	Error Throws an exception if the delay specified is negative or not a finite number.
	 */
	public get delay():number
	{
		return this._delay;
	}
	
	public set delay (value:number)
	{
		if (value < 0 || !isFinite(value)) Error.throwError(RangeError, 2066);
		
		this._delay = value;
		
		if (this._running)
		{
			var count:number = this._currentCount;
			this.reset();
			this._currentCount = count;
			this.start();
		}
	}

	/**
	 * The total number of times the timer is set to run.
	 * If the repeat count is set to 0, the timer continues forever 
	 * or until the stop() method is invoked or the program stops.
	 * If the repeat count is nonzero, the timer runs the specified number of times. 
	 * If repeatCount is set to a total that is the same or less then currentCount
	 * the timer stops and will not fire again.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get repeatCount():number
	{
		return this._repeatCount;
	}
	
	public set repeatCount(value:number)
	{
		this._repeatCount = value;
		
		if (this._running)
		{
			this.reset();
			this.start();
		}
	}

	/**
	 * The timer's current state; true if the timer is running, otherwise false.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public get running():boolean
	{
		return this._running;
	}

	/**
	 * Stops the timer, if it is running, and sets the currentCount property back to 0,
	 * like the reset button of a stopwatch. Then, when start() is called,
	 * the timer instance runs for the specified number of repetitions,
	 * as set by the repeatCount value.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public reset = ():void =>
	{
		this.stop();
		this._stopTime = 0;
		this._complete = false;
		this._currentCount = 0;
	}

	/**
	 * Starts the timer, if it is not already running.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public start = ():void =>
	{
		this._startTime = new Date().getMilliseconds();
		this._interval = window.setInterval(this.timerComplete, this._delayTime);
		this._running = true;
	}

	/**
	 * Stops the timer. When start() is called after stop(), the timer
	 * instance runs for the remaining number of repetitions, as set by the repeatCount property.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public stop = ():void =>
	{
		window.clearInterval(this._interval);
		this._stopTime = new Date().getMilliseconds();
		this._delayTime -= (this._stopTime - this._startTime);
		this._running = false;
	}
	
	private timerComplete = ():void =>
	{
		//trace("Timer.timerComplete()");
		this._delayTime = this._delay;
		this.dispatchEvent(new TimerEvent(TimerEvent.TIMER));
		if (!this._complete || this._repeatCount > this._currentCount)
		{
			this._complete = true;
			if (this._repeatCount > 0) this._currentCount++;
			this.dispatchEvent(new TimerEvent(TimerEvent.TIMER_COMPLETE));
		}
		
		if (this._repeatCount > 0 && this._repeatCount == this._currentCount) this.reset();
	}

	/**
	 * Constructs a new Timer object with the specified delay
	 * and repeatCount states.
	 * 
	 *   The timer does not start automatically; you must call the start() method
	 * to start it.
	 * @param	delay	The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended. Timer frequency
	 *   is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
	 * @param	repeatCount	Specifies the number of repetitions.
	 *   If zero, the timer repeats infinitely. 
	 *   If nonzero, the timer runs the specified number of times and then stops.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 * @throws	Error if the delay specified is negative or not a finite number
	 */
	constructor (delay:number, repeatCount:number = 0){
		super();
		
		if (delay < 0 || !isFinite(delay)) Error.throwError(RangeError, 2066);
		
		this._delay = delay;
		this._delayTime = delay;
		this._repeatCount = repeatCount;
	}
}
