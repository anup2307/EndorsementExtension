/* global $ */
/* eslint-disable no-unused-vars */

const debugServiceWorker = true;
const debugTimingServiceWorker = true;
const debugTimingForegroundContent = true;
const debugHilitorEnabled = true;

const groupNames = {
  POSSIBILITY_SUPPORT: 'POSSIBILITY_SUPPORT',
  POSSIBILITY_OPPOSE: 'POSSIBILITY_OPPOSE',
  POSSIBILITY_INFO: 'POSSIBILITY_INFO',       // INFO_ONLY IS A DEPRECATED STATE, COMES THROUGH API AS NO_STANCE
  STORED_SUPPORT: 'STORED_SUPPORT',
  STORED_OPPOSE: 'STORED_OPPOSE',
  STORED_INFO: 'STORED_INFO',                 // INFO_ONLY IS A DEPRECATED STATE, COMES THROUGH API AS NO_STANCE
  DELETED: 'DELETED',
  DEFAULT: 'DEFAULT'
};

const colors = {
  POSS_SUPPORT_FOREGROUND: '#FFFFFF',
  POSS_SUPPORT_BACKGROUND: '#27af72',
  POSS_OPPOSE_FOREGROUND: '#FFFFFF',
  POSS_OPPOSE_BACKGROUND: '#fb6532',
  POSS_INFO_FOREGROUND: '#FFFFFF',
  POSS_INFO_BACKGROUND: '#7c7b7c',
  STORED_SUPPORT_FOREGROUND: '#28b074',
  STORED_SUPPORT_BACKGROUND: '#b4e7cd',
  STORED_OPPOSE_FOREGROUND: '#f16936',
  STORED_OPPOSE_BACKGROUND: '#f7c9b8',
  STORED_INFO_FOREGROUND: '#818082',
  STORED_INFO_BACKGROUND: '#dad8da',
  DELETED_FOREGROUND: '#aa0311',
  DELETED_BACKGROUND: '#f0c7c8',
};


const useProductionAPIs = true;
const useProductionWebApp = false;    // TODO: Undo 12/8/20
const webAppRoot = useProductionWebApp ? 'https://quality.wevote.us' : 'https://localhost:3000';
const candidateExtensionWebAppURL = `${webAppRoot}/candidate-for-extension`;
const addCandidateExtensionWebAppURL = `${webAppRoot}/add-candidate-for-extension`;
const ballotWebAppURL = `${webAppRoot}/ballot`;
const extensionWarmUpPage = `${webAppRoot}/extension.html`;
const extensionSignInPage = `${webAppRoot}/more/extensionsignin`;
const apiRoot = useProductionAPIs ? 'https://api.wevoteusa.org' : 'http://localhost:8000';
const rootApiURL = `${apiRoot}/apis/v1`;
const cdnRoot = useProductionAPIs ? 'https://cdn.wevoteusa.org' : 'http://localhost:8000';
const rootCdnURL = `${cdnRoot}/apis/v1`;
const defaultNeverHighlightOn = ['*.wevote.us', 'api.wevoteusa.org', 'localhost', 'platform.twitter.com', '*.addthis.com', 'localhost'];


// function isInOurDialogIFrame () {
//   return $('.weVoteEndorsementFrame').length > 0;   // this is true if in our dialog's iframe containing the WebApp at wevote.us
// }

// function isInOurIFrame () {
//   return $('div#wedivheader').length > 0;   // this is true if in our highlighted "Endorsement Page" that is framed by the "Open Edit Panel" button action}
// }

