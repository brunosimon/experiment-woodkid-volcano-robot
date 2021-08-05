import * as THREE from 'three'
import { gsap } from 'gsap'

export default class Robot
{
    constructor()
    {
        this.experience = window.experience
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.controls = this.experience.controls
        this.resources = this.experience.resources

        // Debug
        this.debugFolder = this.debug.addFolder({
            title: 'robot',
            expanded: false,
        })

        this.setMaterial()
        this.setModel()
    }

    setMaterial()
    {
        this.color = '#666666'

        this.material = new THREE.MeshStandardMaterial()
        this.material.color = new THREE.Color(this.color)
        this.material.wireframe = false

        this.debugFolder
            .addInput(
                this,
                'color',
                { view: 'color' }
            )
            .on('change', () =>
            {
                this.material.color.set(this.color)
            })
        
        this.debugFolder
            .addInput(
                this.material,
                'roughness',
                { min: 0, max: 1 }
            )
        
        this.debugFolder
            .addInput(
                this.material,
                'metalness',
                { min: 0, max: 1 }
            )
        
        this.debugFolder
            .addInput(
                this.material,
                'wireframe'
            )

        this.controls.on('wireframePressed', () =>
        {
            this.material.wireframe = !this.material.wireframe
        })
    }

    setModel()
    {
        this.model = {}

        // Add the model
        this.model.group = this.resources.items.robotModel.scene
        this.scene.add(this.model.group)

        // Parse the different parts
        this.model.parts = [
            // Button toggles
            {
                type: 'buttonToggle',
                regex: /^shoulder/,
                name: 'shoulders',
                objects: [],
                speed: 0.002,
                easing: 0.01,
                value: 0,
                easedValue: 0,
                directionMultiplier: 1,
                min: - Infinity,
                max: Infinity,
                controlsName: 'shoulderPressed'
            },
            {
                type: 'buttonToggle',
                regex: /^upperArm/,
                name: 'upperArms',
                objects: [],
                speed: 0.002,
                easing: 0.01,
                value: 0,
                easedValue: 0,
                directionMultiplier: 1,
                min: - Infinity,
                max: Infinity,
                controlsName: 'upperArmPressed'
            },
            {
                type: 'buttonToggle',
                regex: /^elbow/,
                name: 'elbows',
                objects: [],
                speed: 0.002,
                easing: 0.01,
                value: 0,
                easedValue: 0,
                directionMultiplier: 1,
                min: - Math.PI * 0.75,
                max: 0,
                controlsName: 'elbowPressed'
            },
            {
                type: 'buttonToggle',
                regex: /^forearm/,
                name: 'forearms',
                objects: [],
                speed: 0.002,
                easing: 0.01,
                value: 0,
                easedValue: 0,
                directionMultiplier: 1,
                min: - Infinity,
                max: Infinity,
                controlsName: 'forearmPressed'
            },

            // Button pressure
            {
                type: 'buttonPressure',
                regex: /^clamp/,
                name: 'clamps',
                objects: [],
                easing: 0.01,
                value: 0,
                easedValue: 0,
                controlsName: 'clampPressure'
            },

            // Button pressure
            {
                type: 'joystick',
                regex: /^torso/,
                name: 'torsos',
                objects: [],
                easing: 0.002,
                x: 0,
                easedX: 0,
                y: 0,
                easedY: 0,
                controlsName: 'torsoOrientation'
            },
        ]

        this.model.group.traverse((_child) =>
        {
            if(_child instanceof THREE.Object3D)
            {
                const part = this.model.parts.find(_part => _child.name.match(_part.regex))

                if(part)
                {
                    part.objects.push(_child)
                }

                if(_child instanceof THREE.Mesh)
                {
                    // Activate shadow
                    _child.castShadow = true
                    _child.receiveShadow = true

                    // Set the material
                    _child.material = this.material
                }
            }
        })

        for(const _part of this.model.parts)
        {
            // Save as property
            this.model[_part.name] = _part

            if(_part.type === 'buttonToggle')
            {
                // Input pressed event
                this.controls.on(_part.controlsName, () =>
                {
                    _part.directionMultiplier *= - 1
                })
            }
        }
    }

    update()
    {
        /**
         * Parts
         */
        for(const _part of this.model.parts)
        {
            /**
             * Update values
             */
            if(_part.type === 'buttonToggle')
            {
                if(this.controls[_part.controlsName])
                    _part.value += _part.speed * this.time.delta * _part.directionMultiplier

                _part.value = Math.min(Math.max(_part.value, _part.min), _part.max)
            }
            else if(_part.type === 'buttonPressure')
            {
                _part.value = this.controls[_part.controlsName]
            }
            else if(_part.type === 'joystick')
            {
                _part.x = this.controls[_part.controlsName].x
                _part.y = this.controls[_part.controlsName].y
            }
            
            /**
             * Apply easing and update objects
             */
            if(_part.type === 'buttonToggle' || _part.type === 'buttonPressure')
            {
                // Update eased value
                _part.easedValue += (_part.value - _part.easedValue) * _part.easing * this.time.delta
    
                // Update objects
                for(const _object of _part.objects)
                    _object.rotation[_object.userData.axis] = _part.easedValue * _object.userData.multiplier
            }
            else if(_part.type === 'joystick')
            {
                // Update eased value
                _part.easedX += (_part.x - _part.easedX) * _part.easing * this.time.delta
                _part.easedY += (_part.y - _part.easedY) * _part.easing * this.time.delta
    
                // Update objects
                for(const _object of _part.objects)
                {
                    _object.rotation.y = _part.easedX * _object.userData.multiplier
                    _object.rotation.x = _part.easedY * _object.userData.multiplier
                }
            }
        }
    }
}