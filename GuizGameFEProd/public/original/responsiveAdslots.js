import { getRandomElementFromArray } from "./utils.js";

export class ResponsiveAdslotsManager {


    constructor(adSlots, googleJsonSize) {
        if (adSlots && adSlots.enabled) {
            this.adSlots = adSlots.slots
            this.responsiveAdSlots = []
            for (let adSlot of adSlots.slots) {
                const responsiveAdSlot = googletag.defineSlot(adSlot.adId, adSlot.sizeList.map(size => { return size.value }), adSlot.googleTagDivId).addService(googletag.pubads());
                if (responsiveAdSlot) {
                    this.responsiveAdSlots.push(responsiveAdSlot)
                    if (adSlot.targeting) {
                        let name = adSlot.targeting.name
                        let value = getRandomElementFromArray(adSlot.targeting.values)
                        responsiveAdSlot.setTargeting(name, value)
                    }
                    if (adSlot.sizeMappingGenerate) {
                        let mapping = googletag.sizeMapping()

                        for (let size of adSlot.sizeMappingGenerate) {
                            mapping = mapping.addSize(size.screen, this.processReactiveSizeList(size.breakValue,
                                size.maxHeight,
                                size.minHeight,
                                adSlot.addBiggestSize,
                                googleJsonSize))
                        }
                        mapping = mapping.build();
                        responsiveAdSlot.defineSizeMapping(mapping);
                    } else if (adSlot.sizeMapping) {
                        let mapping = googletag.sizeMapping()

                        for (let size of adSlot.sizeMapping) {

                            mapping = mapping.addSize(size.screen, size.values)
                        }
                        mapping = mapping.build();
                        responsiveAdSlot.defineSizeMapping(mapping);
                    }
                }
            }
        }
    }

    processReactiveSizeList(breakValue, maxHeight,minHeight, addBiggestSize, sizeList) {
        let googleFilteredValues = [[breakValue, maxHeight]]
        googleFilteredValues = [...sizeList.filter(size => {
            if (breakValue >= size.value[0] && maxHeight >= size.value[1] && minHeight <= size.value[1]) {
                return true
            }
        }).map(size => size.value)]
        if (addBiggestSize) {
            googleFilteredValues.push([breakValue, maxHeight])
        }
        return googleFilteredValues
    }

    pushResponsiveAdslots() {
                for (let adSlot of this.adSlots) {
            var iDiv = document.createElement('div');
            iDiv.id = adSlot.googleTagDivId;
            var scriptElm = document.createElement('script');
            var inlineCode = document.createTextNode(`googletag.cmd.push(function() { googletag.display('${adSlot.googleTagDivId}'); });`);
            scriptElm.appendChild(inlineCode);
            iDiv.appendChild(scriptElm);
            var parent = document.getElementById(adSlot.customDivId);
            if (parent) {
                parent.appendChild(iDiv);
                parent.style.textAlign = "center"
            }
        }
    }
}