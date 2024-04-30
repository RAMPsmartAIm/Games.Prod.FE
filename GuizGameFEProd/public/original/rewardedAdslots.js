import { getRandomElementFromArray } from "./utils.js";

export class RewardedAdslotsManager {
    constructor(rewardedAd) {
        let reward
        if (rewardedAd && rewardedAd.enabled) {
            let rewardedAdslotsManager = this
            this.rewardedSlot = googletag.defineOutOfPageSlot(
                rewardedAd.adId,
                googletag.enums.OutOfPageFormat.REWARDED,
            );
            if (this.rewardedSlot) {
                if (rewardedAd.targeting) {
                    let name = rewardedAd.targeting.name
                    let value = getRandomElementFromArray(rewardedAd.targeting.values)
                    this.rewardedSlot.setTargeting(name, value)
                }

                this.rewardedSlot.addService(googletag.pubads());

                googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
                    rewardedAdslotsManager.displayModal("reward", rewardedAd.openAdText, rewardedAd.openAdSubText, undefined, undefined, rewardedAd.buttonText);
                    document.getElementById("admanager_rewarded-ad-button").onclick = () => {
                        event.makeRewardedVisible();
                    };
                });
                googletag.pubads().addEventListener('slotRenderEnded', (event) => {
                    if (event.slot === this.rewardedSlot) {
                        if (!event.empty) {
                            if (rewardedAd.customElementId) {
                                let customAdElement = document.getElementById(rewardedAd.customElementId)
                                if (customAdElement) {
                                    const existingOnClick = customAdElement.onclick;
                                    customAdElement.onclick = null;
                                    customAdElement.addEventListener("click", function (e) {
                                        e.preventDefault()
                                        let rewardedAdModal = document.getElementById("admanager_rewarded-ad-modal")
                                        if (rewardedAdModal) {
                                            rewardedAdModal.style.display = "flex"
                                            rewardedAdModal.customOnClick = existingOnClick
                                        }
                                    });
                                }
                            }
                            if (rewardedAd.customElementClass) {
                                let customAdElements = document.getElementsByClassName(rewardedAd.customElementClass)
                                if (customAdElements) {
                                    for (let element of customAdElements) {
                                        const existingHref = element.getAttribute("href");
                                        element.removeAttribute("href");
                                        const existingOnClick = element.onclick;
                                        element.onclick = null;
                                        element.addEventListener("click", (e) => {
                                            e.preventDefault()
                                            let rewardedAdModal = document.getElementById("admanager_rewarded-ad-modal")
                                            if (rewardedAdModal) {
                                                rewardedAdModal.style.display = "flex"
                                                rewardedAdModal.customOnClick = existingOnClick
                                                rewardedAdModal.customHref = existingHref
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                });

                googletag.pubads().addEventListener("rewardedSlotClosed", () => {
                    if (reward) {
                        let rewardedAdModal = document.getElementById("admanager_rewarded-ad-modal")
                        if (rewardedAdModal.customOnClick) {
                            rewardedAdModal.customOnClick()
                        }
                        if (rewardedAdModal.customHref) {
                            const tempLink = document.createElement("a");
                            tempLink.href = rewardedAdModal.customHref;
                            tempLink.click();
                        }


                    }
                    rewardedAdslotsManager.dismissRewardedAd();
                });

                googletag.pubads().addEventListener("rewardedSlotGranted", (event) => {
                    reward = event.payload;
                    if (reward) {
                        let customHref
                        let customOnClick
                        let rewardedAdModal = document.getElementById("admanager_rewarded-ad-modal")
                        if (rewardedAdModal.customOnClick) {
                            customOnClick = rewardedAdModal.customOnClick
                        }
                        if (rewardedAdModal.customHref) {
                            customHref = rewardedAdModal.customHref
                        }
                        rewardedAdslotsManager.displayModal("grant", rewardedAd.rewardText, customOnClick, customHref)
                    }
                });
            }
        }
    }

    pushRewardedSlot() {
        googletag.display(this.rewardedSlot);
    }

    displayModal(type = "", message = "", subHeadline = "", customOnClick, customHref, buttonName = "Open Ad") {
        let oldModal = document.getElementById("admanager_rewarded-ad-modal")
        if (oldModal) {
            oldModal.remove()
        }
        const modalContainer = document.createElement('div');
        modalContainer.id = "admanager_rewarded-ad-modal"

        if (customOnClick) {
            modalContainer.customOnClick = customOnClick
        }
        if (customHref) {
            modalContainer.customHref = customHref
        }

        const modalContent = document.createElement('div');
        modalContent.classList.add('admanager-rewarded-modal-content');
        modalContent.setAttribute("data-type", type);

        const closeModalBtn = document.createElement('span');
        closeModalBtn.textContent = '×';
        closeModalBtn.classList.add('admanager-rewarded-add-close-button');
        modalContent.appendChild(closeModalBtn);

        const modalText = document.createElement('h1');
        modalText.classList.add('admanager-rewarded-add-headline')
        modalText.textContent = message;
        modalContent.appendChild(modalText);

        const modalSubText = document.createElement('h2');
        modalSubText.classList.add('admanager-rewarded-add-subheadline')
        modalSubText.textContent = subHeadline;
        modalContent.appendChild(modalSubText);


        modalContainer.appendChild(modalContent);
        if (type === "reward") {
            modalContainer.style.display = 'none';
            const openModalBtn = document.createElement('button');
            openModalBtn.textContent = buttonName;
            openModalBtn.id = "admanager_rewarded-ad-button"
            modalContent.appendChild(openModalBtn)
        }


        closeModalBtn.addEventListener('click', () => {
            modalContainer.style.display = "none"
        });

        document.body.appendChild(modalContainer);
    }

    dismissRewardedAd() {
        let oldModal = document.getElementById("admanager_rewarded-ad-modal")
        if (oldModal) {
            oldModal.style.display = "none"
        }
        if (this.rewardedSlot) {
            googletag.destroySlots([this.rewardedSlot]);
        }
    }
}