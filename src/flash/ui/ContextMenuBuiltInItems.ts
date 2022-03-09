/**
 * The ContextMenuBuiltInItems class describes the items that are built in to a context menu.
 * You can hide these items by using the <codeph class="+ topic/ph pr-d/codeph ">ContextMenu.hideBuiltInItems()</codeph> method.
 * 
 *   EXAMPLE:
 * 
 *   The following example uses the class <codeph class="+ topic/ph pr-d/codeph ">ContextMenuBuiltInItemsExample</codeph> 
 * to remove the normal context menu items from the stage and add a new menu item.  This is 
 * accomplished with the following steps:
 * <ol class="- topic/ol "><li class="- topic/li ">A property <codeph class="+ topic/ph pr-d/codeph ">myContextMenu</codeph> is declared and then assigned to a new ContextMenu
 * object.</li><li class="- topic/li ">The method <codeph class="+ topic/ph pr-d/codeph ">removeDefaultItems()</codeph> is called, which removes all built-in context
 * menu items except Print.</li><li class="- topic/li ">The method <codeph class="+ topic/ph pr-d/codeph ">addCustomMenuItems()</codeph> is called, which places a menu item called 
 * <codeph class="+ topic/ph pr-d/codeph ">Hello World</codeph> into the <codeph class="+ topic/ph pr-d/codeph ">customItems</codeph> array using the 
 * <codeph class="+ topic/ph pr-d/codeph ">push()</codeph> method of Array.</li><li class="- topic/li ">The <codeph class="+ topic/ph pr-d/codeph ">Hello World</codeph> menu item is then added to the Stage's context
 * menu item list.</li><li class="- topic/li ">A TextField object with the text "Right Click" is added to the center of the Stage
 * by using <codeph class="+ topic/ph pr-d/codeph ">addChild()</codeph> via <codeph class="+ topic/ph pr-d/codeph ">createLabel()</codeph>.</li></ol><codeblock xml:space="preserve" class="+ topic/pre pr-d/codeblock ">
 * package {
 * import flash.ui.ContextMenu;
 * import flash.ui.ContextMenuItem;
 * import flash.ui.ContextMenuBuiltInItems;
 * import flash.display.Sprite;
 * import flash.text.TextField;
 * 
 *   public class ContextMenuBuiltInItemsExample extends Sprite {
 * private var myContextMenu:ContextMenu;
 * 
 *   public function ContextMenuBuiltInItemsExample() {
 * myContextMenu = new ContextMenu();
 * removeDefaultItems();
 * addCustomMenuItems();
 * this.contextMenu = myContextMenu;
 * addChild(createLabel());
 * }
 * 
 *   private function removeDefaultItems():void {
 * myContextMenu.hideBuiltInItems();
 * 
 *   var defaultItems:ContextMenuBuiltInItems = myContextMenu.builtInItems;
 * defaultItems.print = true;
 * }
 * 
 *   private function addCustomMenuItems():void {
 * var item:ContextMenuItem = new ContextMenuItem("Hello World");
 * myContextMenu.customItems.push(item);
 * }
 * 
 *   private function createLabel():TextField {
 * var txtField:TextField = new TextField();
 * txtField.text = "Right Click";
 * txtField.x = this.stage.stageWidth/2 - txtField.width/2;
 * txtField.y = this.stage.stageHeight/2 - txtField.height/2;
 * return txtField;
 * }
 * }
 * }
 * </codeblock>
 * @langversion	3.0
 * @playerversion	Flash 9
 */
export class ContextMenuBuiltInItems extends Object
{
	private _forwardAndBack:boolean = false;
	private _loop:boolean = false;
	private _play:boolean = false;
	private _print:boolean = false;
	private _quality:boolean = false;
	private _rewind:boolean = false;
	private _save:boolean = false;
	private _zoom:boolean = false;
	
	/**
	 * Lets the user move forward or backward one frame in a SWF file at run time (does not 
	 * appear for a single-frame SWF file).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get forwardAndBack():boolean { return this._forwardAndBack; }
	public set forwardAndBack (val:boolean) { this._forwardAndBack = val; }

	/**
	 * Lets the user set a SWF file to start over automatically when it reaches the final 
	 * frame (does not appear for a single-frame SWF file).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get loop():boolean { return this._loop; }
	public set loop (val:boolean) { this._loop = val; }

	/**
	 * Lets the user start a paused SWF file (does not appear for a single-frame SWF file).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get play():boolean { return this._play; }
	public set play (val:boolean) { this._play = val; }

	/**
	 * Lets the user send the displayed frame image to a printer.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get print():boolean { return this._print; }
	public set print (val:boolean) { this._print = val; }

	/**
	 * Lets the user set the resolution of the SWF file at run time.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get quality():boolean { return this._quality; }
	public set quality (val:boolean) { this._quality = val; }

	/**
	 * Lets the user set a SWF file to play from the first frame when selected, at any time (does not 
	 * appear for a single-frame SWF file).
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get rewind():boolean { return this._rewind; }
	public set rewind (val:boolean) { this._rewind = val; }

	/**
	 * Lets the user with Shockmachine installed save a SWF file.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get save():boolean { return this._save; }
	public set save (val:boolean) { this._save = val; }

	/**
	 * Lets the user zoom in and out on a SWF file at run time.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	public get zoom():boolean { return this._zoom; }
	public set zoom (val:boolean) { this._zoom = val; }

	public clone():ContextMenuBuiltInItems
	{
		return null;
	}

	/**
	 * Creates a new ContextMenuBuiltInItems object so that you can set the properties for Flash Player to display or hide each menu item.
	 * @langversion	3.0
	 * @playerversion	Flash 9
	 */
	constructor(){
		super();
	}
}