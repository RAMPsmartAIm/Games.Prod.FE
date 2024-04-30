import { getRandomElementFromArray } from "./utils.js";



export class AnchorAdslotsManager {

    constructor(anchorAdSlots) {
        if (anchorAdSlots && anchorAdSlots.enabled) {
            this.anchorSlotElements = []
            for (let adSlot of anchorAdSlots.slots) {
                var anchorSlot = googletag.defineOutOfPageSlot(
                    adSlot.adId,
                    document.body.clientWidth <= adSlot.breakingPoint
                        ? googletag.enums.OutOfPageFormat[adSlot.firstAnchor]
                        : googletag.enums.OutOfPageFormat[adSlot.secondAnchor]
                );
                if (anchorSlot) {
                    if (adSlot.targeting) {
                        let name = adSlot.targeting.name
                        let value = getRandomElementFromArray(adSlot.targeting.values)
                        anchorSlot.setTargeting(name, value)
                    }
                    this.anchorSlotElements.push(anchorSlot)
                    anchorSlot.addService(googletag.pubads());
                }

            }
        }
    }

    pushAnchorAdslots() {
        let index = 0
        if (this.anchorSlotElements) {
            for (let anchorSlot of this.anchorSlotElements) {
                var scriptElm = document.createElement('script');
                var inlineCode = document.createTextNode(`googletag.cmd.push(() => { googletag.display("${this.anchorSlotElements[index].getSlotElementId()}"); });`);
                scriptElm.appendChild(inlineCode);
                document.body.append(scriptElm)
                if (this.anchorSlotElements[index]) {
                    googletag.display(this.anchorSlotElements[index]);
                }
                index += 1
            }
        }
    }
}