// SVGs lifted from WebApp thumbs-up-color-icon.svg and thumbs-down-color-icon.svg
function markupForThumbSvg (classString, type, fillColor) {
  if (type === 'endorse' || type === 'oppose') {
    let markup = "<svg class='" + classString + "' style='margin-top:3px'>";

    if (type === 'endorse') {
      markup += "<path fill='" + fillColor + "' d='M6,16.8181818 L8.36363636,16.8181818 L8.36363636,9.72727273 L6,9.72727273 L6,16.8181818 L6,16.8181818 Z M19,10.3181818 C19,9.66818182 18.4681818,9.13636364 17.8181818,9.13636364 L14.0895455,9.13636364 L14.6509091,6.43590909 L14.6686364,6.24681818 C14.6686364,6.00454545 14.5681818,5.78 14.4086364,5.62045455 L13.7822727,5 L9.89409091,8.89409091 C9.67545455,9.10681818 9.54545455,9.40227273 9.54545455,9.72727273 L9.54545455,15.6363636 C9.54545455,16.2863636 10.0772727,16.8181818 10.7272727,16.8181818 L16.0454545,16.8181818 C16.5359091,16.8181818 16.9554545,16.5227273 17.1327273,16.0972727 L18.9172727,11.9313636 C18.9704545,11.7954545 19,11.6536364 19,11.5 L19,10.3713636 L18.9940909,10.3654545 L19,10.3181818 L19,10.3181818 Z'/>" +
        "<path d='M0 0h24v24H0z' fill='none'/>";
    } else if (type === 'oppose') {
      markup += "<path fill='" + fillColor + "' d='M5,18.8199997 L7.36399994,18.8199997 L7.36399994,11.7279999 L5,11.7279999 L5,18.8199997 L5,18.8199997 Z M18.0019997,12.3189999 C18.0019997,11.6688999 17.4700997,11.1369999 16.8199997,11.1369999 L13.0907898,11.1369999 L13.6522398,8.43612996 L13.6699698,8.24700997 C13.6699698,8.00469997 13.5694998,7.78011998 13.4099298,7.62054998 L12.7834698,7 L8.8946899,10.8946899 C8.67601991,11.1074499 8.54599991,11.4029499 8.54599991,11.7279999 L8.54599991,17.6379997 C8.54599991,18.2880997 9.07789989,18.8199997 9.72799988,18.8199997 L15.0469997,18.8199997 C15.5375297,18.8199997 15.9571397,18.5244997 16.1344397,18.0989797 L17.9192597,13.9324298 C17.9724497,13.7964998 18.0019997,13.6546598 18.0019997,13.5009998 L18.0019997,12.3721899 L17.9960897,12.3662799 L18.0019997,12.3189999 L18.0019997,12.3189999 Z' transform='rotate(-180 11.501 12.91)'/>" +
        "<path d='M0 0h24v24H0z' fill='none'/>";
    }

    markup += '</svg>';

    return markup;
  }
  return '';
}

function timingFgLog (time0, time1, text, warnAt) {
  if (debugTimingForegroundContent) {
    timingInnerLog (time0, time1, text, warnAt);
  }
}

function timingSwLog (time0, time1, text, warnAt) {
  if (debugTimingServiceWorker) {
    timingInnerLog (time0, time1, text, warnAt);
  }
}

function timingInnerLog (time0, time1, text, warnAt) {
  const duration = time1 - time0;

  if (duration < 1000) {
    const niceDuration = Number.parseFloat(duration).toPrecision(4);
    stampedLog('ttttt TIMING: time to ' + text + ' ' + niceDuration + ' milliseconds.');
  } else {
    const niceDuration = Number.parseFloat(duration/1000).toPrecision(4);
    const msg = 'ttttt TIMING: time to ' + text + '  ' + niceDuration + ' SECONDS.';
    if ((duration)/1000 > warnAt) {
      // console.warn(msg);  // too heavy handed for the extension log file
      stampedLog('WARNING ' + msg);
    } else {
      stampedLog(msg);
    }
  }
}

function debugSwLog (...args) {
  if (debugServiceWorker) {
    stampedLog(...args);
  }
}

function debugHilitor (...args) {
  if (debugHilitorEnabled) {
    stampedLog(...args);
  }
}

function debugFgLog (...args) {
  if (debugTimingForegroundContent) {
    stampedLog(...args);
  }
}

constructionT0 = performance.now();

function stampedLog (...args) {
  const t1 = performance.now();
  // if (!window.constructionT0) window.constructionT0 = t1;  // REMEMBER: that the dom in the extension is not the same as the dom in the foreground web page!  And there is no DOM in a service worker!
  const timeStr = Number.parseFloat((t1 - constructionT0)/1000).toFixed(3);
  args.unshift(':');
  args.unshift(timeStr);
  console.log(...args);
}

function inArray (elem, array) {
  if (array.indexOf) {
    return array.indexOf(elem);
  }

  for (var i = 0, {length} = array; i < length; i++) {
    if (array[i] === elem) {
      return i;
    }
  }

  return -1;
}

function getCookie (name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
