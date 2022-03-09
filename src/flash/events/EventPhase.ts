/**
 * The EventPhase class provides values for the <codeph class="+ topic/ph pr-d/codeph ">eventPhase</codeph> property of the Event class.
 * @langversion	3.0
 * @playerversion	Flash 9
 * @playerversion	Lite 4
 */
export class EventPhase extends Object
{
	/**
	 * The target phase, which is the second phase of the event flow.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public static AT_TARGET : number = 2;

	/**
	 * The bubbling phase, which is the third phase of the event flow.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public static BUBBLING_PHASE : number = 3;

	/**
	 * The capturing phase, which is the first phase of the event flow.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 * @playerversion	Lite 4
	 */
	public static CAPTURING_PHASE : number = 1;

	constructor ()
	{
		super();
	}
}