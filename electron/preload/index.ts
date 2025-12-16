function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

function useLoading() {
  // Get values from environment variables
  const logoPath = process.env.APP_LOGO || '';
  const description = process.env.APP_DESC || 'Loading your experience';
  const brandName = process.env.APP_BRANDNAME;
  const styles = process.env.APP_STYLES;

  // Link to external CSS file
  const oLink = document.createElement("link");
  oLink.id = "app-loading-style";
  oLink.rel = "stylesheet";
  oLink.href = styles; // Adjust path as needed

  const oDiv = document.createElement("div");
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `
    <div class="loading-container">
      <div class="logo-container">
        <div class="logo-circle">
          ${logoPath
      ? `<img class="logo-image" src="${logoPath}" alt="Logo" />`
      : `<div class="logo-icon">${brandName.charAt(0)}</div>`
    }
        </div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-text-container">
        <div class="loading-title">${brandName}</div>
        <div class="loading-subtitle">${description}</div>
      </div>
    </div>
  `;

  return {
    appendLoading() {
      oLink.onload = () => {
        safeDOM.append(document.body, oDiv);
      };

      safeDOM.append(document.head, oLink);
    },

    removeLoading() {
      const loadingWrap = document.querySelector('.app-loading-wrap') as HTMLElement;

      if (!loadingWrap) return;

      // Trigger fade-out
      loadingWrap.classList.add('fade-out');

      // Remove after animation finishes
      loadingWrap.addEventListener(
        'animationend',
        () => {
          safeDOM.remove(document.head, oLink);
          safeDOM.remove(document.body, oDiv);
        },
        { once: true }
      );
    }
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
const loadStartTime = Date.now();
const MIN_LOADING_TIME = 2000000; // Minimum 2 seconds display time

domReady().then(appendLoading);

window.onmessage = (ev) => {
  if (ev.data.payload === "removeLoading") {
    const elapsed = Date.now() - loadStartTime;
    const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

    setTimeout(removeLoading, remaining);
  }
};

// Fallback: remove after minimum time
setTimeout(() => {
  const elapsed = Date.now() - loadStartTime;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
  setTimeout(removeLoading, remaining);
}, 0);