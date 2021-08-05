import * as THREE from 'three'
import vertexShader from './shaders/Background/vertex.glsl'
import fragmentShader from './shaders/Background/fragment.glsl'

export default class Background
{
    constructor()
    {
        this.experience = window.experience
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        
        // Debug
        this.debugFolder = this.debug.addFolder({
            title: 'background',
            expanded: false,
        })

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    }

    setMaterial()
    {
        this.colorA = '#1c1c1c'
        this.colorB = '#000000'

        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            depthTest: false,
            uniforms:
            {
                uColorA: { value: new THREE.Color(this.colorA) },
                uColorB: { value: new THREE.Color(this.colorB) },
                uOffset: { value: 0 },
                uMultiplier: { value: 1 },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })

        // Debug
        this.debugFolder
            .addInput(
                this,
                'colorA',
                { view: 'color' }
            )
            .on('change', () =>
            {
                this.material.uniforms.uColorA.value.set(this.colorA)
            })

        this.debugFolder
            .addInput(
                this,
                'colorB',
                { view: 'color' }
            )
            .on('change', () =>
            {
                this.material.uniforms.uColorB.value.set(this.colorB)
            })

        this.debugFolder
            .addInput(
                this.material.uniforms.uOffset,
                'value',
                { label: 'uOffset', min: - 1, max: 1 }
            )

        this.debugFolder
            .addInput(
                this.material.uniforms.uMultiplier,
                'value',
                { label: 'uMultiplier', min: 0, max: 5 }
            )
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.frustumCulled = false
        this.scene.add(this.mesh)
    }
}