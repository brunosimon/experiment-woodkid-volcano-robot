import * as THREE from 'three'

export default class Lights
{
    constructor()
    {
        this.experience = window.experience
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.time = this.experience.time
        
        // Debug
        this.debugFolder = this.debug.addFolder({
            title: 'lights',
            expanded: false,
        })

        this.setPointLight()
        this.setSpotLight()
    }

    setPointLight()
    {
        // Setup
        this.pointLight = {}
        this.pointLight.color = '#ffffff'

        // Instance
        this.pointLight.instance = new THREE.PointLight(0xffffff, 50, 0, 2)
        this.pointLight.instance.position.y = 5
        this.pointLight.instance.position.z = 3.5
        // this.pointLight.instance.castShadow = true
        // this.pointLight.instance.shadow.mapSize.set(1024, 1024)
        this.scene.add(this.pointLight.instance)

        // Debug
        const debugFolder = this.debugFolder.addFolder({
            title: 'pointLight',
            expanded: false,
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
                'y',
                { min: - 10, max: 10 }
            )

        debugFolder
            .addInput(
                this.pointLight.instance.position,
                'z',
                { min: - 20, max: 20 }
            )
    }

    setSpotLight()
    {
        // Setup
        this.spotLight = {}
        this.spotLight.color = '#ffffff'

        // Instance
        this.spotLight.instance = new THREE.SpotLight(0xffffff, 260, 0, 1, 1, 2)
        this.spotLight.instance.position.z = 8
        this.spotLight.instance.castShadow = true
        this.spotLight.instance.shadow.mapSize.set(1024 * 4, 1024 * 4)
        this.scene.add(this.spotLight.instance)

        // Instance
        this.spotLight.helper = new THREE.SpotLightHelper(this.spotLight.instance)
        this.spotLight.helper.visible = false
        this.scene.add(this.spotLight.helper)

        // Debug
        const debugFolder = this.debugFolder.addFolder({
            title: 'spotLight',
            expanded: false,
        })

        debugFolder
            .addInput(
                this.spotLight.helper,
                'visible',
                { label: 'helperVisible' }
            )

        debugFolder
            .addInput(
                this.spotLight,
                'color',
                { view: 'color' }
            )
            .on('change', () =>
            {
                this.spotLight.instance.color.set(this.spotLight.color)
            })

        debugFolder
            .addInput(
                this.spotLight.instance,
                'intensity',
                { min: 0, max: 500 }
            )

        debugFolder
            .addInput(
                this.spotLight.instance,
                'angle',
                { min: 0, max: Math.PI * 0.5 }
            )
            .on('change', () =>
            {
                this.spotLight.helper.update()
            })

        debugFolder
            .addInput(
                this.spotLight.instance,
                'penumbra',
                { min: 0, max: 1 }
            )

        debugFolder
            .addInput(
                this.spotLight.instance,
                'decay',
                { min: 0, max: 10 }
            )

        debugFolder
            .addInput(
                this.spotLight.instance.position,
                'z',
                { min: - 20, max: 20 }
            )
    }

    update()
    {
        this.spotLight.instance.position.y = Math.sin(this.time.elapsed * 0.0004) * 5
    }
}