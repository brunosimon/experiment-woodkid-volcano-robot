import EventEmitter from '../Utils/EventEmitter.js'

export default class GamepadButton extends EventEmitter
{
    constructor(_index, _name, _hasPressure)
    {
        super()

        // Options
        this.index = _index
        this.name = _name
        this.hasPressure = _hasPressure

        // Setup
        this.type = 'button'
        this.pressed = false

        if(this.hasPressure)
            this.pressure = 0
    }

    update(_gamepadState)
    {
        const buttonState = _gamepadState.buttons[this.index]

        if(buttonState.pressed)
        {
            if(!this.pressed)
            {
                this.pressed = true
                this.trigger('pressed', [this.index, this.name])
            }

            if(this.hasPressure)
            {
                this.pressure = buttonState.value
                this.trigger('pressureChanged', [this.index, this.name, buttonState.value])
            }
        }
        else
        {
            if(this.pressed)
            {
                this.pressed = false
                this.trigger('unpressed', [this.index, this.name])


                if(this.hasPressure)
                {
                    this.pressure = 0
                }
            }
        }
    }
}