import Robot from './Robot.js'
import Lights from './Lights.js'

export default class World
{
    constructor(_options)
    {
        this.experience = window.experience
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.gamepad = this.experience.gamepad

        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setRobot()
                this.setLights()
            }
        })
    }

    setRobot()
    {
        this.robot = new Robot()    
    }

    setLights()
    {
        this.lights = new Lights()
    }

    resize()
    {
    }

    update()
    {
        if(this.robot)
            this.robot.update()
    }

    destroy()
    {
    }
}