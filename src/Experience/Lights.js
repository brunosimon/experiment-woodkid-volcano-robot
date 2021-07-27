import * as THREE from 'three'

export default class Lights
{
    constructor()
    {
        this.experience = window.experience
        this.scene = this.experience.scene
        
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
        this.pointLight = new THREE.PointLight(0xffffff, 20, 0, 2)
        this.pointLight.position.z = 4
        this.scene.add(this.pointLight)
    }
}