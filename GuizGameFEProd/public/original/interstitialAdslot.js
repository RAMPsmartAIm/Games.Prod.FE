import { getRandomElementFromArray } from "./utils.js";

export class InterstitialAdslotsManager {
    constructor(interstitialAd) {
        if (interstitialAd && interstitialAd.enabled) {
            this.interstitialSlot = googletag.defineOutOfPageSlot(
                interstitialAd.adId,
                googletag.enums.OutOfPageFormat.INTERSTITIAL,
            );

            if (this.interstitialSlot) {
                this.interstitialSlot.addService(googletag.pubads()).setConfig({
                    interstitial: {
                        triggers: {
                            unhideWindow: true,
                        },
                    },
                });
                if (interstitialAd.targeting) {
                    let name = interstitialAd.targeting.name
                    let value = getRandomElementFromArray(interstitialAd.targeting.values)
                    this.interstitialSlot.setTargeting(name, value)
                }
            }
        }
    }

    displayInterstitialSlot() {
        googletag.display(this.interstitialSlot);
    }
}