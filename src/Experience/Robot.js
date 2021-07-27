import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Robot
{
    constructor()
    {
        this.experience = window.experience
        this.config = this.experience.config
        this.time = this.experience.time        
        this.scene = this.experience.scene
        this.gamepad = this.experience.gamepad        
        this.resources = this.experience.resources        

        this.setModel()
    }

    setModel()
    {
        this.model = {}
        this.model.group = this.resources.items.robotModel.scene

        this.model.parts = [
            {
                regex: /^shoulder/,
                name: 'shoulders',
                objects: [],
                axe: 'x',
                value: 0,
                easedValue: 0,
                directionMultiplier: 1
            }
        ]

        for(const _part of this.model.parts)
        {
            this.model[_part.name] = _part
        }

        this.model.group.traverse((_child) =>
        {
            if(_child instanceof THREE.Object3D)
            {
                const part = this.model.parts.find(_part => _child.name.match(_part.regex))

                if(part)
                {
                    part.objects.push(_child)
                }
            }
        })

        this.gamepad.inputs.buttonCircle.on('pressed', () =>
        {
            this.model.shoulders.directionMultiplier *= - 1
        })

        this.scene.add(this.model.group)
    }

    update()
    {
        /**
         * Parts
         */
        // Update values
        if(this.gamepad.inputs.buttonCircle.pressed)
        {
            this.model.shoulders.value += 0.002 * this.time.delta * this.model.shoulders.directionMultiplier
        }
        
        this.model.shoulders.easedValue += (this.model.shoulders.value - this.model.shoulders.easedValue) * 0.01 * this.time.delta

        // Update objects
        for(const _object of this.model.shoulders.objects)
        {
            _object.rotation[_object.userData.axis] = this.model.shoulders.easedValue * _object.userData.multiplier
        }
    }
}