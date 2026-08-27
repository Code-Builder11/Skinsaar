<!-- ==========================================================================
     SKINSAAR LUXURY HERO: SCROLL-TRIGGERED 300-FRAME IMAGE SEQUENCE
     Drop-in Partial for PHP / HTML Templates
========================================================================== -->

<!-- Hero Section Scoped Styles (Can also be linked from assets/css/hero-scroll.css) -->
<style>
    #hero-scroll-container {
        position: relative;
        height: 350vh;
        background-color: #FAF6EF;
    }
    @media (min-width: 640px) {
        #hero-scroll-container {
            height: 400vh;
        }
    }
    .hero-sticky-frame {
        position: sticky;
        top: 0;
        height: 100vh;
        width: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #FAF6EF;
    }
    #hero-sequence-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
        display: block;
    }
</style>

<section id="hero-scroll-container" class="relative bg-[#FAF6EF] text-[#1D1D1F]" data-sequence-path="assets/hero-sequence/">
    
    <!-- Sticky Full Viewport Frame -->
    <div class="hero-sticky-frame sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#FAF6EF]">
        
        <!-- Canvas Element Rendering 300 Sequential Frames -->
        <canvas id="hero-sequence-canvas" class="absolute inset-0 w-full h-full object-cover z-0"></canvas>

        <!-- Subtle Luxury Vignette for Contrast & Text Legibility -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#FAF6EF]/80 via-transparent to-[#FAF6EF]/40 pointer-events-none z-10"></div>

        <!-- ======================================================
             STAGE 1 (Scroll 0% - 28% | Intro & Brand Philosophy)
        ====================================================== -->
        <div id="hero-stage-1" class="absolute inset-0 z-20 flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-14 transition-all duration-700 ease-out">
            <!-- Top Announcement Badge -->
            <div class="pt-2 sm:pt-4">
                <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#142C22]/90 backdrop-blur-md border border-[#C9A455]/50 text-[#D8B76E] text-xs font-semibold tracking-wider uppercase shadow-lg">
                    <span class="w-2 h-2 rounded-full bg-[#C9A455] animate-ping"></span>
                    <span>Toxin-Free Botanical Intelligence</span>
                </div>
            </div>

            <!-- Main Title & Headline -->
            <div class="max-w-3xl mx-auto space-y-4 sm:space-y-6 my-auto">
                <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#142C22] leading-[1.08]">
                    Skincare ka <br>
                    <span class="text-[#937126] italic font-normal">Naya Sansar.</span>
                </h1>
                <p class="text-base sm:text-xl text-[#2E473B] font-medium max-w-xl mx-auto leading-relaxed">
                    Potent Indian botanicals harmonized with pure clinical dermatology. Designed specifically for Indian melanin, climate, and barrier resilience.
                </p>
                <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a href="products.html" class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#142C22] text-[#D8B76E] hover:bg-[#1C3B2E] text-xs sm:text-sm font-bold tracking-wide uppercase shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-[#C9A455]/40 text-center">
                        Explore Formulations
                    </a>
                    <a href="visionary.html" class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/90 backdrop-blur-md text-[#142C22] border border-[#142C22]/20 hover:bg-white text-xs sm:text-sm font-semibold transition-all duration-300 text-center flex items-center justify-center space-x-2 shadow-sm">
                        <span>Join Visionary Circle</span>
                        <span class="bg-[#937126]/15 text-[#937126] text-[10px] px-2 py-0.5 rounded-full font-bold">2000 Cap</span>
                    </a>
                </div>
            </div>

            <!-- Bottom Scroll Indicator -->
            <div class="pb-2 flex flex-col items-center space-y-2 text-[#142C22]">
                <span class="text-[11px] font-bold tracking-[0.2em] uppercase text-[#142C22]/80">Scroll to Explore Formulation Alchemy</span>
                <div class="w-6 h-9 rounded-full border-2 border-[#142C22]/40 flex items-start justify-center p-1">
                    <div class="w-1.5 h-2 rounded-full bg-[#937126] animate-bounce"></div>
                </div>
            </div>
        </div>

        <!-- ======================================================
             STAGE 2 (Scroll 32% - 62% | Actives & Botanical Extraction)
        ====================================================== -->
        <div id="hero-stage-2" class="absolute inset-0 z-20 flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none opacity-0 translate-y-4 scale-95 transition-all duration-700 ease-out">
            <div class="max-w-md bg-[#142C22]/90 backdrop-blur-xl border border-[#C9A455]/40 rounded-3xl p-6 sm:p-8 text-[#FAF5E9] shadow-2xl space-y-4 pointer-events-auto">
                <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1C3B2E] text-[#D8B76E] text-[11px] font-bold tracking-wider uppercase border border-[#C9A455]/30">
                    <span>Phase 01: Botanical Actives</span>
                </div>
                <h2 class="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Micro-Molecular <br>
                    <span class="text-[#D8B76E] italic font-normal">Extraction Alchemy</span>
                </h2>
                <p class="text-xs sm:text-sm text-[#D8CEBC] leading-relaxed">
                    Golden turmeric essence, high-potency 15% Vitamin C, and botanical retinol lipids formulated to penetrate Indian skin barriers without congestion.
                </p>
                <div class="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#FAF5E9]">
                    <div class="flex items-center space-x-2 bg-[#1C3B2E]/60 px-3 py-2 rounded-xl border border-[#C9A455]/20">
                        <span class="text-[#C9A455]">✦</span>
                        <span>Golden Turmeric</span>
                    </div>
                    <div class="flex items-center space-x-2 bg-[#1C3B2E]/60 px-3 py-2 rounded-xl border border-[#C9A455]/20">
                        <span class="text-[#C9A455]">✦</span>
                        <span>15% Ethyl Ascorbic</span>
                    </div>
                    <div class="flex items-center space-x-2 bg-[#1C3B2E]/60 px-3 py-2 rounded-xl border border-[#C9A455]/20">
                        <span class="text-[#C9A455]">✦</span>
                        <span>Botanical Retinol</span>
                    </div>
                    <div class="flex items-center space-x-2 bg-[#1C3B2E]/60 px-3 py-2 rounded-xl border border-[#C9A455]/20">
                        <span class="text-[#C9A455]">✦</span>
                        <span>SPF 50 PA++++</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ======================================================
             STAGE 3 (Scroll 66% - 98% | Formulations Architecture)
        ====================================================== -->
        <div id="hero-stage-3" class="absolute inset-0 z-20 flex flex-col justify-end items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 pointer-events-none opacity-0 translate-y-4 scale-95 transition-all duration-700 ease-out">
            <div class="w-full max-w-4xl bg-[#142C22]/90 backdrop-blur-xl border border-[#C9A455]/40 rounded-3xl p-5 sm:p-7 text-[#FAF5E9] shadow-2xl pointer-events-auto">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-[#244C3B]">
                    <div>
                        <span class="text-[11px] font-bold tracking-[0.2em] text-[#D8B76E] uppercase">The Daily Regimen</span>
                        <h2 class="font-serif text-xl sm:text-2xl font-bold text-white">4-Step Toxin-Free Dermatology Ritual</h2>
                    </div>
                    <a href="products.html" class="px-5 py-2 rounded-full bg-[#C9A455] text-[#142C22] hover:bg-[#D8B76E] text-xs font-bold uppercase transition-colors whitespace-nowrap">
                        View Formulations &rarr;
                    </a>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-left">
                    <div class="bg-[#1C3B2E]/70 p-3 rounded-2xl border border-[#C9A455]/20 hover:border-[#C9A455]/60 transition-colors">
                        <span class="text-[10px] font-bold text-[#C9A455] uppercase tracking-wider block">Step 01 • Cleanse</span>
                        <h4 class="font-serif text-sm font-bold text-white mt-0.5">Golden Wash</h4>
                        <p class="text-[11px] text-[#D8CEBC]">Turmeric & Rice Wash</p>
                    </div>
                    <div class="bg-[#1C3B2E]/70 p-3 rounded-2xl border border-[#C9A455]/20 hover:border-[#C9A455]/60 transition-colors">
                        <span class="text-[10px] font-bold text-[#C9A455] uppercase tracking-wider block">Step 02 • Brighten</span>
                        <h4 class="font-serif text-sm font-bold text-white mt-0.5">Glow Drops</h4>
                        <p class="text-[11px] text-[#D8CEBC]">15% Vitamin C Elixir</p>
                    </div>
                    <div class="bg-[#1C3B2E]/70 p-3 rounded-2xl border border-[#C9A455]/20 hover:border-[#C9A455]/60 transition-colors">
                        <span class="text-[10px] font-bold text-[#C9A455] uppercase tracking-wider block">Step 03 • Renew</span>
                        <h4 class="font-serif text-sm font-bold text-white mt-0.5">Youth Repair</h4>
                        <p class="text-[11px] text-[#D8CEBC]">Retinol Night Cream</p>
                    </div>
                    <div class="bg-[#1C3B2E]/70 p-3 rounded-2xl border border-[#C9A455]/20 hover:border-[#C9A455]/60 transition-colors">
                        <span class="text-[10px] font-bold text-[#C9A455] uppercase tracking-wider block">Step 04 • Protect</span>
                        <h4 class="font-serif text-sm font-bold text-white mt-0.5">Sun Shield</h4>
                        <p class="text-[11px] text-[#D8CEBC]">SPF 50 Zero-Cast Gel</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom atmospheric smooth gradient blend to next section -->
        <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#FAF6EF] via-[#FAF6EF]/60 to-transparent pointer-events-none z-10"></div>

        <!-- ======================================================
             LIGHTWEIGHT LUXURY BUFFERING LOADER
        ====================================================== -->
        <div id="hero-sequence-loader" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 bg-[#142C22]/90 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#C9A455]/40 shadow-2xl transition-opacity duration-500">
            <span class="w-2 h-2 rounded-full bg-[#C9A455] animate-ping"></span>
            <span class="text-[11px] sm:text-xs text-[#FAF5E9] font-medium tracking-wide">Buffering Skinsaar Ritual:</span>
            <div class="w-20 sm:w-28 h-1.5 bg-[#1C3B2E] rounded-full overflow-hidden border border-[#C9A455]/20">
                <div id="hero-sequence-progress" class="h-full bg-gradient-to-r from-[#937126] to-[#C9A455] w-0 transition-all duration-150"></div>
            </div>
            <span id="hero-sequence-percent" class="text-[11px] sm:text-xs font-mono font-bold text-[#D8B76E]">0%</span>
        </div>

        <!-- ======================================================
             NOSCRIPT FALLBACK (When JS is disabled)
        ====================================================== -->
        <noscript>
            <div class="absolute inset-0 z-10">
                <img src="assets/hero-sequence/ezgif-frame-300.jpg" alt="Skinsaar Complete Formulations" class="w-full h-full object-cover">
            </div>
        </noscript>

    </div>
</section>

<!-- Hero Scroll Sequence Engine Script (Ensure this script is loaded on pages with the hero) -->
<script src="assets/js/hero-scroll-sequence.js"></script>
