import Gamepad from './Gamepad/Gamepad.js'
import EventEmitter from './Utils/EventEmitter.js'
import Keyboard from './Keyboard/Keyboard.js'

export default class Controls extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = window.experience
        this.time = this.experience.time

        this.mode = 'keyboard'

        this.shoulderPressed = false
        this.upperArmPressed = false
        this.elbowPressed = false
        this.forearmPressed = false

        this.clampPressure = 0
        this.torsoOrientation = { x: 0, y: 0 }

        this.setGamepad()
        this.setKeyboard()
    }

    goMode(_mode)
    {
        // Same mode
        if(_mode === this.mode)
        {
            return
        }

        // Go gamepad
        if(_mode === 'gamepad')
        {
            this.gamepad.activate()
            this.keyboard.deactivate()
        }

        // Go keyboard
        else if(_mode === 'keyboard')
        {
            this.gamepad.deactivate()
            this.keyboard.activate()
        }

        this.mode = _mode
    }

    setGamepad()
    {
        this.gamepad = new Gamepad()

        this.gamepad.on('change', () =>
        {
            this.goMode('gamepad')
        })

        // Preset 1
        this.gamepad.inputs.buttonUp.on('pressed', () =>
        {
            this.trigger('preset1Pressed')
        })

        // Preset 2
        this.gamepad.inputs.buttonRight.on('pressed', () =>
        {
            this.trigger('preset2Pressed')
        })

        // Preset 3
        this.gamepad.inputs.buttonDown.on('pressed', () =>
        {
            this.trigger('preset3Pressed')
        })

        // Preset 4
        this.gamepad.inputs.buttonLeft.on('pressed', () =>
        {
            this.trigger('preset4Pressed')
        })

        // Wireframe
        this.gamepad.inputs.buttonL1.on('pressed', () =>
        {
            this.trigger('wireframePressed')
        })

        // Shoulder
        this.gamepad.inputs.buttonCircle.on('pressed', () =>
        {
            this.shoulderPressed = true
            this.trigger('shoulderPressed')
        })

        this.gamepad.inputs.buttonCircle.on('unpressed', () =>
        {
            this.shoulderPressed = false
        })

        // Upper arm
        this.gamepad.inputs.buttonSquare.on('pressed', () =>
        {
            this.upperArmPressed = true
            this.trigger('upperArmPressed')
        })

        this.gamepad.inputs.buttonSquare.on('unpressed', () =>
        {
            this.upperArmPressed = false
        })

        // Elbow
        this.gamepad.inputs.buttonCross.on('pressed', () =>
        {
            this.elbowPressed = true
            this.trigger('elbowPressed')
        })

        this.gamepad.inputs.buttonCross.on('unpressed', () =>
        {
            this.elbowPressed = false
        })

        // Forearm
        this.gamepad.inputs.buttonTriangle.on('pressed', () =>
        {
            this.forearmPressed = true
            this.trigger('forearmPressed')
        })

        this.gamepad.inputs.buttonTriangle.on('unpressed', () =>
        {
            this.forearmPressed = false
        })

        // Debug
        this.gamepad.inputs.buttonOptions.on('pressed', () =>
        {
            this.trigger('debugPressed')
        })
    }

    setKeyboard()
    {
        this.keyboard = new Keyboard()

        this.keyboard.on('pressed', (_name) =>
        {
            // Already pressed
            if(this[_name])
            {
                return
            }

            this.goMode('keyboard')

            this[_name] = true
            this.trigger(_name)
        })

        this.keyboard.on('unpressed', (_name) =>
        {
            // Already unpressed
            if(!this[_name])
            {
                return
            }
            
            this[_name] = false
        })
    }

    update()
    {
        this.gamepad.update()

        if(this.mode === 'gamepad')
        {
            this.clampPressure = this.gamepad.inputs.buttonR2.pressure

            this.torsoOrientation.x = this.gamepad.inputs.joystickLeft.x
            this.torsoOrientation.y = this.gamepad.inputs.joystickLeft.y
        }
        else if(this.mode === 'keyboard')
        {
            // Clamps
            if(this.clampPressed)
                this.clampPressure += 0.003 * this.time.delta
            else
                this.clampPressure -= 0.003 * this.time.delta

            this.clampPressure = Math.min(Math.max(this.clampPressure, 0), 1)

            // Torso
            if(this.torsoLeftPressed)
                this.torsoOrientation.x -= 0.004 * this.time.delta
            if(this.torsoRightPressed)
                this.torsoOrientation.x += 0.004 * this.time.delta

            if(!this.torsoLeftPressed && !this.torsoLeftPressed)
            {
                this.torsoOrientation.x *= 0.95
            }

            this.torsoOrientation.x = Math.min(Math.max(this.torsoOrientation.x, - 1 ), 1)

            if(this.torsoUpPressed)
                this.torsoOrientation.y -= 0.004 * this.time.delta
            if(this.torsoDownPressed)
                this.torsoOrientation.y += 0.004 * this.time.delta

            if(!this.torsoUpPressed && !this.torsoDownPressed)
            {
                this.torsoOrientation.y *= 0.95
            }

            this.torsoOrientation.y = Math.min(Math.max(this.torsoOrientation.y, - 1), 1)
        }
    }
}