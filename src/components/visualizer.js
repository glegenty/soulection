import createLoop from 'canvas-loop'
import dat from 'dat-gui'
import Logo from './logo'
import Bloom from './bloom'
var OBJLoader = require('three-obj-loader')
OBJLoader(THREE)
// const obj = 'static/obj/soulection_logo_sub2.obj'
const obj = 'static/obj/six2_center_sub.obj'
const clock = new THREE.Clock()
const fragment = require('shaders/logoFrag.glsl')
const vertex = require('shaders/logoVert.glsl')

export default function (audiosource) {
  const canvas = document.querySelector('canvas')
  canvas.addEventListener('touchstart', (ev) => ev.preventDefault())
  canvas.addEventListener('contextmenu', (ev) => ev.preventDefault())

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    devicePixelRatio: window.devicePixelRatio
  })
  const rendererBase = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
  const bloom = new Bloom(rendererBase.texture)

  // renderer.setClearColor(0xf1f1e5, 1)
  renderer.setClearColor(0x000000, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100)
  camera.position.set(0, 0, 50)

  var uniforms = {
    time: {
      type: 'f',
      value: 0
    },
    resolution: {
      type: 'v2',
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }
  }
  var logo = new THREE.Object3D()
  // var logoMesh = new Logo({time: 2, container: logo})
  var loader = new THREE.OBJLoader()
  var logoGeo = new THREE.Geometry()
  var logoMesh
  loader.load(obj, function (object) {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshLambertMaterial({color: 0x6799be})
        var childGeo = new THREE.Geometry().fromBufferGeometry(child.geometry)
        console.log(child.geometry)
        logoGeo.merge(childGeo, child.matrix)
      }
    })
    // object.scale.set(0.05, 0.05, 0.05)
    // object.children[0].name = 'extrude'
    // object.children[1].name = 'faceA'
    // object.children[2].name = 'faceB'
    console.log(logoGeo)
    var logoBufferGeo = new THREE.BufferGeometry().fromGeometry(logoGeo)
    var logoMesh = new THREE.Mesh(logoGeo, new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    }))
    logoMesh.scale.set(0.05, 0.05, 0.05)
    logo.add(logoMesh)
  })
  // console.log(logoMesh.mesh)
  // logo.add(logoMesh.mesh)
  scene.add(logo)
  console.log(scene)

  var ambientLight = new THREE.AmbientLight(0x545454)

  scene.add(ambientLight)
  var spotLight = new THREE.SpotLight(0xDADADA)
  spotLight.position.set(0, 0, 50)
  spotLight.castShadow = true
  scene.add(spotLight)
    // add the output of the renderer to the html element

  const gui = new dat.GUI()
  const groupBright = gui.addFolder('bright')
  const groupLogo = gui.addFolder('logo')
  const controller = {
    blurCount: groupBright.add(bloom, 'blurCount', 1, 10).name('blur count').step(1),
    minBright: groupBright.add(bloom.plane.bright, 'minBright', 0, 1).name('min bright'),
    strength: groupBright.add(bloom.plane.bloom, 'strength', 0, 5).name('bright strength'),
    tone: groupBright.add(bloom.plane.bloom, 'tone', 0, 1).name('original tone')
  }
  controller.minBright.onChange((value) => {
    bloom.plane.bright.uniforms.minBright.value = value
  })
  controller.strength.onChange((value) => {
    bloom.plane.bloom.uniforms.strength.value = value
  })
  controller.tone.onChange((value) => {
    bloom.plane.bloom.uniforms.tone.value = value
  })
  groupBright.open()
  groupLogo.open()

  camera.lookAt(logo)
  createApp(logo)

  function createApp (logo, material) {
    // console.log(controls.rotationSpeed);
    const app = createLoop(canvas, { scale: renderer.devicePixelRatio })
      .start()
      .on('tick', render)
      .on('resize', resize)

    function resize () {
      var [ width, height ] = app.shape
      camera.aspect = width / height
      renderer.setSize(width, height, false)
      bloom.resize()
      camera.updateProjectionMatrix()
      render()
    }

    function render () {
      // console.log(logoMesh.mesh)
      logo.scale.x = 1 + audiosource.volume / 10000
      logo.scale.y = 1 + audiosource.volume / 10000
      logo.scale.z = 1 + audiosource.volume / 10000
      // logo.rotation.y = 7.85;
      if (logo.rotation.y > 1.56 && logo.rotation.y < 4.70) {
      // console.log('turn');
        logo.rotation.y = 4.71
      } else if (logo.rotation.y >= 7.85) {
        logo.rotation.y = 1.57
      }
      logo.rotation.y += 0.005
      // console.log(logo.rotation.y);
      // console.log(audiosource.bass );
      if (audiosource.bass > 120 && scene.getObjectByName('faceA')) {
        scene.getObjectByName('faceA').material.color = new THREE.Color(0x928B61)
        scene.getObjectByName('extrude').material.color = new THREE.Color(0x928B61)
        scene.getObjectByName('faceB').material.color = new THREE.Color(0x928B61)
        // console.log('Mid');
      } else if (scene.getObjectByName('faceA')) {
        scene.getObjectByName('faceA').material.color = new THREE.Color(0x6799be)
        scene.getObjectByName('extrude').material.color = new THREE.Color(0x6799be)
        scene.getObjectByName('faceB').material.color = new THREE.Color(0x6799be)
      }
      // material.uniforms.animate = controls.rotationSpeed;
      uniforms.time.value += clock.getDelta() * 1.5
      // renderer.render(scene, camera)
      renderer.render(scene, camera, rendererBase)
      bloom.render(renderer)
    }

    resize()
  }
}
