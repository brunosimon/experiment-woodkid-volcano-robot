import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import finalPassVertexShader from './shaders/FinalPass/vertex.glsl'
import finalPassFragmentShader from './shaders/FinalPass/fragment.glsl'

export default class Renderer
{
    constructor(_options = {})
    {
        this.experience = window.experience
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        
        this.usePostprocess = true

        // Debug
        this.debugFolder = this.debug.addFolder({
            title: 'renderer',
            expanded: false,
        })

        this.debugFolder
            .addInput(
                this,
                'usePostprocess'
            )

        this.setInstance()
        this.setPostProcess()
    }

    setInstance()
    {
        this.clearColor = '#000000'

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.physicallyCorrectLights = true
        this.instance.gammaOutPut = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.shadowMap.enabled = true
        this.instance.toneMapping = THREE.NoToneMapping
        // this.instance.toneMappingExposure = 2.3

        this.context = this.instance.getContext()

        // Add stats panel
        if(this.stats)
        {
            this.stats.setRenderPanel(this.context)
        }

        // Debug
        this.debugFolder
            .addInput(
                this,
                'clearColor',
                { view: 'color' }
            )
            .on('change', () =>
            {
                this.instance.setClearColor(this.clearColor, 1)
            })

        this.debugFolder
            .addInput(
                this.instance,
                'toneMapping',
                {
                    view: 'list',
                    label: 'toneMapping',
                    options:
                    [
                        { text: 'No', value: THREE.NoToneMapping },,
                        { text: 'Linear', value: THREE.LinearToneMapping },,
                        { text: 'Reinhard', value: THREE.ReinhardToneMapping },
                        { text: 'Cineon', value: THREE.CineonToneMapping },
                        { text: 'ACESFilmic', value: THREE.ACESFilmicToneMapping },
                    ]
                }
            )
            .on('change', (_value) =>
            {
                this.scene.traverse((_child) =>
                {
                    if(_child instanceof THREE.Mesh)
                    {
                        _child.material.needsUpdate = true
                    }
                })
            })

        this.debugFolder
            .addInput(
                this.instance,
                'toneMappingExposure',
                {
                    min: 0, max: 5
                }
            )
    }

    setPostProcess()
    {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Unreal Bloom pass
         */
        this.postProcess.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height), 1.5, 0.4, 0.85)
        this.postProcess.unrealBloomPass.enabled = false

        this.debugFolder
            .addInput(
                this.postProcess.unrealBloomPass,
                'enabled',
                { label: 'unrealBloomPassEnabled' }
            )

        this.debugFolder
            .addInput(
                this.postProcess.unrealBloomPass,
                'threshold',
                { label: 'unrealBloomPassThreshold', min: 0, max: 1 }
            )

        this.debugFolder
            .addInput(
                this.postProcess.unrealBloomPass,
                'strength',
                { label: 'unrealBloomPassStrength', min: 0, max: 3 }
            )

        this.debugFolder
            .addInput(
                this.postProcess.unrealBloomPass,
                'radius',
                { label: 'unrealBloomPassRadius', min: 0, max: 1 }
            )

        /**
         * Final pass
         */
        this.postProcess.finalPass = new ShaderPass({
            uniforms:
            {
                tDiffuse: { value: null },
                uNoiseMultiplier: { value: 0.02 },
                uNoiseOffset: { value: - 0.15 },
                uRGBShiftMultiplier: { value: 0.004 },
                uRGBShiftOffset: { value: 0.04 },
            },
            vertexShader: finalPassVertexShader,
            fragmentShader: finalPassFragmentShader
        })

        this.debugFolder
            .addInput(
                this.postProcess.finalPass.uniforms.uNoiseMultiplier,
                'value',
                { label: 'uNoiseMultiplier', min: 0, max: 0.05 }
            )

        this.debugFolder
            .addInput(
                this.postProcess.finalPass.uniforms.uNoiseOffset,
                'value',
                { label: 'uNoiseOffset', min: - 1, max: 1 }
            )

        this.debugFolder
            .addInput(
                this.postProcess.finalPass.uniforms.uRGBShiftMultiplier,
                'value',
                { label: 'uRGBShiftMultiplier', min: 0, max: 0.05 }
            )

        this.debugFolder
            .addInput(
                this.postProcess.finalPass.uniforms.uRGBShiftOffset,
                'value',
                { label: 'uRGBShiftOffset', min: - 1, max: 1 }
            )

        /**
         * Effect composer
         */
        const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget
        // const RenderTargetClass = THREE.WebGLRenderTarget
        this.renderTarget = new RenderTargetClass(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                encoding: THREE.sRGBEncoding
            }
        )
        this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.postProcess.composer.addPass(this.postProcess.renderPass)
        this.postProcess.composer.addPass(this.postProcess.finalPass)
        this.postProcess.composer.addPass(this.postProcess.unrealBloomPass)
    }

    resize()
    {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    }

    update()
    {
        if(this.stats)
        {
            this.stats.beforeRender()
        }

        if(this.usePostprocess)
        {
            this.postProcess.composer.render()
        }
        else
        {
            this.instance.render(this.scene, this.camera.instance)
        }

        if(this.stats)
        {
            this.stats.afterRender()
        }
    }

    destroy()
    {
        this.instance.renderLists.dispose()
        this.instance.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}