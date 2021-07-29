import * as THREE from 'three'

export default class Lights
{
    constructor()
    {
        this.experience = window.experience
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        
        // Debug
        this.debugFolder = this.debug.addFolder({
            title: 'lights',
            expanded: true,
        })

        // this.setAmbientLight()
        this.setPointLight()
    }

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1000)
        this.scene.add(this.ambientLight)
    }

    setPointLight()
    {
        // Setup
        this.pointLight = {}
        this.pointLight.color = '#ffffff'

        // Instance
        this.pointLight.instance = new THREE.PointLight(0xffffff, 100, 0, 2)
        this.pointLight.instance.position.y = 2
        this.pointLight.instance.position.z = 5.5
        this.pointLight.instance.castShadow = true
        this.pointLight.instance.shadow.mapSize.set(1024, 1024)
        this.scene.add(this.pointLight.instance)

        // Debug
        const debugFolder = this.debugFolder.addFolder({
            title: 'pointLight',
            expanded: true,
        })

        debugFolder
            .addInput(
                this.pointLight,
                'color',
                { view: 'color' }
            )
            .on('change', () =>
            {
                this.pointLight.instance.color.set(this.pointLight.color)
            })

        debugFolder
            .addInput(
                this.pointLight.instance,
                'intensity',
                { min: 0, max: 200 }
            )

        debugFolder
            .addInput(
                this.pointLight.instance,
                'decay',
                { min: 0, max: 10 }
            )

        debugFolder
            .addInput(
                this.pointLight.instance.position,
                'z',
                { min: 0, max: 10 }
            )
    }
}