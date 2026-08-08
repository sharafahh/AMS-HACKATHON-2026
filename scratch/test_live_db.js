async function testLiveDb() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    
    console.log("Fetching live DB status from https://www.ams-hackathon.site/api/db-status ...");
    const res = await fetch("https://www.ams-hackathon.site/api/db-status", { signal: controller.signal });
    clearTimeout(timeout);
    
    const json = await res.json();
    console.log("=== LIVE DB STATUS RESPONSE ===");
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("Live DB check error:", err.message);
  }
}
testLiveDb();
