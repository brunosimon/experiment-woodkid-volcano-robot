export default class Presets
{
    constructor()
    {
        this.experience = window.experience
        this.config = this.experience.config
        this.resources = this.experience.resources
        this.gamepad = this.experience.gamepad
        this.world = this.experience.world
        
        this.ready = false

        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.ready = true
                this.apply(1)
            }
        })

        this.gamepad.inputs.buttonUp.on('pressed', () =>
        {
            this.apply(0)
        })

        this.gamepad.inputs.buttonRight.on('pressed', () =>
        {
            this.apply(1)
        })

        this.gamepad.inputs.buttonDown.on('pressed', () =>
        {
            this.apply(2)
        })

        this.gamepad.inputs.buttonLeft.on('pressed', () =>
        {
            this.apply(3)
        })

        this.items = [
            {
                backgroundColorA: '#1c1c1c',
                backgroundColorB: '#000000',

                robotColor: '#666666',
                robotRoughness: 1,
                robotMetalness: 0,

                pointLightColor: '#ffffff',
                pointLightIntensity: 50,
                pointLightDecay: 2,
                pointLightY: 5,
                pointLightZ: 3.5,

                pointSpotLightColor: '#ffffff',
                pointSpotLightIntensity: 260,
                pointSpotLightDecay: 2,
                pointSpotLightZ: 8,
            },
            {
                backgroundColorA: '#1c0000',
                backgroundColorB: '#ff0000',

                robotColor: '#ff6666',
                robotRoughness: 1,
                robotMetalness: 0,

                pointLightColor: '#ff0000',
                pointLightIntensity: 50,
                pointLightDecay: 2,
                pointLightY: 5,
                pointLightZ: 3.5,

                spotLightColor: '#ff0000',
                spotLightIntensity: 260,
                spotLightDecay: 2,
                spotLightZ: 8,
            },
        ]
    }

    apply(_index)
    {
        const presetItem = this.items[_index]

        this.world.background.material.uniforms.uColorA.value.set(presetItem.backgroundColorA)
        this.world.background.material.uniforms.uColorB.value.set(presetItem.backgroundColorB)

        this.world.robot.material.color.set(presetItem.robotColor)
        this.world.robot.material.roughness = presetItem.robotRoughness
        this.world.robot.material.metalness = presetItem.robotMetalness

        this.world.lights.pointLight.instance.color.set(presetItem.pointLightColor)
        this.world.lights.pointLight.instance.intensity = presetItem.pointLightIntensity
        this.world.lights.pointLight.instance.decay = presetItem.pointLightDecay
        this.world.lights.pointLight.instance.position.y = presetItem.pointLightY
        this.world.lights.pointLight.instance.position.z = presetItem.pointLightZ

        this.world.lights.spotLight.instance.color.set(presetItem.spotLightColor)
        this.world.lights.spotLight.instance.intensity = presetItem.spotLightIntensity
        this.world.lights.spotLight.instance.decay = presetItem.spotLightDecay
        this.world.lights.spotLight.instance.position.z = presetItem.spotLightZ
    }
}