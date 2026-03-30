const cursor = document.querySelector(".cursor");
const CURSOR_POSITION_STORAGE_KEY = "mate-cursor-position";

/* Disable default cursor in all forms and for all elements */
const allElements = document.querySelectorAll('*');
allElements.forEach(el => {
  el.style.cursor = "none";
});

window.addEventListener("DOMContentLoaded", () => {
    document.body.style.cursor = "none";
});

if (cursor) {
    const savedPosition = sessionStorage.getItem(CURSOR_POSITION_STORAGE_KEY);
    const parsedPosition = savedPosition ? JSON.parse(savedPosition) : null;
    const hasSavedPosition = Number.isFinite(parsedPosition?.x) && Number.isFinite(parsedPosition?.y);

    const state = {
        x: hasSavedPosition ? parsedPosition.x : 0,
        y: hasSavedPosition ? parsedPosition.y : 0,
        targetX: hasSavedPosition ? parsedPosition.x : 0,
        targetY: hasSavedPosition ? parsedPosition.y : 0,
        scaleX: 1,
        scaleY: 1,
        targetScaleX: 1,
        targetScaleY: 1,
        isVisible: hasSavedPosition,
        color: "#ffffff",
    };

    const updateHoverState = (event, nextScaleX, nextScaleY) => {
        if (event.target.closest("a") || event.target.closest("button") || event.target.closest("label") || event.target.closest("input") || event.target.closest("textarea")) {
            state.targetScaleX = nextScaleX;
            state.targetScaleY = nextScaleY;
            /*
            state.color = nextScale === 0.75 ? "#2DE1B0" : "#ffffff";
            */
        }
    };

    const syncPointerPosition = (event) => {
        state.targetX = event.clientX;
        state.targetY = event.clientY;
        state.isVisible = true;

        sessionStorage.setItem(
            CURSOR_POSITION_STORAGE_KEY,
            JSON.stringify({
                x: event.clientX,
                y: event.clientY,
            }),
        );
    };

    window.addEventListener("pointermove", syncPointerPosition);

    document.addEventListener("pointerenter", (event) => {
        syncPointerPosition(event);
    });

    document.addEventListener("pointerleave", () => {
        state.isVisible = false;
    });

    document.addEventListener("pointerover", (event) => {
        updateHoverState(event, 0.45, 0.45);
    });

    document.addEventListener("pointerout", (event) => {
        updateHoverState(event, 1, 1);
    });

    const render = () => {
        state.x += (state.targetX - state.x) * 0.35;
        state.y += (state.targetY - state.y) * 0.35;
        state.scaleX += (state.targetScaleX - state.scaleX) * 0.35;
        state.scaleY += (state.targetScaleY - state.scaleY) * 0.35;

        cursor.classList.toggle("cursor--visible", state.isVisible);
        cursor.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%) scaleX(${state.scaleX}) scaleY(${state.scaleY})`;
        cursor.style.backgroundColor = state.color;
        window.requestAnimationFrame(render);
    };

    if (state.isVisible) {
        cursor.classList.add("cursor--visible");
        cursor.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%) scaleX(${state.scaleX}) scaleY(${state.scaleY})`;
    }

    window.requestAnimationFrame(render);
}
