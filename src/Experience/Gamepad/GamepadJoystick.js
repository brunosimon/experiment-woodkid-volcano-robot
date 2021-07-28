import EventEmitter from '../Utils/EventEmitter.js'

export default class GamepadButton extends EventEmitter
{
    constructor(_index, _name, _precision = Infinity, _minDistance = 0.1)
    {
        super()

        // Options
        this.index = _index
        this.name = _name
        this.precision = _precision
        this.minDistance = _minDistance

        // Setup
        this.type = 'joystick'
        this.x = 0
        this.y = 0
        this.distance = 0
        this.rotation = 0
        this.relevant = false
    }

    update(_gamepadState)
    {
        const x = _gamepadState.axes[this.index * 2 + 0]
        const y = _gamepadState.axes[this.index * 2 + 1]
        const distance = Math.hypot(x, y)
        const rotation = distance < this.minDistance ? null : Math.atan2(- x, y)

        // Distance from center is to low to get relevant values
        if(distance < this.minDistance)
        {
            if(this.relevant)
            {
                this.relevant = false

                // Reset values
                this.x = 0
                this.y = 0
                this.distance = 0

                // Trigger
                this.trigger('ended', [this.index, this.name])
            }

            return
        }
        
        if(!this.relevant)
        {
            this.relevant = true

            // Trigger
            this.trigger('started', [this.index, this.name])
        }

        if(this.precision !== Infinity)
        {
            const fixedX = parseFloat(x.toFixed(this.precision))
            const fixedY = parseFloat(y.toFixed(this.precision))
            const fixedDistance = parseFloat(distance.toFixed(this.precision))
            const fixedRotation = parseFloat(rotation.toFixed(this.precision))

            if(
                fixedX !== this.x ||
                fixedY !== this.y ||
                fixedDistance !== this.distance ||
                fixedRotation !== this.rotation
            )
            {
                this.x = fixedX
                this.y = fixedY
                this.distance = fixedDistance
                this.rotation = fixedRotation

                // Trigger
                this.trigger('changed', [this.index, this.name, this.x, this.y, this.distance, this.rotation])
            }
        }
        else
        {
            this.x = x
            this.y = y
            this.distance = distance
            this.rotation = rotation
        }
    }
}