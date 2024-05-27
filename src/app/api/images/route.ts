// // app/api/extract-data/route.ts

// import { NextResponse } from "next/server";
// import jsdom from "jsdom";
// import puppeteer from "puppeteer";

// const { JSDOM } = jsdom;

// async function getGoogleLensResponse(imageUrl: string): Promise<string | null> {
//   const url = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
//     imageUrl
//   )}`;
//   const headers = {
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
//   };

//   try {
//     const response = await fetch(url, { headers });
//     console.log(`Response status code: ${response.status}`);

//     if (response.ok) {
//       const text = await response.text();
//       return text;
//     } else {
//       console.log("Failed to retrieve the Google Lens response.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching Google Lens response:", error);
//     return null;
//   }
// }

// async function extractDataFromHTML(
//   htmlContent: string
// ): Promise<string | null> {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Set the HTML content to the page
//     await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

//     // Extract the desired content directly within the page context
//     const aah4tcContent = await page.evaluate(() => {
//       const aah4tcDiv = document.querySelector("div.aah4tc");
//       return aah4tcDiv ? aah4tcDiv.textContent : null;
//     });

//     await browser.close();
//     return aah4tcContent;
//   } catch (error) {
//     console.error("Error extracting data from HTML:", error);
//     return null;
//   }
// }

// export async function GET() {
//   const imageUrl =
//     "https://di2ponv0v5otw.cloudfront.net/posts/2024/04/11/66184b0a69ef1a7731fbeb16/m_wp_66184b0a896c3807d3e6f540.webp";

//   try {
//     // Step 1: Fetch the raw HTML content
//     const htmlContent = await getGoogleLensResponse(imageUrl);

//     if (!htmlContent) {
//       return NextResponse.json(
//         { error: "Failed to retrieve the Google Lens response." },
//         { status: 500 }
//       );
//     }

//     // Step 2: Extract the desired data from the HTML content using Puppeteer
//     const parsedData = await extractDataFromHTML(htmlContent);

//     console.log(parsedData);

//     // Step 3: Return the parsed data as the API response
//     if (parsedData) {
//       return NextResponse.json({ content: parsedData });
//     } else {
//       return NextResponse.json(
//         { error: "Failed to parse the data." },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//   }
// }

// function parseGeneratedHTML(document: any) {
//   const itemsData: any[] = [];

//   const aah4tcDiv = document.querySelector("div.aah4tc");
//   if (aah4tcDiv) {
//     console.log("Found div.aah4tc:", aah4tcDiv.textContent);
//     return aah4tcDiv.textContent;
//   } else {
//     console.log("div.aah4tc not found");
//     return null;
//   }
//   if (aah4tcDiv) {
//     const divElements = aah4tcDiv.querySelectorAll(
//       "div[data-item-title][data-thumbnail-url]"
//     );
//     divElements.forEach((element) => {
//       const itemTitle = element.getAttribute("data-item-title");
//       const thumbnailUrl = element.getAttribute("data-thumbnail-url");
//       itemsData.push({ itemTitle, thumbnailUrl });
//     });
//   }

//   return itemsData;
// }
