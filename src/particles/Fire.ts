import { Sprite } from "../flash";
import { Shape } from "../flash";
import { AEvent } from "../flash";
import { ColorTransform } from "../flash";
import { Particle } from "./Particle";


export class Fire extends Sprite
{
    private _pool:Particle[] = [];
    private _activePool:Particle[] = [];   

    private readonly MAX_POOL:number = 5000;
    private readonly START_WIDTH_MAX:number = 200;
    private readonly END_HEIGHT_MAX:number = -400;
    private readonly MIN_SPEED:number = 6;
    private readonly MAX_SPEED:number = 10;
    private readonly MIN_SCALE:number = .5;
    private readonly MAX_SCALE:number = 1.5;

    constructor()
    {
        super();

        // fill pool
        for (let i:number = 0; i < this.MAX_POOL; i++)
        {
            var particle:Particle = new Particle();
            particle.visible = false;
            this.addChild(particle);
            this._pool.push(particle);
        }

        this.addEventListener(AEvent.ENTER_FRAME, this.update);
    }

    private randomNumber = (min:number, max:number) => { 
        return Math.random() * (max - min) + min;
    }

    private update = (e:AEvent) => {
        // grab particles
        for (let j:number = 0; j < 100; j++)
        {
            let particle:Particle = this._pool.pop();
            if (particle)
            {
                particle.endPos = this.randomNumber(this.END_HEIGHT_MAX - 200, this.END_HEIGHT_MAX);
                particle.x = this.randomNumber(1, this.START_WIDTH_MAX);
                particle.y = this.randomNumber(1, 5);
                particle.scaleX = particle.scaleY = this.randomNumber(this.MIN_SCALE, this.MAX_SCALE);
                particle.speed = this.randomNumber(this.MIN_SPEED, this.MAX_SPEED);
                particle.sineSpeed = this.randomNumber(0, .1);
                particle.sineAmplitude = this.randomNumber(1, 10) % 2 == 0 ? .1 : -.1;
                particle.transform.colorTransform = new ColorTransform();
                particle.transform.colorTransform.color = j%8 == 0 ? 0x000000 : 0xFF7700;
                particle.visible = true;
                this._activePool.push(particle);
            }
        }

        // update active particles
        let len:number = this._activePool.length;
        for (let i:number = 0; i < len; i++)
        {
            let activeParticle:Particle = this._activePool[i];
            activeParticle.y -= activeParticle.speed;
            activeParticle.x += activeParticle.sineAmplitude * Math.sin(activeParticle.sineAmplitude += activeParticle.sineSpeed);
            activeParticle.alpha = 1 - Math.abs(activeParticle.y / activeParticle.endPos);
            if (activeParticle.transform.colorTransform.color.toString(16) != '000000')
            {
                let whiteSmoke:boolean = Math.abs(activeParticle.y / activeParticle.endPos) > .25;
                let colorSpeed:number =  whiteSmoke ? 40 : 6;
                
                activeParticle.transform.colorTransform.redOffset += colorSpeed;
                activeParticle.transform.colorTransform.greenOffset += colorSpeed;
                activeParticle.transform.colorTransform.blueOffset += colorSpeed;
            }

            if (activeParticle.y <= activeParticle.endPos || activeParticle.alpha <= 0)
            {
                this._activePool[i] = this._activePool.pop();  // fast array removal
                len -= 1;
                i--;
                activeParticle.visible = false;
                this._pool.push(activeParticle);
                activeParticle.y = 0;
            }
        }

    }
}