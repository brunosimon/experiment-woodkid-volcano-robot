import './interface.styl'

export default class GamepadInterface
{
    constructor(_inputs)
    {
        this.inputs = _inputs

        this.elements = {}
        this.elements.container = document.createElement('div')
        this.elements.container.classList.add('gamepad-interface')
        // document.body.append(this.elements.container)

        this.setInputs()
    }

    activate()
    {
        document.body.append(this.elements.container)
    }

    deactivate()
    {
        document.body.removeChild(this.elements.container)
    }

    setInputs()
    {
        for(const _input of this.inputs.all)
        {
            // Element
            const inputElement = document.createElement('div')
            inputElement.classList.add('input', `is-${_input.name}`, `is-${_input.type}`)
            this.elements.container.appendChild(inputElement)

            // Is button
            if(_input.type === 'button')
            {
                // Fill element
                const fillElement = document.createElement('div')
                fillElement.classList.add('fill')
                inputElement.appendChild(fillElement)
    
                // Listen to events and update the DOM
                _input.on('pressed', () =>
                {
                    inputElement.classList.add('is-active')
                })
    
                _input.on('unpressed', () =>
                {
                    inputElement.classList.remove('is-active')
                })
    
                if(_input.hasPressure)
                {
                    _input.on('pressureChanged', (_index, _name, _value) =>
                    {
                        fillElement.style.transform = `scaleY(${_value})`
                    })
                }
            }

            // Is joystick
            if(_input.type === 'joystick')
            {
                // Tip element
                const tipElement = document.createElement('div')
                tipElement.classList.add('tip')
                inputElement.appendChild(tipElement)

                // Listen to events and update the DOM
                _input.on('changed', (_index, _name, _x, _y, _distance, _rotation) =>
                {
                    const x = _x * 50
                    const y = _y * 50

                    tipElement.style.transform = `translate(${x}%, ${y}%)`
                })

                _input.on('ended', () =>
                {
                    tipElement.style.transform = null
                })
            }
        }
    }
}