// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

//     gsap.registerPlugin(ScrollTrigger)

//     const cardContainer = document.querySelector(".img-card-container")
//     const sec5Header = document.querySelector(".sec-5-header h2")

//     let isGapAnimationCompleted = false
//     let isFlipAnimationCompleted = false

//     function initAnimation() {

//         const mm = gsap.matchMedia()
        
//         mm.add("(max-width: 990px)", () => {
//             document.querySelectorAll(".img-card, .img-card-container, .sec-5-header")
//             .forEach((el) => (el.style = ""))
//             return {}
//         })

//         mm.add("(min-width: 991px)", () => {
//             ScrollTrigger.create({
//                 trigger: ".sec-5-wrapper",
//                 start: "top top",
//                 end: `+=${window.innerHeight * 4}px`,
//                 pin: ".sec-5",
//                 scrub: true,
//                 markers: true,
//                 pinSpacing: true,
//                 anticipatePin: 1
//             })
//         })
//     }
//     initAnimation()

//     let resizeTimer;
//     window.addEventListener("resize" , () => {
//         clearTimeout(resizeTimer)
//         resizeTimer = setTimeout(() => {
//             initAnimation()
//         }, 250)
//     })
