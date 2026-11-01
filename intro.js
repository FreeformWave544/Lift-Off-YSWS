import * as THREE from 'three'
import gsap from 'gsap'
import { HDRLoader, TextGeometry } from 'three/addons/Addons.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Scene, Vector2 } from 'three/webgpu'
import { and, viewport } from 'three/tsl'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const fontLoader = new FontLoader()
const logoTexture = textureLoader.load('/RUNIC_PFP.png')
logoTexture.colorSpace = THREE.SRGBColorSpace

const cursor = {
    x: 0,
    y: 0
}

const sizes = {
    width: innerWidth,
    height: innerHeight
}

const camera = new THREE.PerspectiveCamera(
    60,
    sizes.width / sizes.height,
    0.1,
    1000
)

camera.position.z = 5

scene.add(camera)

// const controls = new OrbitControls(
//     camera,
//     canvas
// )

// controls.mouseButtons.LEFT = null
// controls.enableDamping = true
// controls.enablePan = false
// controls.minDistance = 3.2
// controls.maxDistance = 50

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(2, 3, 4)
scene.add(directionalLight)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

renderer.setSize(
    sizes.width,
    sizes.height
)

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
)

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

window.addEventListener('resize', () =>
{
    sizes.width = innerWidth
    sizes.height = innerHeight

    camera.aspect =
    sizes.width / sizes.height
    
    camera.updateProjectionMatrix()
    
    renderer.setSize(
        sizes.width,
        sizes.height
    )
    
    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    )
})

var clickDetector = window.addEventListener('click', (click) => {
    window.removeEventListener('click', clickDetector)
    for (let i = 0; i < 500; i++ ) {
        const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
        setTimeout(() => {
            spinSpeed += 0.2;
            // if (i == 499) { 
            //     spinSpeed = 0.5
            //     intro()
            // }
        }, i * 15);
    }
})

const intro = () => {
    for (let i = 0; i < 500; i++ ) {
        const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
        spinSpeed = 0.0;
        setTimeout(() => {
            logo.scale.x += 0.00005 * i;
            logo.scale.y += 0.00005 * i;
            logo.rotation.x *= 0.9; logo.rotation.y *= 0.9; logo.rotation.z *= 0.9;
            if (i == 499) {
                document.getElementById("continue").classList.remove("hidden")
            }
        }, i * 15);
    }
}


const scrollIndicator = document.querySelector('#scroll-indicator')

const material = new THREE.MeshPhongMaterial({
    map: logoTexture,
    shininess: 70,
    specular: new THREE.Color('#faa8a8'),
    side: THREE.DoubleSide
})

const logo = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0, 1, 1), material)

const droneLoader = new GLTFLoader();
let drone = null
droneLoader.load('./Drone/Drone.glb', (gltf) => {
    drone = gltf.scene
    drone.scale.set(5, 5, 5)
    scene.add(drone)
})

let count = 1.0
window.addEventListener('wheel', (event) => { scrollStuff(event) })
window.addEventListener('touchmove', (event) => { scrollStuff(event) })

function scrollStuff(event) {
    count -= 0.2
    document.getElementById('scrollPrompt').style.opacity = count
    console.log(count)
    if (count < 0.05) {
        window.location.replace('./pages/main')
    }
}

const clock = new THREE.Timer()
var spinSpeed = 1.0
let parallaxSpeed = 1.0
let direction = new Vector2(1.0, 1.0)
const tick = (timestamp) =>
{
    clock.update(timestamp)
    const delta = clock.getDelta()
    const elapsed = clock.getElapsed()
    if (drone) {
        spinSpeed = Math.max((spinSpeed - (0.1 * delta * (1 + (spinSpeed)))), 5.0)
        drone.position.y += (0.1 * delta * 25) * direction.y
        drone.position.x += (0.1 * delta * 25) * direction.x
        if (drone.position.clone().project(camera).y >= 0.9) {
            direction.y = -1
        }
        if (drone.position.clone().project(camera).y <= -0.9) {
            direction.y = 1
        }
        
        if (drone.position.clone().project(camera).x >= 0.9) {
            direction.x = -1
        }
        if (drone.position.clone().project(camera).x <= -0.9) {
            direction.x = 1
        }
    }
    if (drone && spinSpeed != 1.0) {
        drone.rotation.y = 0.1 * elapsed * spinSpeed
        drone.rotation.x = -0.15 * elapsed * spinSpeed
    }
    const parallaxX = cursor.x * 0.5
    const parallaxY = cursor.y * 0.5
    camera.position.x += (parallaxX - camera.position.x) * 5 * delta * parallaxSpeed
    camera.position.y += (-parallaxY - camera.position.y) * 5 * delta * parallaxSpeed
    // controls.update()
    renderer.render(
        scene,
        camera
    )
    window.requestAnimationFrame(tick)
}

tick()