const fs = require('fs')
import createLoop from 'canvas-loop'
import dat from 'dat-gui'
var OBJLoader = require('three-obj-loader')
OBJLoader(THREE)
console.log(OBJLoader)
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

  renderer.setClearColor(0x97c2c5, 1)
  // renderer.setClearColor(0x000000, 1);
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
        // var edges = new THREE.EdgesHelper( child, 0x000000 );
        // scene.add(edges);
      }
    })

    /* object.position.x = -15;
    object.position.y = -15;
    object.position.z = 0; */
    object.scale.set(0.05, 0.05, 0.05)
    object.children[0].name = 'extrude'
    object.children[1].name = 'faceA'
    object.children[2].name = 'faceB'
    var edges = new THREE.EdgesHelper(object.children[2], 0x000000)
    var edges2 = new THREE.EdgesHelper(object.children[1], 0x000000)
    // edges.scale.set(0.05, 0.05, 0.05)
    // edges2.scale.set(0.05, 0.05, 0.05)
    object.name = 'logo'

    object.add(edges)
    object.add(edges2)
    logo.add(object)
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
  /*
  var controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
  };
  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0.0, 0.5);
  gui.add(controls, 'bouncingSpeed', 0.0, 0.5);
*/
/*
    var controls = new function () {

            this.amount = 2;
            this.bevelThickness = 2;
            this.bevelSize = 0.5;
            this.bevelEnabled = true;
            this.bevelSegments = 3;
            this.bevelEnabled = true;
            this.curveSegments = 12;
            this.steps = 1;

            this.asGeom = function () {
                // remove the old plane
                scene.remove(logo);
                // create a new one

                var options = {
                    amount: controls.amount,
                    bevelThickness: controls.bevelThickness,
                    bevelSize: controls.bevelSize,
                    bevelSegments: controls.bevelSegments,
                    bevelEnabled: controls.bevelEnabled,
                    curveSegments: controls.curveSegments,
                    steps: controls.steps
                };

                logo = createMesh(new THREE.ExtrudeGeometry(geometry, options));
                // add it to the scene.
                scene.add(logo);
            };

        };

        var gui = new dat.GUI();
        gui.add(controls, 'amount', 0, 20).onChange(controls.asGeom);
        gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.asGeom);
        gui.add(controls, 'bevelSize', 0, 10).onChange(controls.asGeom);
        gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.asGeom);
        gui.add(controls, 'bevelEnabled').onChange(controls.asGeom);
        gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.asGeom);
        gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.asGeom);

        controls.asGeom();
*/
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
