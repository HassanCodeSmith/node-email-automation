// ================================================================
import dotenv from "dotenv";
dotenv.config();

import { GologinApi } from "gologin";

import { setTimeout } from "node:timers/promises";

export const emailAutomation = {
  startSession: ({ token }) => {
    // const token = process.env.GL_API_TOKEN;
    const gologin = GologinApi({ token });

    return async ({ googleUsername, googlePassword }) => {
      const { browser } = await gologin.launch({ headless: false });

      const loginUrl =
        "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com&hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin";
      const page = await browser.newPage();

      const ua = await browser.userAgent();
      await page.setUserAgent(ua);

      // Navigate to the login page
      await page.goto(loginUrl, { waitUntil: "networkidle2" });

      // Handle Recaptcha
      // await page.$eval(".trustworthy-status:not(.hide)", (elt) =>
      //   elt?.innerText?.trim()
      // );

      // Log in with email
      await page.waitForSelector('input[type="email"]', { timeout: 20000 });
      await page.type('input[type="email"]', googleUsername, { delay: 500 });
      await page.keyboard.press("Enter");

      // Wait for the password input field
      await page.waitForSelector('input[type="password"]', { timeout: 20000 });
      await setTimeout(10000);
      await page.type('input[type="password"]', googlePassword, { delay: 500 });
      await page.keyboard.press("Enter");

      // Wait for redirection to Gmail
      try {
        await page.waitForNavigation({
          waitUntil: "networkidle2",
          timeout: 30000,
        });
        console.log("Logged into Gmail successfully!");
        return { browser, page };
      } catch (error) {
        console.log("Login may require manual intervention.");
        return { browser, page };
      }
    };
  },
  sendEmail: async ({ session, recipientEmail, emailSubject, emailBody }) => {
    const { page } = session;
    try {
      await page.waitForSelector(".T-I.T-I-KE.L3", { timeout: 30000 }); // "Compose" button
      await page.click(".T-I.T-I-KE.L3");

      // Wait for the "To" input field and type recipient email
      await page.waitForSelector("input[type='text']", { timeout: 30000 });
      await page.type("input[type='text']", recipientEmail, { delay: 300 });

      // Type the email subject
      await page.type("input[name='subjectbox']", emailSubject, { delay: 300 });

      // Type the email body
      await page.click("div[aria-label='Message Body']");
      await page.type("div[aria-label='Message Body']", emailBody, {
        delay: 300,
      });

      // Send the email
      // await page.click("div[aria-label*='Send']");
      // await page.keyboard.press("Enter");
      // Wait for the Send button and click it
      await page.waitForSelector("div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3", {
        timeout: 30000,
      });
      await page.click("div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3");
      console.log("Email sent successfully!");
    } catch (error) {
      console.log("Failed to send the email:", error);
    }
  },

  closeSession: async (session) => {
    try {
      const { browser } = session;
      console.log("Closing session...");
      await browser.close();
      console.log("Session closed.");
    } catch (error) {
      console.error("Error closing session:", error.message);
    }
  },
};

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 








































































































// import dotenv from "dotenv";
// dotenv.config();

// import { GologinApi } from "gologin";

// const token = process.env.GL_API_TOKEN;
// const gologin = GologinApi({ token });
// import { setTimeout } from "node:timers/promises";
// import { Spintax } from "../models/spintax.model.js";

// // const googleUsername = "hassanmurtaza.moshlay@gmail.com";
// // const googlePassword = "3S8XqZz.Moshlay";
// // const recipientEmail = "hassanmurtaza.moshlay@yopmail.com";
// // const emailSubject = "Dummy Message";
// // const emailBody = "This is a test email sent using Puppeteer.";

// const replaceBodySpintax = async (body, spintaxes) => {
//   for (let i = 0; i < spintaxes.length; i++) {
//     const spintax = spintaxes[i];
//     const regex = new RegExp(spintax.Name, "g");
//     body = body.replace(
//       regex,
//       spintax.Values[Math.floor(Math.random() * spintax.Values.length)]
//     );
//   }
// };

// const replaceReceiverFirstName = async () => {};

// export const emailAutomation = async ({
//   googleUsername,
//   googlePassword,
//   recipientEmail,
//   emailSubject,
//   emailBody,
// }) => {
//   console.log("Usernameeeeeeeeeeee: ", googleUsername);
//   console.log("Passowrdddddddddddd: ", googlePassword);
//   console.log("Emailssssssssssssssssssssssssssss: ", recipientEmail);
//   console.log("Email Subjecttttttt: ", emailSubject);
//   console.log("Email Bodyyyyyyyyyy: ", emailBody);
//   // const browser = await gologin.launch({
//   //   headless: false,
//   //   args: [
//   //     "--no-sandbox",
//   //     "--disable-setuid-sandbox",
//   //     "--disable-dev-shm-usage",
//   //     "--disable-blink-features=AutomationControlled",
//   //     "--window-size=1200,800",
//   //   ],
//   // });

//   // spintax replace in body
//   // const spintaxes = await Spintax.find();
//   // replaceBodySpintax(emailBody, spintaxes);
//   // replaceReceiverFirstName(emailBody, campaign); // replace receiver's first name
//   const { browser } = await gologin.launch();

//   const loginUrl =
//     "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com&hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin";
//   const page = await browser.newPage();

//   const ua = await browser.userAgent();
//   await page.setUserAgent(ua);

//   // Navigate to the login page
//   await page.goto(loginUrl, { waitUntil: "networkidle2" });

//   // Log in with email
//   await page.waitForSelector('input[type="email"]', { timeout: 10000 });
//   await page.type('input[type="email"]', googleUsername, { delay: 100 });
//   await page.keyboard.press("Enter");

//   // Wait for the password input field
//   await page.waitForSelector('input[type="password"]', { timeout: 10000 });
//   await setTimeout(5000);
//   await page.type('input[type="password"]', googlePassword, { delay: 100 });
//   await page.keyboard.press("Enter");

//   // Wait for redirection to Gmail
//   try {
//     await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 20000 });
//     console.log("Logged into Gmail successfully!");
//   } catch (error) {
//     console.log("Login may require manual intervention.");
//   }

//   // Compose a new email
//   try {
//     await page.waitForSelector(".T-I.T-I-KE.L3", { timeout: 10000 }); // "Compose" button
//     await page.click(".T-I.T-I-KE.L3");

//     // Wait for the "To" input field and type recipient email
//     await page.waitForSelector("input[type='text']", { timeout: 10000 });
//     await page.type("input[type='text']", recipientEmail, { delay: 300 });

//     // Type the email subject
//     await page.type("input[name='subjectbox']", emailSubject, { delay: 300 });

//     // Type the email body
//     await page.click("div[aria-label='Message Body']");
//     await page.type("div[aria-label='Message Body']", emailBody, {
//       delay: 100,
//     });

//     // Send the email
//     // await page.click("div[aria-label*='Send']");
//     // await page.keyboard.press("Enter");
//     // Wait for the Send button and click it
//     await page.waitForSelector("div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3", {
//       timeout: 10000,
//     });
//     await page.click("div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3");
//     console.log("Email sent successfully!");
//   } catch (error) {
//     console.log("Failed to send the email:", error);
//   }

//   // Optional: Close the browser after 10 seconds
//   await setTimeout(10000);
//   await browser.close();
// };
 */
