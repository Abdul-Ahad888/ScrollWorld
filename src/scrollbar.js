import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

// Animate thumb based on scroll
const thumb = document.querySelector(".thumb");
const track = document.querySelector(".scrollbar");

const maxY = () => track.offsetHeight - thumb.offsetHeight;

// Sync thumb with scroll
const updateThumb = () => {
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    thumb.style.transform = `translateY(${scrollProgress * maxY()}px)`;
};

updateThumb()

ScrollTrigger.create({  
    start: 0,
    end: "max",
    onUpdate: updateThumb,
});

// For Dragging ScrollBar Thumb
Draggable.create(thumb, {
    type: "y",
    bounds: track,
    onDrag() {
        // Calculate scroll based on thumb position
        const progress = this.y / maxY();
        const scrollY = progress * (document.body.scrollHeight - window.innerHeight);
        window.scrollTo(0, scrollY);
    }
});

// Recalculate on resize
window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});
