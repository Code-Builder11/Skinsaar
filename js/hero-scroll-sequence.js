/**
 * Skinsaar Luxury Hero Scroll-Triggered Image Sequence
 * 
 * Vanilla JavaScript implementation for high-performance canvas scrubbing of 300 sequential frames.
 * Zero external framework dependencies — drop-in ready for static HTML and PHP templates.
 */

(function (window, document) {
    'use strict';

    class HeroScrollSequence {
        constructor(options = {}) {
            // Configuration options with sensible defaults
            this.config = Object.assign({
                containerSelector: '#hero-scroll-container',
                canvasSelector: '#hero-sequence-canvas',
                loaderSelector: '#hero-sequence-loader',
                progressBarSelector: '#hero-sequence-progress',
                progressTextSelector: '#hero-sequence-percent',
                fallbackSelector: '#hero-fallback-image',
                overlayPrefix: 'hero-stage-',
                frameCount: 300,
                priorityCount: 24, // Priority frames loaded first for instant interaction
                frameStepMobile: 1, // Full fidelity on mobile or 2 if bandwidth-saving needed
                imagePathPattern: (index) => `hero-sequence/ezgif-frame-${String(index).padStart(3, '0')}.jpg`,
                stages: [
                    { id: '1', min: 0.00, max: 0.32, enter: 0.00, leave: 0.29 },
                    { id: '2', min: 0.33, max: 0.65, enter: 0.33, leave: 0.62 },
                    { id: '3', min: 0.66, max: 1.00, enter: 0.66, leave: 0.98 }
                ]
            }, options);

            this.container = document.querySelector(this.config.containerSelector);
            this.canvas = document.querySelector(this.config.canvasSelector);
            this.loader = document.querySelector(this.config.loaderSelector);
            this.progressBar = document.querySelector(this.config.progressBarSelector);
            this.progressText = document.querySelector(this.config.progressTextSelector);
            this.fallback = document.querySelector(this.config.fallbackSelector);

            if (!this.container || !this.canvas) {
                console.warn('[HeroScrollSequence] Required elements not found. Operating in fallback mode.');
                return;
            }

            this.ctx = this.canvas.getContext('2d', { alpha: false });
            this.images = new Array(this.config.frameCount + 1);
            this.loadedFrames = new Set();
            this.loadingQueue = [];
            this.isBackgroundLoading = false;
            
            this.currentFrame = -1;
            this.targetFrame = 1;
            this.lastRenderedFrame = -1;
            this.scrollProgress = 0;
            this.isTicking = false;
            this.isResizing = false;
            this.isInitialBufferReady = false;
            this.isMobile = window.innerWidth < 768;

            this.init();
        }

        init() {
            // Setup canvas size
            this.updateCanvasDimensions();

            // Bind resize & scroll handlers
            window.addEventListener('resize', this.onResize.bind(this), { passive: true });
            window.addEventListener('orientationchange', this.onResize.bind(this), { passive: true });
            window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

            // Initialize image preloading pipeline
            this.startPreloadPipeline();

            // Set initial state
            this.onScroll();
        }

        /**
         * Update canvas dimensions taking devicePixelRatio into account for ultra-crisp Retina rendering
         */
        updateCanvasDimensions() {
            if (!this.canvas) return;

            const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
            const width = Math.max(rect.width, window.innerWidth);
            const height = Math.max(rect.height, window.innerHeight);
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance balance

            this.canvasWidth = width;
            this.canvasHeight = height;

            this.canvas.width = Math.round(width * dpr);
            this.canvas.height = Math.round(height * dpr);
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;

            if (this.ctx) {
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.imageSmoothingQuality = 'high';
            }

            // Force redraw on next frame
            this.lastRenderedFrame = -1;
            this.requestRender();
        }

        onResize() {
            if (this.isResizing) return;
            this.isResizing = true;

            window.requestAnimationFrame(() => {
                this.isMobile = window.innerWidth < 768;
                this.updateCanvasDimensions();
                this.onScroll();
                this.isResizing = false;
            });
        }

        /**
         * Progressive preloading pipeline:
         * 1. Loads first priorityCount frames (e.g. 1-24) synchronously to ensure instant interactivity.
         * 2. Yields main thread and uses requestIdleCallback to stream the remaining frames in chunks.
         */
        startPreloadPipeline() {
            const total = this.config.frameCount;
            const priority = Math.min(this.config.priorityCount, total);

            let priorityLoaded = 0;

            const onPriorityFrameLoaded = (index) => {
                priorityLoaded++;
                const pct = Math.round((priorityLoaded / priority) * 100);
                this.updateLoaderUI(pct, false);

                // Render frame 1 immediately as soon as it loads
                if (index === 1 && this.lastRenderedFrame === -1) {
                    this.renderFrame(1);
                }

                // When priority buffer is filled, dismiss loader and begin background stream
                if (priorityLoaded >= priority && !this.isInitialBufferReady) {
                    this.isInitialBufferReady = true;
                    this.updateLoaderUI(100, true);
                    this.requestRender();
                    this.startBackgroundLoading(priority + 1);
                }
            };

            // Load priority frames (1 to priority)
            for (let i = 1; i <= priority; i++) {
                this.loadImage(i, () => onPriorityFrameLoaded(i));
            }
        }

        /**
         * Loads a single frame into memory
         */
        loadImage(index, callback) {
            if (this.images[index]) {
                if (callback) callback(index);
                return;
            }

            const img = new Image();
            img.decoding = 'async';
            img.src = this.config.imagePathPattern(index);

            img.onload = () => {
                this.images[index] = img;
                this.loadedFrames.add(index);
                if (callback) callback(index);
            };

            img.onerror = () => {
                console.warn(`[HeroScrollSequence] Failed to load frame ${index}`);
                if (callback) callback(index);
            };
        }

        /**
         * Background queue using requestIdleCallback / throttled chunks
         */
        startBackgroundLoading(startIndex) {
            for (let i = startIndex; i <= this.config.frameCount; i++) {
                this.loadingQueue.push(i);
            }

            const processQueue = (deadline) => {
                while (this.loadingQueue.length > 0 && ((deadline && deadline.timeRemaining() > 3) || !deadline)) {
                    const nextIndex = this.loadingQueue.shift();
                    if (nextIndex) {
                        this.loadImage(nextIndex, () => {
                            // If current scrub target was waiting for this frame, render it
                            if (this.targetFrame === nextIndex) {
                                this.requestRender();
                            }
                        });
                    }
                    if (!deadline) break;
                }

                if (this.loadingQueue.length > 0) {
                    if ('requestIdleCallback' in window) {
                        window.requestIdleCallback(processQueue, { timeout: 1000 });
                    } else {
                        setTimeout(() => processQueue(), 25);
                    }
                }
            };

            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(processQueue, { timeout: 1000 });
            } else {
                setTimeout(() => processQueue(), 25);
            }
        }

        /**
         * Update loading indicator in DOM
         */
        updateLoaderUI(percent, isComplete) {
            if (this.progressBar) {
                this.progressBar.style.width = `${percent}%`;
            }
            if (this.progressText) {
                this.progressText.textContent = `${percent}%`;
            }

            if (isComplete && this.loader) {
                this.loader.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    if (this.loader) this.loader.style.display = 'none';
                }, 500);
            }
        }

        /**
         * Scroll event handler throttled with requestAnimationFrame
         */
        onScroll() {
            if (!this.isTicking) {
                window.requestAnimationFrame(() => {
                    this.calculateScroll();
                    this.isTicking = false;
                });
                this.isTicking = true;
            }
        }

        /**
         * Calculate scroll progress within hero container
         */
        calculateScroll() {
            if (!this.container) return;

            const rect = this.container.getBoundingClientRect();
            const scrollableDistance = rect.height - window.innerHeight;

            if (scrollableDistance <= 0) return;

            // Calculate progress (0.0 at top, 1.0 at bottom of hero section)
            const rawProgress = -rect.top / scrollableDistance;
            const progress = Math.max(0, Math.min(1, rawProgress));
            this.scrollProgress = progress;

            // Map progress to target frame index (1 to totalFrames)
            const target = Math.min(
                this.config.frameCount,
                Math.max(1, Math.floor(progress * (this.config.frameCount - 1)) + 1)
            );

            this.targetFrame = target;
            this.updateOverlays(progress);
            this.requestRender();
        }

        /**
         * Smart frame renderer: draws nearest loaded frame if exact target is still buffering
         */
        requestRender() {
            if (this.targetFrame === this.lastRenderedFrame && !this.isResizing) {
                return; // Prevent redundant redraws
            }

            this.renderFrame(this.targetFrame);
        }

        /**
         * Find nearest loaded frame to guarantee butter-smooth scrub without blank flashes
         */
        getNearestLoadedImage(targetIndex) {
            if (this.images[targetIndex]) {
                return { img: this.images[targetIndex], index: targetIndex };
            }

            // Search outwards from targetIndex
            let offset = 1;
            while (offset < this.config.frameCount) {
                const prev = targetIndex - offset;
                const next = targetIndex + offset;

                if (prev >= 1 && this.images[prev]) {
                    return { img: this.images[prev], index: prev };
                }
                if (next <= this.config.frameCount && this.images[next]) {
                    return { img: this.images[next], index: next };
                }
                offset++;
            }

            return null;
        }

        /**
         * Render frame to canvas with aspect-cover centering
         */
        renderFrame(frameIndex) {
            if (!this.ctx || !this.canvas) return;

            const match = this.getNearestLoadedImage(frameIndex);
            if (!match || !match.img) return;

            const img = match.img;
            const cw = this.canvas.width;
            const ch = this.canvas.height;

            const imgW = img.naturalWidth || img.width || 1920;
            const imgH = img.naturalHeight || img.height || 1080;

            const imgRatio = imgW / imgH;
            const canvasRatio = cw / ch;

            let dw, dh, dx, dy;

            if (canvasRatio > imgRatio) {
                // Screen is wider than 16:9
                dw = cw;
                dh = cw / imgRatio;
                dx = 0;
                dy = (ch - dh) / 2;
            } else {
                // Screen is taller than 16:9 (e.g. mobile portrait)
                dh = ch;
                dw = ch * imgRatio;
                dx = (cw - dw) / 2;
                dy = 0;
            }

            // Fast high-DPI canvas draw
            this.ctx.drawImage(img, dx, dy, dw, dh);
            this.lastRenderedFrame = frameIndex;
        }

        /**
         * Updates phase-based text overlays matching story beats
         */
        updateOverlays(progress) {
            const stages = this.config.stages;

            stages.forEach(stage => {
                const el = document.getElementById(`${this.config.overlayPrefix}${stage.id}`);
                if (!el) return;

                const isActive = progress >= stage.enter && progress <= stage.leave;

                if (isActive) {
                    el.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4', 'scale-95');
                    el.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0', 'scale-100');
                } else {
                    el.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0', 'scale-100');
                    el.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4', 'scale-95');
                }
            });
        }
    }

    // Export to global scope
    window.HeroScrollSequence = HeroScrollSequence;

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.skinsaarHero = new HeroScrollSequence();
        });
    } else {
        window.skinsaarHero = new HeroScrollSequence();
    }

})(window, document);
