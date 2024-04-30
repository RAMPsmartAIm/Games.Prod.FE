import { getTranslatedCloseText } from "./utils.js";
import { ResponsiveAdslotsManager } from './responsiveAdslots.js';


export class VastAdsManager {

    constructor(vastAds, googleJsonSize) {
        if (vastAds && vastAds.enabled) {
            this.googleJsonSize = googleJsonSize
            this.vastAds = vastAds
            this.onAdError = this.onAdError.bind(this);
            this.initializeIMA = this.initializeIMA.bind(this);
            // this.adsLoader = this.adsLoader.bind(this)
            console.log("VAST AD MANAGER CONSTRUCTOR", this)
            this.loadIMASDK()
        }
    }

    runAdScripts() {

        this.videoElement = document.getElementById("admanager_video-element");
        this.initializeIMA();
        this.videoElement.addEventListener("play", (event) => {
            this.loadAds(event);
        });


        var playPauseButton = document.getElementById("admanager_play-pause-button");

        var playIcon = document.createElement('img');
        playIcon.id = "playIcon";
        playIcon.className = 'active';
        playIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVR4nO3SoQ3AQAwEwe+/6YRsAQH3QTOSoYHlPQcA/vV8nFv7Mw6Jj6xJK9Jak1aktSatSGtNWpHWmrQirTVpRVpr0oq01qQVaa1JK9Jak1akBQDnkhe+iKV3X20cDgAAAABJRU5ErkJggg=='

        playPauseButton.appendChild(playIcon);

        playPauseButton.addEventListener("click", () => {
            let playIcon = document.getElementById('playIcon')
            playIcon.classList.toggle('active')
            if (this.isAdPaused || playIcon.classList.contains('active')) {
                this.onContentResumeRequested();
                playIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVR4nO3SoQ3AQAwEwe+/6YRsAQH3QTOSoYHlPQcA/vV8nFv7Mw6Jj6xJK9Jak1aktSatSGtNWpHWmrQirTVpRVpr0oq01qQVaa1JK9Jak1akBQDnkhe+iKV3X20cDgAAAABJRU5ErkJggg==';
            } else {
                this.onContentPauseRequested();
                playIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABHElEQVR4nO3ZsU3EQBCF4Q8hIIGMlIQCaIAOKIIWCKAAWiAkJSSlgWvgroCLL3VGcjpxQ7IkhLC2b1b7S39q6Vm25+2YTqfT+cUTTjVAYI07DQSJ4geuNRAksMULLiQPEsUN7nEkeZAoLnCjgSCBL7zhUvIgURzwgGPJg0RxhVsNBAns8Y4ryYNE8RPPOMseJA6lHURlZ2sHMYKztIMY0UnbQUzgYop2EBO5w+uY7SAmdhirHcRMrmq3g5jRfc120IP4301YZn+0huwv+66Fz+8i+0BMX1G2pTSeTxHgh9oh0tf4dfaD1Wf2o+6+heXDMvs6aMi+oNuNPZVr0PwSe5P9t8J2jqlcg4OYyjU4iKlcg0ecVLlSp9Pp+CPfGIyWAE6XLnEAAAAASUVORK5CYII=';
            }
        });



        window.addEventListener("resize", (event) => {
            if (this.adsManager) {
                var width = this.videoElement.clientWidth;
                var height = this.videoElement.clientHeight;
                this.adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
            }
        });

        // Update volume slider value initially
        this.updateVolumeSlider();

        // Update volume slider value when volume changes
        this.videoElement.addEventListener("volumechange", (e) => { this.updateVolumeSlider(e) });

        // Add event listener to volume slider to adjust video volume
        this.volumeSlider = document.getElementById("admanager_volume-slider");
        this.volumeSlider.addEventListener("input", (e) => {
            this.videoElement.volume = e.target.value
        });
    }

