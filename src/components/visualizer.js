import createLoop from 'canvas-loop'
import dat from 'dat-gui'
var OBJLoader = require('three-obj-loader')
OBJLoader(THREE)
const obj = 'static/obj/soulection_logo3.obj'
export default function (audiosource) {
  const canvas = document.querySelector('canvas')
  canvas.addEventListener('touchstart', (ev) => ev.preventDefault())
  canvas.addEventListener('contextmenu', (ev) => ev.preventDefault())

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    devicePixelRatio: window.devicePixelRatio
  })

  // renderer.setClearColor(0x97c2c5, 1)
  renderer.setClearColor(0x000000, 1)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100)
  camera.position.set(0, 0, 50)

  function createMesh (geometry) {
    var material = new THREE.MeshLambertMaterial({color: 0xFFFFFF, wireframe: true})
    return new THREE.Mesh(geometry, material)
  }

  var logo = new THREE.Object3D()
  var loader = new THREE.OBJLoader()
  loader.load(obj, function (object) { // Function when resource is loaded
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshLambertMaterial({color: 0xffffff})
      }
    })

    /* object.position.x = -15;
    object.position.y = -15;
    object.position.z = 0; */
    object.scale.set(0.05, 0.05, 0.05)
    object.children[0].name = 'extrude'
    object.children[1].name = 'faceA'
    object.children[2].name = 'faceB'
    console.log(object)
    var edges = new THREE.EdgesGeometry(object.children[2].geometry, 0xffffff)
    // var edgeLine = new MeshLine()
    // edgeLine.setGeometry(edges)
    // var meshEdge = new THREE.Mesh(edgeLine.geometry, new MeshLineMaterial({linewidth: 5}))

    var edgeLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 20 }))
    var edges2 = new THREE.EdgesGeometry(object.children[1].geometry)
    var edgeLine2 = new THREE.LineSegments(edges2, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 20 }))
    edgeLine2.material.linewidth = 20
    object.name = 'logo'
    var edgesObj = new THREE.Object3D()
    edgesObj.scale.set(0.05, 0.05, 0.05)

    edgesObj.add(edgeLine)
    edgesObj.add(edgeLine2)
    logo.add(edgesObj)
    // console.log(scene.getObjectByName('faceA').material)
  })

  scene.add(logo)
  console.log(scene)
  /* logo.position.x=0;
  logo.position.y=0;
  logo.position.z=0; */

    // position and point the camera to the center of the scene

  var ambientLight = new THREE.AmbientLight(0x0c0c0c)
  scene.add(ambientLight)
  var spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(0, 0, 50)
  spotLight.castShadow = true
  scene.add(spotLight)
    // add the output of the renderer to the html element

  camera.lookAt(logo)
  createApp()

  function createApp (material) {
  // console.log(controls.rotationSpeed);
    const app = createLoop(canvas, { scale: renderer.devicePixelRatio })
    .start()
    .on('tick', render)
    .on('resize', resize)

    function resize () {
      var [ width, height ] = app.shape
      camera.aspect = width / height
      renderer.setSize(width, height, false)
      camera.updateProjectionMatrix()
      render()
    }
    function render () {
      logo.scale.x = 0.5 + audiosource.volume / 10000
      logo.scale.y = 0.5 + audiosource.volume / 10000
      logo.scale.z = 0.5 + audiosource.volume / 10000
      logo.rotation.y += 0.01
      // console.log(audiosource.bass );
      if (audiosource.bass > 120 && scene.getObjectByName('faceA')) {
        scene.getObjectByName('faceA').material.color = new THREE.Color(0x928B61)
        scene.getObjectByName('extrude').material.color = new THREE.Color(0x928B61)
        scene.getObjectByName('faceB').material.color = new THREE.Color(0x928B61)
        console.log('ok')
      } else if (scene.getObjectByName('faceA')) {
        scene.getObjectByName('faceA').material.color = new THREE.Color(0xFFFFFF)
        scene.getObjectByName('extrude').material.color = new THREE.Color(0xFFFFFF)
        scene.getObjectByName('faceB').material.color = new THREE.Color(0xFFFFFF)
      }
      // material.uniforms.animate = controls.rotationSpeed;
      renderer.render(scene, camera)
    }

    resize()
  }
}
