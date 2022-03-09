/**
 * Scaling Box
 *
 * Copyright 2012 Ville Koskela. All rights reserved.
 *
 * Email: ville@villekoskela.org
 * Blog: http://villekoskela.org
 * Twitter: @villekoskelaorg
 *
 * You may redistribute, use and/or modify this source code freely
 * but this copyright statement must not be removed from the source files.
 *
 * The package structure of the source code must remain unchanged.
 * Mentioning the author in the binary distributions is highly appreciated.
 *
 * If you use this utility it would be nice to hear about it so feel free to drop
 * an email.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. *
 *
 */

import { Sprite } from "../../../flash/display/Sprite.js";
import { AEvent } from "../../../flash/events/AEvent.js";
import { MouseEvent } from "../../../flash/events/MouseEvent.js";

/**
 * Utility class to provide scalable box functionality.
 */
export class ScalingBox extends Sprite
{
    private mX:number = 0.0;
    private mY:number = 0.0;
    private mWidth:number = 0.0;
    private mHeight:number = 0.0;
    private mMaxWidth:number = 0.0;
    private mMaxHeight:number = 0.0;

    private mNewWidth:number = 0.0;
    private mNewHeight:number = 0.0;

    private mDragBox:Sprite = new Sprite();
    private mDragging:Boolean = false;

    public get boxWidth():number { return this.mWidth; }
    public get boxHeight():number { return this.mHeight; }
    public get newBoxWidth():number { return this.mNewWidth; }
    public get newBoxHeight():number { return this.mNewHeight; }

    constructor(x:number, y:number, width:number, height:number)
    {
        super();

        this.mX = x;
        this.mY = y;

        this.mMaxWidth = width;
        this.mMaxHeight = height;

        this.x = x;
        this.y = y;

        this.mDragBox.graphics.beginFill(0xFF8050);
        this.mDragBox.graphics.drawCircle(0, 0, 10);
        this.mDragBox.graphics.endFill();

        this.addChild(this.mDragBox);

        this.mDragBox.addEventListener(MouseEvent.MOUSE_DOWN, this.onStartDrag);
        this.addEventListener(AEvent.ADDED_TO_STAGE, this.onAddedToStage);
        this.updateBox(width, height);
    }

    public updateBox(width:number, height:number):void
    {
        this.mWidth = width;
        this.mHeight = height;
        this.mNewWidth = width;
        this.mNewHeight = height;

        this.graphics.clear();
        this.graphics.lineStyle(1.0, 0x000000);
        this.graphics.drawRect(0, 0, this.mWidth, this.mHeight);

        this.mDragBox.x = this.mWidth;
        this.mDragBox.y = this.mHeight;
    }

    private onAddedToStage(event:Event):void
    {
        this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onMouseMove);
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
    }

    private onMouseUp(event:MouseEvent):void
    {
        this.mDragging = false;
    }

    private onMouseMove(event:MouseEvent):void
    {
        if (this.mDragging)
        {
            this.mNewWidth = event.stageX - this.mX;
            this.mNewHeight = event.stageY - this.mY;

            if (this.mNewWidth > this.mMaxWidth)
            {
                this.mNewWidth = this.mMaxWidth;
            }

            if (this.mNewHeight > this.mMaxHeight)
            {
                this.mNewHeight = this.mMaxHeight;
            }
        }
    }

    private onStartDrag(event:MouseEvent):void
    {
        this.mDragging = true;
    }
}