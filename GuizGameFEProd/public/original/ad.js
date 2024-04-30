import { AnchorAdslotsManager } from './anchorAdslots.js';
import { ResponsiveAdslotsManager } from './responsiveAdslots.js';
import { InterstitialAdslotsManager } from './interstitialAdslot.js';
import { StickyAdslotsManager } from './stickyAdslots.js';
import { RewardedAdslotsManager } from './rewardedAdslots.js';
import { VastAdsManager } from './vastAds.js';

const customStyleUri = '/original/custom-style.css'
const adConfJsonUri = '/adList.json'
const adConfDefaultSizes = '/ad-default-sizes.json'


class AdManager {
  async initManager() {
    window.googletag = window.googletag || { cmd: [] };
    await this.fetchData()
    this.pushStyleSheet()
    this.loadAds()

  }

  async loadAds() {
    googletag.cmd.push(() => {
      this.interstitialAdslotsManager = new InterstitialAdslotsManager(this.interstitialAd)
      this.responsiveAdslotsManager = new ResponsiveAdslotsManager(this.adSlots, this.dataJsonSizes)
      this.stickyAdslotsManager = new StickyAdslotsManager(this.stickyAd)
      this.anchorAdSlotsManager = new AnchorAdslotsManager(this.anchorAdSlots)
      this.rewardedAdslotsManager = new RewardedAdslotsManager(this.rewardedAd)
      if (this.targeting) {
        for (let t of this.targeting) {
          let name = t.name
          let value = t.value
          googletag.pubads().setTargeting(name, value)
        }
      }
      googletag.pubads().collapseEmptyDivs()
      googletag.pubads().enableLazyLoad();
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
      this.responsiveAdslotsManager.pushResponsiveAdslots()
      this.anchorAdSlotsManager.pushAnchorAdslots()
      this.interstitialAdslotsManager.displayInterstitialSlot()
      this.rewardedAdslotsManager.pushRewardedSlot()
      this.stickyAdslotsManager.pushStickyAds()
      this.vastAdsManager = new VastAdsManager(this.vastAds,this.dataJsonSizes)
    });

  }

  async fetchData() {
    let data = await fetch(adConfJsonUri)
    if (!data.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let dataJson = (await data.json())
    this.adSlots = dataJson.adSlots
    this.anchorAdSlots = dataJson.anchorAdSlots
    this.stickyAd = dataJson.stickyAd
    this.rewardedAd = dataJson.rewardedAd
    this.interstitialAd = dataJson.interstitialAd
    this.targeting = dataJson.targeting
    this.vastAds = dataJson.vastAds

    let dataSizes = await fetch(adConfDefaultSizes)
    if (!dataSizes.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    this.dataJsonSizes = (await dataSizes.json()).defaultSizes
  }

  pushStyleSheet() {
    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = customStyleUri;
    document.head.appendChild(linkElement);
  }
}



let adManager = new AdManager()
adManager.initManager()


