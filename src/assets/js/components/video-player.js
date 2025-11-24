/**
 * A minimal <video-player> component
 *
 * - works with any service using an iframe (Vimeo, Youtube, etc.)
 * - progressively enhances a link wrapped around an image into an iframe
 */
class videoPlayer extends HTMLElement {
    constructor() {
      super();
    }
  
    /**
     * Create iframe element
     *
     * @param {string} srcUrl - iframe source URL
     * @returns iframe DOM node
     */
    createIframe(srcUrl) {
      const iframeEl = document.createElement("iframe");
  
      iframeEl.src = srcUrl;
      iframeEl.allowFullscreen = true;
      iframeEl.style.aspectRatio = "16 / 9";
      iframeEl.style.width = "100%";
      iframeEl.style.height = "100%";
  
      return iframeEl;
    }
  
    /**
     * Initiated when component is loaded in the DOM
     *
     * @returns void
     */
    connectedCallback() {
      // get variables / DOM elements we need
      const iframeSrc = this.dataset.iframeSrc ?? "";
      const videoLink = this.querySelector("a");
  
      // check variables are there
      if (!iframeSrc || !videoLink) return;
  
      // create iframe
      const iframeEl = this.createIframe(iframeSrc);
  
      // click handler
      videoLink.addEventListener("click", (event) => {
        event.preventDefault();
        videoLink.replaceWith(iframeEl);
      });
    }
  }
  
  customElements.define("video-player", videoPlayer);
  