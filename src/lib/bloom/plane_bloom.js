const fragment = require('shaders/bloom/bloom.fs')
const vertex = require('shaders/bloom/bloom.vs')
export default class PlaneBloom {
  constructor (texBase, texBlur) {
    this.uniforms = null
    this.tone = 1
    this.strength = 2.5
    this.texBase = texBase
    this.texBlur = texBlur
    this.mesh = this.createMesh()
  }
  createMesh () {
    this.uniforms = {
      tone: {
        type: 'f',
        value: this.tone
      },
      strength: {
        type: 'f',
        value: this.strength
      },
      texBase: {
        type: 't',
        value: this.texBase
      },
      texBlur: {
        type: 't',
        value: this.texBlur
      }
    }
    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vertex,
        fragmentShader: fragment
      })
    )
    mesh.frustumCulled = true
    return mesh
  }
}
