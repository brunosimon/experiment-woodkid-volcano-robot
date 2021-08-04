import Gamepad from './Gamepad/Gamepad.js'
import EventEmitter from './Utils/EventEmitter.js'
import Keyboard from './Keyboard/Keyboard.js'

export default class Controls extends EventEmitter
{
    constructor()
    {
        super()

        this.mode = 'gamepad'

        this.shoulderPressed = false
        this.upperArmPressed = false
        this.elbowPressed = false
        this.forearmPressed = false

        this.clampPressure = 0
        this.torsoOrientation = { x: 0, y: 0 }

        this.setGamepad()
        this.setKeyboard()
    }

    setGamepad()
    {
        this.gamepad = new Gamepad()

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
    }

    setKeyboard()
    {
        this.keyboard = new Keyboard()

        this.keyboard.on('pressed', (_name) =>
        {
            this[_name] = true
            this.trigger(_name)
        })

        this.keyboard.on('unpressed', (_name) =>
        {
            this[_name] = false
            this.trigger(_name)
        })
    }

    update()
    {
        if(this.mode === 'gamepad')
        {
            this.gamepad.update()
    
            this.clampPressure = this.gamepad.inputs.buttonR2.pressure

            this.torsoOrientation.x = this.gamepad.inputs.joystickLeft.x
            this.torsoOrientation.y = this.gamepad.inputs.joystickLeft.y
        }
    }
}