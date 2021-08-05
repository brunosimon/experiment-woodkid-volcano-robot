import EventEmitter from '../Utils/EventEmitter.js'
import GamepadButton from './GamepadButton.js'
import GamepadJoystick from './GamepadJoystick.js'
import GamepadInterface from './GamepadInterface.js'

export default class Gamepad extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.connected = false

        this.setConnection()
        this.setInputs()
        this.setInterface()
    }

    activate()
    {
        this.interface.activate()
    }

    deactivate()
    {
        this.interface.deactivate()
    }

    setConnection()
    {
        // Connected event
        window.addEventListener('gamepadconnected', (_event) =>
        {
            this.connected = true
        })

        // Disconnected event
        window.addEventListener('gamepaddisconnected', (_event) =>
        {
            this.connected = false
        })
    }

    setInputs()
    {
        this.inputs = {}
        
        /**
         * Buttons
         */
        this.inputs.all = [
            /**
             * Buttons
             */
            // Right buttons
            new GamepadButton(1, 'buttonCircle'),
            new GamepadButton(0, 'buttonCross'),
            new GamepadButton(2, 'buttonSquare'),
            new GamepadButton(3, 'buttonTriangle'),

            // Left buttons
            new GamepadButton(14, 'buttonLeft'),
            new GamepadButton(12, 'buttonUp'),
            new GamepadButton(15, 'buttonRight'),
            new GamepadButton(13, 'buttonDown'),
            
            // Joysticks buttons
            new GamepadButton(10, 'buttonJoystickLeft'),
            new GamepadButton(11, 'buttonJoystickRight'),

            // Back buttons
            new GamepadButton(4, 'buttonL1'),
            new GamepadButton(5, 'buttonR1'),
            new GamepadButton(6, 'buttonL2', true),
            new GamepadButton(7, 'buttonR2', true),

            // Special buttons
            new GamepadButton(8, 'buttonShare'),
            new GamepadButton(9, 'buttonOptions'),
            new GamepadButton(17, 'buttonTouchpad'),
            new GamepadButton(16, 'buttonHome'),

            /**
             * Joysticks
             */
            new GamepadJoystick(0, 'joystickLeft', 8),
            new GamepadJoystick(1, 'joystickRight', 8),
        ]

        /**
         * Save
         */
        for(const _input of this.inputs.all)
        {
            this.inputs[_input.name] = _input
        }

        /**
         * Events
         */
        for(const _input of this.inputs.all)
        {
            // Button
            if(_input.type === 'button')
            {
                _input.on('pressed', (_index, _name) =>
                {
                    this.trigger('change')
                })
    
                _input.on('unpressed', (_index, _name) =>
                {
                    this.trigger('change')
                })
    
                _input.on('pressureChanged', (_index, _name, _pressure) =>
                {
                    this.trigger('change')
                })
            }

            // Joystick
            else if(_input.type === 'joystick')
            {
                _input.on('started', (_index, _name) =>
                {
                    this.trigger('change')
                })
                
                _input.on('ended', (_index, _name) =>
                {
                    this.trigger('change')
                })
                
                _input.on('changed', (_index, _name) =>
                {
                    this.trigger('change')
                })
            }
        }
    }

    setInterface()
    {
        this.interface = new GamepadInterface(this.inputs)
    }

    update()
    {
        // No gamepad connected
        if(!this.connected)
        {
            return
        }
        
        // Retrieve state
        const instanceState = navigator.getGamepads()[0]

        // Update inputs
        for(const _input of this.inputs.all)
        {
            _input.update(instanceState)
        }
    }
}