import Background from './Background.js'
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

        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setBackground()
                this.setRobot()
                this.setLights()
            }
        })
    }

    setBackground()
    {
        this.background = new Background()
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

        if(this.lights)
            this.lights.update()
    }

    destroy()
    {
    }
}