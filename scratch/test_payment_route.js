async function testPaymentRoute() {
  console.log("1. Testing GET https://www.ams-hackathon.site/api/payments/create-order ...");
  try {
    const getRes = await fetch("https://www.ams-hackathon.site/api/payments/create-order");
    const getText = await getRes.text();
    console.log("GET Response Status:", getRes.status);
    console.log("GET Response Text:", getText);
  } catch (e) {
    console.error("GET Error:", e.message);
  }

  console.log("\n2. Testing POST https://www.ams-hackathon.site/api/payments/create-order (teamSize: 4) ...");
  try {
    const postRes = await fetch("https://www.ams-hackathon.site/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamSize: 4 }),
    });
    const postText = await postRes.text();
    console.log("POST Response Status:", postRes.status);
    console.log("POST Response Text:", postText);
  } catch (e) {
    console.error("POST Error:", e.message);
  }
}

testPaymentRoute();
