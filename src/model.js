import * as THREE from "three"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, SplitText)


    // -------------------------Spliting Text-------------------------
    const header1Split = new SplitText(".text-head-1 h1", {
        type: "chars",
        charsClass: "chars"
    })
    const titleSplit = new SplitText(".tooltip-layer .title h2", {
        type: "lines",
        linesClass: "line"
    })
    const descriptionSplit = new SplitText(".tooltip-layer .description p", {
        type: "lines",
        linesClass: "line"
    })


    // -------------------------Converting Splited Text Into Span Blocks-------------------------
    if (titleSplit.lines && descriptionSplit.lines) {
        [...titleSplit.lines, ...descriptionSplit.lines].forEach(line => {
            line.innerHTML = `<span>${line.innerHTML}</span>`
        })
    }


    // -------------------------Const Variable For Reusing Animation-------------------------
    const animOptions = { duration: 1, ease: "power3.out", stagger: 0.025 }
    const tooltipSelector = [
        {
            trigger: 0.65,
            elements: [
                ".tooltip-layer:nth-child(1) .icon ion-icon",
                ".tooltip-layer:nth-child(1) .title .line > span",
                ".tooltip-layer:nth-child(1) .description .line > span"
            ],
        },
        {
            trigger: 0.85,
            elements: [
                ".tooltip-layer:nth-child(2) .icon ion-icon",
                ".tooltip-layer:nth-child(2) .title .line > span",
                ".tooltip-layer:nth-child(2) .description .line > span"
            ],
        },
    ]


    //-------------------------Animating Model & Text-------------------------
    gsap.to(".text-head-1 h1 .chars", {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".sec-3",
            start: "top top",
            end: "bottom center",
            scrub: 2,
        }
    });

    const sec3Timeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".sec-3",
            start: "top top",
            end: `+=${window.innerHeight * 4}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
        }
    });

    ScrollTrigger.create({
        trigger: ".sec-3",
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        scrub: 1,
        onUpdate: (self) => {
            if (!activeAction) return

            const clip = activeAction.getClip()
            activeAction.time = clip.duration * self.progress
            mixer.update(0)
        }
    })

    sec3Timeline.to(".text-head-1", {
        xPercent: -70,
        ease: "none"
    }, "<");

    sec3Timeline.to(".circular-mask", {
        clipPath: "circle(100% at 50% 50%)",
        ease: "power2.out"
    }, ">");

    sec3Timeline.addLabel("modelReveal", "-=0.5");

    sec3Timeline.from(".text-head-2 h1", {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "modelReveal");

    sec3Timeline.fromTo(".model-container",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, ease: "power2.out" },
        "modelReveal");


    // ------------------ Reverse effect at the end ------------------
    sec3Timeline.to(".circular-mask", {
        clipPath: "circle(0% at 50% 50%)",
        ease: "power2.out"
    }, ">");

    sec3Timeline.to(".text-head-2 h1", {
        scale: 0.5,
        opacity: 0,
        ease: "power2.in"
    }, "<");


    // -------------------------THREE JS-------------------------
    // Declaring Some Early Model Variables 
    let model
    let modelSize
    let mixer
    let actions = []
    let activeAction
    let currentRotation = 0


    // -------------------------Clock-------------------------
    const clock = new THREE.Clock()

    // -------------------------Scene-------------------------
    const scene = new THREE.Scene()

    // -------------------------Camera-------------------------
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)

    // -------------------------Renderer-------------------------
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.LinearEncoding
    renderer.toneMapping = THREE.NoToneMapping
    renderer.toneMappingExposure = 1.0
    document.querySelector(".model-container").appendChild(renderer.domElement)

    // -------------------------Lights-------------------------
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    // Directional Light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0)
    mainLight.position.set(1, 2, 3)
    mainLight.castShadow = true
    mainLight.shadow.bias = -0.001
    mainLight.shadow.mapSize.width = 1024
    mainLight.shadow.mapSize.height = 1024
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
    fillLight.position.set(-2, 0, -2)
    scene.add(fillLight)

    // -------------------------Model-------------------------
    function setupModel() {
        if (!model || !modelSize) return

        // Making Model Positining Based On Screen Size
        const isUnderWidth = window.innerWidth < 768
        const isMobile = window.innerWidth < 990
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())

        // Making Model Rotation Based On Screen Size
        // ------------------- Position -------------------
        // X position
        let posX = -center.x - modelSize.x * 0.4;
        if (isMobile) posX = center.x * -0.2;
        if (isUnderWidth) posX = 0;

        // Y position
        const posY = -center.y + modelSize.y * 0.085;

        // Z position
        const posZ = -center.z;

        model.position.set(posX, posY, posZ);
        // Checking Screen Size And Setting Camera Position Based On It
        const cameraDistance = isMobile ? 2 : 1.5
        camera.position.set(0, 1, Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance)
        camera.lookAt(0, 0, 0)
    }

    // -------------------------GLTF Loader-------------------------
    new GLTFLoader().load("/model/autonomous_robot_sweeper.glb", (gltf) => {
        model = gltf.scene

        model.traverse((node) => {
            if (node.isMesh && node.material) {
                Object.assign(node.material, {
                    metalness: 1.1,
                    roughness: 0
                })
            }
        })

        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        modelSize = size

        scene.add(model)
        setupModel()

        // Gsap Timeline Rotation For Model
        const isUnderWidthForRotation = window.innerWidth < 768;
        const rotationAmount = isUnderWidthForRotation ? Math.PI * 2.2 : Math.PI * 2.3;
        sec3Timeline.to(model.rotation, {
            y: "+=" + rotationAmount,
            ease: "power2.out"
        }, "modelReveal");

        // Model Animations
        mixer = new THREE.AnimationMixer(model)

        if (gltf.animations.length > 0) {
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip)
                action.play()
                actions.push(action)
            })
            activeAction = actions[0]
        } else {
            console.warn("No animations found in gltf.animations")
        }

    })

    // -------------------------Animation Function-------------------------
    function animate() {
        requestAnimationFrame(animate)
        const delta = clock.getDelta()
        if (mixer) mixer.update(delta)
        renderer.render(scene, camera)
    }
    animate()

    // -------------------------Resize------------------------- 
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        setupModel()
    })

    
})
