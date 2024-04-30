import { getRandomElementFromArray, getTranslatedCloseText } from "./utils.js";


export class StickyAdslotsManager {
    constructor(stickyAd) {
        this.stickyAd = stickyAd
        if (stickyAd) {
            this.stickyAdSlot = googletag.defineSlot(stickyAd.adId, stickyAd.sizeList.map(size => { return size.value }), "admanager_custom_sticky_bottom_ad").addService(googletag.pubads());
            if (this.stickyAdSlot) {
                if (stickyAd.sizeMapping) {
                    let mapping = googletag.sizeMapping()
                    for (let size of stickyAd.sizeMapping) {
                        mapping = mapping.addSize(size.screen, size.values)
                    }
                    mapping = mapping.build();
                    this.stickyAdSlot.defineSizeMapping(mapping);
                }
                if (stickyAd.targeting) {
                    let name = stickyAd.targeting.name
                    let value = getRandomElementFromArray(stickyAd.targeting.values)
                    this.stickyAdSlot.setTargeting(name, value)
                }
            }
        }
    }

    pushStickyAds() {
        const stickyDivParent = document.createElement('div');
        const stickyDiv = document.createElement('div');
        stickyDivParent.id = "admanager_custom_sticky_bottom_ad_parent";
        stickyDiv.id = "admanager_custom_sticky_bottom_ad";
        const closeButton = document.createElement("button");
        closeButton.textContent = getTranslatedCloseText();
        closeButton.id = "admanager_stickyAdCloseButton"
        closeButton.addEventListener("click", () => {
            closeButton.remove();
            stickyDiv.remove();
        });
        closeButton.addEventListener("mouseenter", () => {
            closeButton.style.backgroundColor = "#f0f0f0";
        });

        closeButton.addEventListener("mouseleave", () => {
            closeButton.style.backgroundColor = "white";
        });
        var scriptElm = document.createElement('script');
        var inlineCode = document.createTextNode(`googletag.cmd.push(function() { googletag.display('admanager_custom_sticky_bottom_ad'); });`);
        scriptElm.appendChild(inlineCode);
        stickyDiv.appendChild(scriptElm);
        stickyDivParent.appendChild(stickyDiv);
        stickyDivParent.appendChild(closeButton);
        document.body.appendChild(stickyDivParent);
        googletag.pubads().collapseEmptyDivs()
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.removedNodes && mutation.removedNodes.length > 0) {
                    if (
                        (Array.from(mutation.removedNodes).includes(stickyDiv)) ||
                        (stickyDiv.style.display === 'none')
                    ) {
                        stickyDivParent.remove();
                        observer.disconnect();
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === stickyDiv) {
                    const newHeight = entry.contentRect.height;
                    let closeButton = document.getElementById("admanager_stickyAdCloseButton")
                    if (closeButton) {
                        closeButton.style.bottom = `${newHeight}px`;
                        if (newHeight === 0) {
                            closeButton.style.display = "none";
                        } else {
                            closeButton.style.display = "flex";
                        }
                    }
                }
            }
        });
        resizeObserver.observe(stickyDiv);

        googletag.pubads().addEventListener('slotRenderEnded', (event) => {
            if (event.slot === this.stickyAdSlot) {
                if (!event.isEmpty) {
                    if (this.stickyAd?.delayInMillis) {
                        setTimeout(() => {
                            var stickyDivParent = document.getElementById("admanager_custom_sticky_bottom_ad_parent");
                            var stickyDiv = document.getElementById("admanager_custom_sticky_bottom_ad")
                            stickyDivParent.style.display = 'block'
                            this.optionalHideCustomAnchor(stickyDiv)
                        }, this.stickyAd?.delayInMillis);
                    } else {
                        window.addEventListener('scroll', () => {
                            const stickyDivParent = document.getElementById("admanager_custom_sticky_bottom_ad_parent");
                            const stickyDiv = document.getElementById("admanager_custom_sticky_bottom_ad")
                            if (stickyDivParent) {
                              stickyDivParent.style.display = 'block'
                              this.optionalHideCustomAnchor(stickyDiv)
                            }
                        });
                    }
                }
            }
        });
    }

  
    optionalHideCustomAnchor(stickyDiv) {
        if(stickyDiv.offsetHeight === 250 || stickyDiv.offsetHeight === 300){
            stickyDiv
        }
    }

}
