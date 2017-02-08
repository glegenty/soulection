var OBJLoader = require('three-obj-loader')
OBJLoader(THREE)
const fragment = require('shaders/logoFrag.glsl')
const vertex = require('shaders/logoVert.glsl')

export default class Logo {
  constructor (opts) {
    this.time = opts.time
    this.container = opts.container
    this.uniforms = null
    this.mesh = null
    this.ObjPath = 'static/obj/soulection_logo3.obj'
    this.bufferGeometry = null
    console.log('LOGO CONSTRUCT')
    this.init()
    console.log('LOGO CONSTRUCTED')
  }

  init () {
    console.log('LOGO INIT START')
    this.getGeometryFromObj().then(this.createMesh.bind(this))
  }

  getGeometryFromObj () {
    return new Promise((resolve, reject) => {
      const loader = new THREE.OBJLoader()
      var logoGeo = new THREE.Geometry()
      var geo = null
      loader.load(this.ObjPath, (object) => {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            logoGeo.merge(new THREE.Geometry().fromBufferGeometry(child.geometry), child.matrix)
          }
        })
      })
      this.bufferGeometry = new THREE.BufferGeometry().fromGeometry(logoGeo)
      console.log('LOGO GEO LOADED')
      resolve()
    })
  }

  createMesh () {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      }
    }
    console.log(this.bufferGeometry)
    this.mesh = new THREE.Mesh(
      this.bufferGeometry,
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
      })
    )
    this.mesh.scale.set(0.05, 0.05, 0.05)
    this.container.add(this.mesh)
  }

}