    onAdStarted() {
        this.handleSlotRenderEnded()
        var customControls = document.getElementById("admanager_custom-controls");
        customControls.classList.remove("admanager_hidden");
        function isInViewport() {
            var videoContainerParent = document.getElementById("admanager_video-container_parent");
            var videoContainer = document.getElementById("admanager_video-container");
            var videoElement = document.getElementById("admanager_video-element");
            var videoCloseButton = document.getElementById("admanager_close-button");
            if (videoContainer && videoContainerParent && videoElement && videoCloseButton && !this.videoMinimizeOff) {
                if (!this.isInViewport(videoContainerParent)) {
                    videoContainer.classList.add("admanager_bottom-right");
                    videoCloseButton.classList.remove("admanager_hidden");
                    this.adsManager.resize(350, 200, google.ima.ViewMode.NORMAL);
                } else {
                    videoContainer.classList.remove("admanager_bottom-right");
                    var width = this.videoElement.clientWidth;
                    var height = this.videoElement.clientHeight;
                    this.adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
                    videoCloseButton.classList.add("admanager_hidden");
                }
            }
        }
        // Add debounced event listener to window scroll event to check if video is in viewport
        window.addEventListener(
            "scroll",
            this.debounce(isInViewport, 100)
        );
    }

    onAdComplete() {
        // Show the custom controls when the ad ends
        if (this.adsManager) {
            this.adsManager.destroy();
        }
        var customControls = document.getElementById("admanager_custom-controls");
        customControls.classList.add("admanager_hidden");
        this.videoElement.remove()
        var videoContainerParent = document.getElementById("admanager_video-container_parent");
        videoContainerParent.remove()
    }

    onContentPauseRequested() {
        if (this.adsManager) {
            this.adsManager.pause();
        }
    }

    onContentResumeRequested() {
        if (this.adsManager) {
            this.adsManager.resume();
        }
    }

    loadAds(event) {
        // Prevent this function from running on if there are already ads loaded
        if (this.adsLoaded) {
            return;
        }
        this.adsLoaded = true;

        // Prevent triggering immediate playback when ads are loading
        if (event) {
            event.preventDefault();
        }
        this.videoElement.load();
        this.adDisplayContainer.initialize();

        var width = this.videoElement.clientWidth;
        var height = this.videoElement.clientHeight;
        try {
            this.adsManager.init(width, height, google.ima.ViewMode.NORMAL);
            this.startVideoWhenInView()
        } catch (adError) {
            console.log("AdsManager could not be started");
            this.videoElement.play();
        }
    }

