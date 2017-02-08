const fragment = require('shaders/bloom/bright.fs')
const vertex = require('shaders/bloom/bright.vs')
export default class PlaneBright {
  constructor (texture) {
    this.uniforms = null
    this.minBright = 0.02
    this.texture = texture
    this.mesh = this.createMesh()
  }
  createMesh () {
    this.uniforms = {
      minBright: {
        type: 'f',
        value: this.minBright
      },
      texture: {
        type: 't',
        value: this.texture
      }
    }
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vertex,
        fragmentShader: fragment
      })
    )
  }
}
