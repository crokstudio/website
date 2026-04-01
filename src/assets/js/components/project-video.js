const projectVideos = document.querySelectorAll(".project--section-video-media:not([poster])");

projectVideos.forEach((video) => {
    let hasLoadedPreview = false;

    const loadFirstFrame = () => {
        if (hasLoadedPreview) {
            return;
        }

        hasLoadedPreview = true;

        const previewTime = video.duration && Number.isFinite(video.duration)
            ? Math.min(0.001, video.duration)
            : 0.001;

        video.currentTime = previewTime;
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        loadFirstFrame();
    } else {
        video.addEventListener("loadedmetadata", loadFirstFrame, { once: true });
    }
});
