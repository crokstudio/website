const cursor = document.querySelector(".cursor");

if (cursor) {
    const state = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2,
    };
    window.addEventListener("mousemove", (event) => {
        state.targetX = event.clientX;
        state.targetY = event.clientY;
    });

    const render = () => {
        state.x += (state.targetX - state.x) * 0.18;
        state.y += (state.targetY - state.y) * 0.18;

        cursor.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`;
        window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);
}
