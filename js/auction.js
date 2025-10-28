const targetDate = '2025-12-31T23:59:59';

let countdownTimer = null;

function getTimeSegmentElements(segmentElement){
    const segmentDisplay = segmentElement.querySelector('.segment-display');
    const segmentDisplayTop = segmentDisplay.querySelector('.segment-display-top');
    const segmentDisplayBottom = segmentDisplay.querySelector('.segment-display-bottom');
    const segmentOverlay = segmentDisplay.querySelector('.segment-overlay');
    const segmentOverlayTop = segmentOverlay.querySelector('.segment-overlay-top');
    const segmentOverlayBottom = segmentOverlay.querySelector('.segment-overlay-bottom');
    return{
        segmentDisplayTop,
        segmentDisplayBottom,
        segmentOverlay,
        segmentOverlayTop,
        segmentOverlayBottom
    };
}

function updateSegmentValues(displayElement, overlayElement, value){
    displayElement.textContent = value;
    overlayElement.textContent = value;
}

function updateTimeSegment(segmentElement, timeValue){
    const segmentElements=getTimeSegmentElements(segmentElement);
    if(parseInt(segmentElements.segmentDisplayTop.textContent, 10)===timeValue){
        return;
    }
    segmentElements.segmentOverlay.classList.add('flip');

    updateSegmentValues(segmentElements.segmentDisplayTop, segmentElements.segmentOverlayBottom, timeValue);

    function finishAnimation(){
        segmentElements.segmentOverlay.classList.remove('flip');
        updateSegmentValues(
            segmentElements.segmentDisplayBottom, 
            segmentElements.segmentOverlayTop, 
            timeValue
        );
        
        this.removeEventListener('animationend', finishAnimation);
    }
    segmentElements.segmentOverlay.addEventListener('animationend', finishAnimation);

}

function updateTimeSection(sectionID, timeValue){
    const firstNumber = Math.floor(timeValue / 10);
    const secondNumber = timeValue % 10;

    const sectionElement = document.getElementById(sectionID);
    const timeSegments = sectionElement.querySelectorAll('.time-segment');
    updateTimeSegment(timeSegments[0], firstNumber);
    updateTimeSegment(timeSegments[1], secondNumber);
}



function getTimeRemaining(targetDateTime){
    const nowTime = Date.now();
    const secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);
    const complete = nowTime >= targetDateTime;
    if(complete){
        return{
            complete,
            seconds: 0,
            minutes: 0,
            hours: 0,
            days: 0
        };
    }
    const days = Math.floor(secondsRemaining / 86400);
    const hours = Math.floor((secondsRemaining % 86400) / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;
    return{
        complete,
        seconds,
        minutes,
        hours,
        days
    };
}

function updateAllSegments(targetDateTime){
    const timeRemainingBits = getTimeRemaining(targetDateTime);

    // days section (cap to 99 for two-digit display)
    updateTimeSection('days', Math.min(timeRemainingBits.days, 99));
    updateTimeSection('hours', timeRemainingBits.hours);
    updateTimeSection('minutes', timeRemainingBits.minutes);
    updateTimeSection('seconds', timeRemainingBits.seconds);

    return timeRemainingBits.complete;
}


(async function populateAuctionFromDemo() {
  try {
    const qs = new URLSearchParams(window.location.search);
    const index = Math.max(0, parseInt(qs.get("id"), 10) || 0);
    const resp = await fetch("../demo/demo.json");
    if (!resp.ok) throw new Error("Failed to load demo.json");
    const items = await resp.json();
    const item = items[index] || items[0];
    if (!item) return;

    // Image (use existing img element)
    const imgEl = document.querySelector(".animal_details img.moo_picture") ||
                  document.querySelector(".animal_details img");
    if (imgEl && item.fotoSubasta) {
      imgEl.src = item.fotoSubasta;
      imgEl.alt = item.nombreSubasta || imgEl.alt || "";
    }

    // Description: use existing paragraph in the markup if present
    const desc = document.querySelector(".auction_name p");
    if (desc && item.descripcion != null) {
      desc.textContent = item.descripcion;
    }

    // Title
    const titleEl = document.querySelector(".auction_name h1") || document.querySelector(".auction_name");
    if (titleEl) titleEl.textContent = item.nombreSubasta || "Subasta";

    // Date & place block
    const timePlace = document.querySelector(".time_place");
    if (timePlace && item.fecha) {
      const d = new Date(item.fecha);
      const formatted = Number.isNaN(d.getTime()) ? item.fecha : d.toLocaleDateString("es-PA", { day: "numeric", month: "long", year: "numeric" });
      timePlace.innerHTML = `
        <span>Fecha</span>
        <h2>${formatted}</h2>
        <span>Lugar</span>
        <h2>${item.lugar || ""}</h2>
      `;
    }

    // Table row values (Nombre, Sexo, Raza, Peso) — replaced 'edad' with 'sexo'
    const secondRow = document.querySelector(".animal_table tbody:nth-child(2)");
    if (secondRow) {
      const tds = secondRow.querySelectorAll("td");
      if (tds.length >= 4) {        
        tds[0].textContent = item.sexo || "N/A";
        tds[1].textContent = item.raza || "";
        tds[2].textContent = item.peso != null ? `${item.peso} kg` : "";
        tds[3].textContent = item.vendedor || "";
      }
    }

    // Price
    const priceEl = document.querySelector(".price-info h2, .price h2");
    if (priceEl) {
      try {
        priceEl.textContent = new Intl.NumberFormat("es-PA", { style: "currency", currency: "USD" }).format(item.pujaMasReciente || 0);
      } catch {
        priceEl.textContent = `$${item.pujaMasReciente || 0}`;
      }
    }

    // Start countdown using date from JSON (if present)
    if (item.fecha) {
      const targetTs = new Date(item.fecha).getTime();
      if (!Number.isNaN(targetTs)) {
        // run immediately and then every second
        if (countdownTimer) clearInterval(countdownTimer);
        updateAllSegments(targetTs);
        countdownTimer = setInterval(() => {
          const isComplete = updateAllSegments(targetTs);
          if (isComplete) {
            clearInterval(countdownTimer);
          }
        }, 1000);
      }
    }

    // Do not touch any other existing countdown animation logic.

  } catch (err) {
    console.error("populateAuctionFromDemo error:", err);
  }
})();