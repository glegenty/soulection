import PlaneBright from 'lib/bloom/plane_bright'
import PlaneBlur from 'lib/bloom/plane_blur'
import PlaneBloom from 'lib/bloom/plane_bloom'
import fxaa from 'three-shader-fxaa'

export default class Bloom {
  constructor (texBase) {
    this.blurCount = 6
    this.renderTarget = [
      new THREE.WebGLRenderTarget(window.innerWidth / 4, window.innerHeight / 4),
      new THREE.WebGLRenderTarget(window.innerWidth / 4, window.innerHeight / 4)
    ]
    this.scene = {
      bright: new THREE.Scene(),
      blurh: new THREE.Scene(),
      blurv: new THREE.Scene(),
      bloom: new THREE.Scene(),
      fxaa: new THREE.Scene()
    }
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 2)
    this.plane = {
      bright: new PlaneBright(texBase),
      blurh: new PlaneBlur(this.renderTarget[0].texture, new THREE.Vector2(1.0, 0.0)),
      blurv: new PlaneBlur(this.renderTarget[1].texture, new THREE.Vector2(0.0, 1.0)),
      bloom: new PlaneBloom(texBase, this.renderTarget[0].texture),
      fxaa: {mesh: this.planeFXAA()}
    }
    this.init()
  }
  init () {
    this.scene.bright.add(this.plane.bright.mesh)
    this.scene.blurh.add(this.plane.blurh.mesh)
    this.scene.blurv.add(this.plane.blurv.mesh)
    this.scene.bloom.add(this.plane.bloom.mesh)
    this.scene.fxaa.add(this.plane.fxaa.mesh)
  }
  planeFXAA () {
    return new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.ShaderMaterial(fxaa({tDiffuse: this.renderTarget[0].texture})))
  }

  render (renderer) {
    renderer.render(this.scene.bright, this.camera, this.renderTarget[0])
    for (var i = 0; i < this.blurCount; i++) {
      renderer.render(this.scene.blurh, this.camera, this.renderTarget[1])
      renderer.render(this.scene.blurv, this.camera, this.renderTarget[0])
    }
    renderer.render(this.scene.fxaa, this.camera, this.renderTarget[1])
    renderer.render(this.scene.bloom, this.camera)
  }
  resize () {
    this.renderTarget[0].setSize(window.innerWidth / 4, window.innerHeight / 4)
    this.renderTarget[1].setSize(window.innerWidth / 4, window.innerHeight / 4)
    this.plane.blurh.resize()
    this.plane.blurv.resize()
  }
}
