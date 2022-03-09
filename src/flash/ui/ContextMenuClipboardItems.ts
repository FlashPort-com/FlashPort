/**
 * The ContextMenuClipboardItems class lets you enable or disable the commands in the clipboard context menu.
 * 
 *   <p class="- topic/p ">Enable or disable the context menu clipboard commands using the <codeph class="+ topic/ph pr-d/codeph ">clipboardItems</codeph> property of
 * the ContextMenu object. The <codeph class="+ topic/ph pr-d/codeph ">clipboardItems</codeph> property is an instance of this ContextMenuClipboardItems 
 * class. The clipboard context menu is shown in a context menu when the <codeph class="+ topic/ph pr-d/codeph ">clipboardMenu</codeph> property
 * of the context menu is <codeph class="+ topic/ph pr-d/codeph ">true</codeph>, unless the context menu is for a TextField object. TextField objects
 * control the display of the context menu and the state of its clipboard items automatically.</p>
 * @langversion	3.0
 * @playerversion	Flash 10
 * @playerversion	AIR 1.5
 */
export class ContextMenuClipboardItems extends Object
{
	private _clear:boolean = false;
	private _copy:boolean = false;
	private _cut:boolean = false;
	private _paste:boolean = false;
	private _selectAll:boolean = false;
	
	/**
	 * Enables or disables the 'Delete' or 'Clear' item on the clipboard menu.
	 * This should be enabled only if an object that can be cleared is selected.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get clear():boolean { return this._clear; }
	public set clear (val:boolean) { this._clear = val; }

	/**
	 * Enables or disables the 'Copy' item on the clipboard menu.
	 * This should be enabled only if an object that can be copied is selected.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get copy():boolean { return this._copy; }
	public set copy (val:boolean) { this._copy = val; }

	/**
	 * Enables or disables the 'Cut' item on the clipboard menu.
	 * This should be enabled only if an object that can be cut is selected.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get cut():boolean { return this._cut; }
	public set cut (val:boolean) { this._cut = val; }

	/**
	 * Enables or disables the 'Paste' item on the clipboard menu.
	 * This should be enabled only if pastable data is on the clipboard.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get paste():boolean { return this._paste; }
	public set paste (val:boolean) { this._paste = val; }

	/**
	 * Enables or disables the 'Select All' item on the clipboard menu.
	 * This should only be enabled in a context where a selection can be 
	 * expanded to include all similar items, such as in a list or a text editing control.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	public get selectAll():boolean { return this._selectAll; }
	public set selectAll (val:boolean) { this._selectAll = val; }

	public clone():ContextMenuClipboardItems
	{
		return null;
	}

	/**
	 * Creates a new ContextMenuClipboardItems object.
	 * @langversion	3.0
	 * @playerversion	Flash 10
	 * @playerversion	AIR 1.5
	 */
	constructor(){
		super();
	}
}