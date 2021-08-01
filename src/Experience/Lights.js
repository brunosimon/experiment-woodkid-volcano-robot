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
        this.pointLight.instance.shadow.mapSize.set(1024, 1024)
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
        this.spot = {}
        this.spot.color = '#ffffff'

        // Instance
        this.spot.instance = new THREE.SpotLight(0xffffff, 260, 0, 1, 1, 2)
        this.spot.instance.position.y = - 2.5
        this.spot.instance.position.z = 8
        this.spot.instance.castShadow = true
        this.spot.instance.shadow.mapSize.set(1024 * 4, 1024 * 4)
        this.scene.add(this.spot.instance)

        // Instance
        this.spot.helper = new THREE.SpotLightHelper(this.spot.instance)
        this.spot.helper.visible = false
        this.scene.add(this.spot.helper)

        // Debug
        const debugFolder = this.debugFolder.addFolder({
            title: 'spotLight',
            expanded: false,
        })

        debugFolder
            .addInput(
                this.spot.helper,
                'visible',
                { label: 'helperVisible' }
            )

        debugFolder
            .addInput(
                this.spot,
                'color',
                { view: 'color' }
            )
            .on('change', () =>
            {
                this.spot.instance.color.set(this.spot.color)
            })

        debugFolder
            .addInput(
                this.spot.instance,
                'intensity',
                { min: 0, max: 500 }
            )

        debugFolder
            .addInput(
                this.spot.instance,
                'angle',
                { min: 0, max: Math.PI * 0.5 }
            )
            .on('change', () =>
            {
                this.spot.helper.update()
            })

        debugFolder
            .addInput(
                this.spot.instance,
                'penumbra',
                { min: 0, max: 1 }
            )

        debugFolder
            .addInput(
                this.spot.instance,
                'decay',
                { min: 0, max: 10 }
            )

        debugFolder
            .addInput(
                this.spot.instance.position,
                'y',
                { min: - 5, max: 5 }
            )
            .on('change', () =>
            {
                this.spot.instance.lookAt(new THREE.Vector3())
            })

        debugFolder
            .addInput(
                this.spot.instance.position,
                'z',
                { min: - 20, max: 20 }
            )
    }
}