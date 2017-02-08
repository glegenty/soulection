const fragment = require('shaders/bloom/gaussian_blur2.fs')
const vertex = require('shaders/bloom/gaussian_blur.vs')
export default class PlaneBlur {
  constructor (texture, direction) {
    this.uniforms = null
    this.texture = texture
    this.direction = direction
    this.mesh = this.createMesh()
  }
  createMesh () {
    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth / 10, window.innerHeight / 10)
      },
      direction: {
        type: 'v2',
        value: this.direction
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
  resize () {
    this.uniforms.resolution.value.set(window.innerWidth / 10, window.innerHeight / 10)
  }
}