    startVideoWhenInView() {
        const videoContainer = document.getElementById("admanager_video-container");
        const options = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.adsManager.start();
                    observer.unobserve(videoContainer);
                }
            });
        }, options);

        observer.observe(videoContainer);
    }

    initializeIMA() {
        this.adContainer = document.getElementById("admanager_ad-container");
        this.adDisplayContainer = new google.ima.AdDisplayContainer(
            this.adContainer,
            this.videoElement
        );
        this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
        this.adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            (e) => {
                this.onAdsManagerLoaded(e)
            },
            false
        );

        this.adsLoader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            (e) => {
                this.onAdError(e)
            },
            false
        );
        // Let the AdsLoader know when the video has ended
        this.videoElement.addEventListener("ended", function () {
            adsLoader.contentComplete();
        });

        var adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = this.vastAds.adTagUrl

        // Specify the linear and nonlinear slot sizes. This helps the SDK to
        // select the correct creative if multiple are returned.
        adsRequest.linearAdSlotWidth = this.videoElement.clientWidth;
        adsRequest.linearAdSlotHeight = this.videoElement.clientHeight;
        adsRequest.nonLinearAdSlotWidth = this.videoElement.clientWidth;
        adsRequest.nonLinearAdSlotHeight = this.videoElement.clientHeight / 3;

        // Pass the request to the adsLoader to request ads
        this.adsLoader.requestAds(adsRequest);
    }

    onAdsManagerLoaded(adsManagerLoadedEvent) {
        document.getElementById("admanager_video-container").classList.remove("admanager_hidden");
        this.adsManager = adsManagerLoadedEvent.getAdsManager(this.videoElement);

        this.adsManager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            e => this.onAdError(e)
        );

        this.adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            (e) => {
                this.onContentPauseRequested(e)
            }
        );
        this.adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            (e) => {
                this.onContentResumeRequested(e)
            }
        );
        this.adsManager.addEventListener(
            google.ima.AdEvent.Type.STARTED,
            (e) => {
                this.onAdStarted(e)
            },
            false
        );

        this.adsManager.addEventListener(
            google.ima.AdEvent.Type.COMPLETE,
            (e) => {
                this.onAdComplete(e)
            },
            false
        );
        this.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, () => {
            this.isAdPaused = true;
        });

        // Listen for the RESUMED event
        this.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, () => {
            this.isAdPaused = false;
        });

        this.videoElement.muted = true;
        this.videoElement.play();
    }

    onAdError(adErrorEvent) {
        if (this.adsManager) {
            this.adsManager.destroy();
        }

        const tmpElement = document.getElementById('admanager_video-container_parent')
        tmpElement?.remove()

        this.errorResponsiveAdslotsManager = new ResponsiveAdslotsManager(this.vastAds.replacementSlot, this.googleJsonSize)
        this.errorResponsiveAdslotsManager.pushResponsiveAdslots()
    }

    updateVolumeSlider() {
        var volumeSlider = document.getElementById("admanager_volume-slider");
        if (!this.videoElement.muted) {
            volumeSlider.value = this.videoElement.volume;
        } else {
            // If muted, set slider value to 0
            volumeSlider.value = 0;
        }
    }

    isInViewport(el, offset = 200) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            (top + offset) < (window.scrollY + window.innerHeight) &&
            left < (window.scrollX + window.innerWidth) &&
            (top + height - offset) > window.scrollY &&
            (left + width) > window.scrollX
        );
    }

    debounce(func, delay) {
        let timeoutId;
        return () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, arguments);
            }, delay);
        };
    }

    loadIMASDK() {
        var script = document.createElement('script');
        script.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
        document.head.appendChild(script);
        script.addEventListener('load', () => {
            if (window.google) {
                this.addVideoContainer()
                this.runAdScripts()
            }
        });
    }

    handleSlotRenderEnded() {
        var videoParent = document.getElementById('admanager_video-container').parentElement;
        videoParent.style.height = this.videoElement.clientHeight + 'px';

    }

    addVideoContainer() {
        var videoParent = document.createElement('div');
        videoParent.id = 'admanager_video-container_parent';
        var videoContainer = document.createElement('div');
        videoContainer.className = 'admanager_hidden';
        videoContainer.id = 'admanager_video-container';

        var videoElement = document.createElement('video');
        videoElement.id = 'admanager_video-element';
        // videoElement.setAttribute('controls', '');
        videoElement.setAttribute('playsinline', '');

        var sourceElement = document.createElement('source');
        sourceElement.src = this.vastAds.videoContent;

        videoElement.appendChild(sourceElement);

        var adContainer = document.createElement('div');
        adContainer.id = 'admanager_ad-container';

        var customControls = document.createElement('div');
        customControls.id = 'admanager_custom-controls';
        customControls.className = 'admanager_hidden';

        var playPauseButton = document.createElement('button');
        playPauseButton.id = 'admanager_play-pause-button';

        var volumeSlider = document.createElement('input');
        volumeSlider.id = 'admanager_volume-slider';
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '1';
        volumeSlider.step = '0.1'


        customControls.appendChild(playPauseButton);
        customControls.appendChild(volumeSlider);

        videoContainer.appendChild(videoElement);
        videoContainer.appendChild(adContainer);
        videoContainer.appendChild(customControls);

        var closeButton = document.createElement('button');
        closeButton.id = 'admanager_close-button';
        closeButton.textContent = getTranslatedCloseText();
        closeButton.classList.add("admanager_close_button");
        closeButton.classList.add("admanager_hidden");

        closeButton.addEventListener('click', () => {
            this.videoMinimizeOff = true
            var videoContainer = document.getElementById("admanager_video-container");
            var videoElement = document.getElementById("admanager_video-element");
            var videoCloseButton = document.getElementById("admanager_close-button");
            videoContainer.classList.remove("admanager_bottom-right");
            videoCloseButton.classList.add("admanager_hidden");
            var width = this.videoElement.clientWidth;
            var height = this.videoElement.clientHeight;
            this.adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
            this.adsManager.pause();
        });
        videoContainer.appendChild(closeButton);
        let parent = document.getElementById(this.vastAds.customElementId)
        videoParent.appendChild(videoContainer)
        parent.appendChild(videoParent);
    }
}