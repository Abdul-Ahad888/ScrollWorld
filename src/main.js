import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import './animate'
import './model'
import './cursor'
import './animateImage'
import './mouse'
import './scrollbar'
import './loader'

// -------------------------EventListener DomContentLoaded To Run JavaScript After Page Loads-------------------------
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger)


  // -------------------------Lenis Page Scroll-------------------------
  const lenis = new Lenis({
    duration: 1.2,
    smooth: true
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Scroll to top on page load using Lenis
  lenis.scrollTo(0, { immediate: true });

  // reset on full page reload
  window.onbeforeunload = () => {
    lenis.scrollTo(0, { immediate: true });
  };


  // -------------------------Some Variable Declarations-------------------------
  const nav = document.querySelector("nav")
  const header = document.querySelector(".header")
  const heroImg = document.querySelector(".hero-img")
  const canvas = document.getElementById("canvas")


  // -------------------------2D Canvas Context-------------------------
  const context = canvas.getContext("2d")


  // -------------------------Canvas Size For Screen-------------------------
  const setCanvasSize = () => {
    const pixelRatio = window.devicePixelRatio || 2
    canvas.width = window.innerWidth * pixelRatio
    canvas.height = window.innerHeight * pixelRatio
    canvas.style.width = window.innerWidth + "px"
    canvas.style.height = window.innerHeight + "px"
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.scale(pixelRatio, pixelRatio)
  }
  setCanvasSize()
  window.addEventListener('resize', () => {
    setCanvasSize()
    render()
  })


  // -------------------------Image Frames-------------------------
  const frameCount = 243
  const currentFrame = (index) =>
    `/assets/frames/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.webp`


  // -------------------------Some Image Frames Variables-------------------------
  let images = []
  let videoFrames = { frame: 0 }
  let imagesToLoad = frameCount

  const onLoad = () => {
    imagesToLoad--
    if (imagesToLoad === 0) {
      render()
      if (typeof setupScrollTrigger === 'function') setupScrollTrigger()
    }
  }


  // -------------------------For Loop For Image Frames-------------------------
  for (let i = 0; i < frameCount; i++) {
    const img = new window.Image()
    img.onload = onLoad
    img.onerror = onLoad
    img.src = currentFrame(i)
    images.push(img)
  }


  // -------------------------Render Canvas-------------------------
  let lastFrame = -1

  const render = () => {
    if (videoFrames.frame === lastFrame) return
    lastFrame = videoFrames.frame

    const canvasWidth = window.innerWidth
    const canvasHeight = window.innerHeight

    context.clearRect(0, 0, canvasWidth, canvasHeight)


    // -------------------------Drawing And Calculating Canvas / Image Height & Width-------------------------
    const img = images[videoFrames.frame]
    if (!img || !img.complete) return
    const imageAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = canvasWidth / canvasHeight

    let drawWidth, drawHeight, drawX, drawY

    if (imageAspect > canvasAspect) {
      drawHeight = canvasHeight
      drawWidth = drawHeight * imageAspect
      drawX = (canvasWidth - drawWidth) / 2
      drawY = 0
    } else {
      drawWidth = canvasWidth
      drawHeight = drawWidth / imageAspect
      drawX = 0
      drawY = (canvasHeight - drawHeight) / 2
    }

    context.drawImage(img, drawX, drawY, drawWidth, drawHeight)
  }


  // -------------------------Scroll Trigger GSAP Animation-------------------------
  const setupScrollTrigger = () => {
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: `+=100%`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress
        const animationProgress = Math.min(progress / 1.1, 1)
        const targetFrame = Math.round(animationProgress * (frameCount - 1))
        videoFrames.frame = targetFrame
        render()


        // -------------------------Turning Opacity Of Navbar From 1 To 0 Based On Scroll-------------------------
        if (progress <= 0.01) {
          const navProgress = progress / 0.01
          const opacity = 1 - navProgress
          gsap.set(nav, { opacity, display: "flex" })
        } else {
          gsap.set(nav, { opacity: 0, display: "none" })
        }

        if (progress <= 0.25) {
          const zProgress = progress / 0.25
          const translateZ = zProgress * -500

          let opacity = 1
          if (progress >= 0.2) {
            const fadeProgress = Math.min((progress - 0.2) / (0.25 - 0.2), 1)
            opacity = 1 - fadeProgress
          }

          gsap.set(header, {
            transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
            opacity
          })

        } else {
          gsap.set(header, {
            opacity: 0
          })
        }

      }
    })
  }


  // -------------------------Expose render so ScrollTrigger/etc can call it if needed (optional)-------------------------
  window.__frameRender = render

})