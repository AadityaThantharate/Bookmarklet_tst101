(() => {
  // Search all frames automatically if frames[5] isn't accurate
  let d = document;
  if (!d.getElementById("commentsID")) {
    for (let i = 0; i < window.frames.length; i++) {
      try {
        if (window.frames[i].document.getElementById("commentsID")) {
          d = window.frames[i].document;
          break;
        }
      } catch (e) {}
    }
  }

  const commentsElem = d.getElementById("commentsID");
  const c = (commentsElem?.value || commentsElem?.innerText || "").trim();
  
  const set = (id, val) => {
    const e = d.getElementById(id);
    if (e) e.checked = val;
  };

  const clear = () => d.querySelectorAll("input[type='checkbox'][id$='Id']").forEach(x => {
    if (!["releaseonlyId", "CON_CENTRALId", "CON_EASTId", "CON_WESTId"].includes(x.id)) {
      x.checked = false;
    }
  });

  if (!commentsElem) {
    console.log("ERROR: Could not find element with ID 'commentsID' in main document or any frame.");
    return;
  }

  if (/Shipment Contains (Watches|Clocks|Watch Parts)/i.test(c)) {
    clear();
    const e = d.getElementById("entryTypeID");
    if (e) e.value = "UNASSIGNED";
    set("HIGHRISKId", true);
    set("WATCHESId", true);
    set("releaseonlyId", false);
    console.log("MATCH: WATCHES CASE");
  } else if (/Duplex Error|HOLD|Entry needs reset|cannot be resumed|not in proper status|system outage/i.test(c)) {
    clear();
    set("HOLDId", true);
    console.log("MATCH: HOLD CASE");
  } else if (/GN\s*-\s*Business Document/i.test(c)) {
    clear();
    const e = d.getElementById("entryTypeID");
    if (e) e.value = "GN";
    console.log("MATCH: GN CASE");
  } else if (/Keyed 87\/01|Duplicate\s*-\s*Already processed/i.test(c)) {
    clear();
    set("ECOMId", true);
    console.log("MATCH: ECOM CASE");
  } else if (/^Review/i.test(c)) {
    clear();
    set("REVIEWId", true);
    console.log("MATCH: REVIEW CASE");
  } else {
    console.log("NO MATCH. Text found inside commentsID was:", `"${c}"`);
  }
})();
