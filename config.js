/* =====================================================================
   INTERACTIVE CLIENT ACQUISITION  |  Coach config
   Coach: Kayla Bundy, The Biblical Nutritionist
   Quiz: Which soil is your plate? (brief of Nov 19, 2026; replaces the Starting Point Quiz)

   Everything a person reads lives in this one file. Rules:
   - No em dashes in anything a person will read.
   - No weight numbers, calorie talk, or claims to cure or heal anything.
   - A soil is "where your plate is right now", never a label for life.
   - The ebook and masterclass are sold only on Kayla's website. Never say they are inside the Academy.
   - Never promise weekly meal plans, live calls or recipe vaults inside the Academy.
   - Coaching is never offered here.
   ===================================================================== */
(() => {
const LINKS = {
  academy: "https://www.skool.com/understanding-the-bible-8591/about",
  ebook: "https://kayla-bundy.vercel.app/eat-like-the-bible",
  familyTable: "PASTE_FAMILY_TABLE_LINK",          // Kayla to send. Until then the button shows "Link coming soon".
  shop: "https://kayla-bundy.vercel.app/shop"
};
const GUIDE = "assets/pdfs/Biblical-Eating-Foundation-Guide.pdf";
const ART = "assets/soil/";   // parable illustrations (WebP), see README

const OFFER = {
  ebook: { title: "Eat Like the Bible", button: "Get the ebook, $27", url: LINKS.ebook,
    body: "Know exactly what to put on your plate and why God made it. The perfect place to begin. $27, instant download." },
  academyTrial: { title: "The Biblical Eating Academy", button: "Start your 7-day free trial", url: LINKS.academy,
    body: "Grow deeper roots alongside women walking the same road, inside my private community on Skool. Free for 7 days, then $50 a month or $550 a year." },
  tableThorns: { title: "The 40-Day Family Table", button: "Join the 40-Day Family Table", url: LINKS.familyTable,
    body: "Forty days with the plan, the grocery lists and the weekly prep handed to you, and your family at the table. Founding price $497, or 3 payments of $249." },
  tableGood: { title: "The 40-Day Family Table", button: "Join the 40-Day Family Table", url: LINKS.familyTable,
    body: "Forty days to turn your rhythm into your family’s rhythm, with meals your husband and kids will actually eat. Founding price $497, or 3 payments of $249." }
};

window.ICA = {

  coach: {
    slug: "kayla",                     // must match COACH_SLUG on Netlify
    name: "The Biblical Nutritionist",
    owner: "Kayla Bundy",
    logo: "",
    programLine: ""
  },

  /* Parable art: sower's hand on the intro, a furrow that fills with seeds as the progress bar, the planted seed on the form. */
  art: { hand: ART + "sower-hand.webp", seed: ART + "seed.webp", furrow: ART + "furrow.webp", planted: ART + "planted.webp" },

  defaultAssessment: "soil",
  linkBetweenAssessments: false,

  gate: {
    ready: "The seed is in the ground.",
    heading: "Your result is ready.",
    body: "Add your first name and email to see where your plate is right now, plus my free Biblical Eating Foundation Guide.",
    fields: [
      { key: "name",      label: "First name", type: "text",  required: true,  autocomplete: "given-name" },
      { key: "email",     label: "Email",      type: "email", required: true,  autocomplete: "email" },
      { key: "instagram", label: "Instagram handle", type: "text", required: false, autocomplete: "off", prefix: "@",
        hint: "So we can find you if you message me on Instagram." }
    ],
    consent: "By continuing you agree that Kayla and her team can email you about your result and the Biblical Eating Academy. Unsubscribe anytime.",
    button: "Show my result",
    note: "Your answers go to Kayla and her team only. Nothing is shared or sold."
  },

  offers: { heading: "", items: [] },   // each soil carries its own button (see patterns below)

  assessments: {
    soil: {
      id: "soil",
      title: "Which soil is your plate?",
      subtitle: "Same seed. Four different results. The difference is the soil.",
      lede: "In the parable of the sower, the seed never changes. The soil does. Seven quick questions show where your plate is right now, and exactly where to start in my free Biblical Eating Foundation Guide.",
      minutes: "About 2 minutes",
      privacy: "A reflection tool, not medical advice.",

      layout: "steps",
      shuffle: true,                    // answer order shuffles on every question
      tieBreak: 4,                      // question 5 (biggest obstacle) breaks ties
      patternKicker: "Where your plate is right now",
      patternWord: "soil",
      overall: false,
      patternOrder: ["thorns", "rocky", "path", "good"],

      patterns: {
        path: { name: "The path", headline: "Your plate is on the path.",
          means: "You’ve been told food doesn’t matter to God. That’s the seed that never got a chance to land. Scripture says otherwise, and your body has probably been trying to tell you too.",
          stage: "Renew",
          next: "Start by renewing how you see food. Open your free Biblical Eating Foundation Guide and see what God actually says about what’s on your plate.",
          guideStart: "Section One, “Your Body Is a Temple” (pages 1 to 2)",
          week: "Journal your answers to the “Three Questions Worth Sitting With” on page 2. Then read Section Two to see how much God actually says about food.",
          action: "Journal the Three Questions Worth Sitting With (page 2), then read Section Two.",
          scene: { base: ART + "path-base.webp", layers: [{ src: ART + "path-birds.webp", cls: "birds" }],
            verse: "Some seeds fell by the way side, and the fowls came and devoured them up.", ref: "Matthew 13:4" },
          cta: OFFER.ebook,
          notReady: { text: "Not ready? Peek inside with a 7-day free trial in the Academy", url: LINKS.academy },
          video: "https://youtu.be/XfpBCy4Pxes", pdf: GUIDE },

        rocky: { name: "Rocky ground", headline: "Your plate is on rocky ground.",
          means: "You’re doing almost everything right, which is exactly why it’s so frustrating. You’ve got a great start, but no deep roots, so one hard week knocks you back. The missing 10 percent is where the change lives.",
          stage: "Renew and Tend",
          next: "Grow a deeper why, and stop doing this alone. Inside the Academy you’ll find a rhythm, Scripture that roots you, and women who keep you going.",
          guideStart: "Section Five, “What the Modern Diet Got Wrong” (pages 6 to 7)",
          week: "Read the ingredient list on everything you buy. More than 5 ingredients, put it back. Then swap out whatever you find using Section Six.",
          action: "Read every ingredient list this week. More than 5 ingredients goes back. Swap using Section Six.",
          scene: { base: ART + "rocky-base.webp", layers: [{ src: ART + "rocky-sprout.webp", cls: "sprout" }, { src: ART + "rocky-wilted.webp", cls: "wilted" }],
            verse: "Because they had no root, they withered away.", ref: "Matthew 13:6" },
          cta: OFFER.academyTrial,
          notReady: { text: "Get the Eat Like the Bible ebook ($27) and start on your own", url: LINKS.ebook },
          video: "https://youtu.be/XfpBCy4Pxes", pdf: GUIDE },

        thorns: { name: "Thorns", headline: "Your plate is among the thorns.",
          means: "You love this. You want this. But busy days, budget, a picky family and food noise keep choking it out. You don’t need more information. You need fewer thorns and someone walking with you.",
          stage: "Plant and Tend",
          next: "The 40-Day Family Table hands you the plan, the grocery lists and the weekly prep, so you don’t have to figure it out. You just follow it, with your family at the table.",
          guideStart: "Section Six, “Simple Biblical Swaps” (pages 7 to 8)",
          week: "Make just ONE swap: replace every cooking oil in your kitchen with extra virgin olive oil. Next week, pick one more.",
          action: "One swap: replace every cooking oil with extra virgin olive oil. Next week, one more.",
          scene: { base: ART + "thorns-base.webp", layers: [{ src: ART + "thorns-overlay.webp", cls: "thorns" }],
            verse: "And some fell among thorns; and the thorns sprung up, and choked them.", ref: "Matthew 13:7" },
          cta: OFFER.tableThorns,
          notReady: { text: "Not ready? Start a 7-day free trial in the Academy", url: LINKS.academy },
          video: "https://youtu.be/XfpBCy4Pxes", pdf: GUIDE },

        good: { name: "Good soil", headline: "Your plate is good soil.",
          means: "You’re rooted, and it shows. You don’t restart anymore. You return. Now your harvest is meant to spread: to your husband, your kids and the women around you.",
          stage: "Harvest",
          next: "Bring your whole family into it. The 40-Day Family Table turns your rhythm into your family’s rhythm, with kid-friendly meals and Little Learners lessons for the kids.",
          guideStart: "Section Seven, “Bringing Your Plate to God” (pages 8 to 9)",
          week: "Pray the prayer on page 8 for your family. Then lead them in 30 seconds of real thanks before one meal every day.",
          action: "Pray the page 8 prayer for your family, then lead 30 seconds of thanks before one meal a day.",
          scene: { base: ART + "good-base.webp", layers: [{ src: ART + "wheat-30.webp", cls: "wheat w30" }, { src: ART + "wheat-60.webp", cls: "wheat w60" }, { src: ART + "wheat-100.webp", cls: "wheat w100" }],
            verse: "But other fell into good ground, and brought forth fruit, some an hundredfold, some sixtyfold, some thirtyfold.", ref: "Matthew 13:8" },
          cta: OFFER.tableGood,
          notReady: { text: "Not ready? Join the Academy and encourage other women on the way", url: LINKS.academy },
          video: "https://youtu.be/XfpBCy4Pxes", pdf: GUIDE }
      },

      dimensions: {},
      groups: [],
      rules: [],

      scenarioHint: "Pick the one that sounds most like you right now.",

      /* Option order here doesn't matter: answers shuffle on screen. Second item = the soil it scores. Never shown. */
      questions: [
        { type: "scenario", part: "What you believe", q: "When you hear “biblical eating”, what do you think?",
          opts: [["Sounds extreme. I don’t think God cares what I eat.", "path"],
                 ["I already eat pretty clean, so I’m probably fine.", "rocky"],
                 ["I love the idea, I just don’t know how I’d fit it in.", "thorns"],
                 ["It’s already how I try to eat.", "good"]] },
        { type: "scenario", part: "In the moment", q: "It’s 3pm and a craving hits. What usually happens?",
          opts: [["I eat what I want. Life’s short.", "path"],
                 ["I hold out, then cave and feel annoyed with myself.", "rocky"],
                 ["I grab whatever’s fastest because I’m running on empty.", "thorns"],
                 ["I eat something real and the craving passes.", "good"]] },
        { type: "scenario", part: "When life gets busy", q: "What happens to your eating after a holiday or a party?",
          opts: [["Nothing changes, I eat the same either way.", "path"],
                 ["I fall off and restart on Monday.", "rocky"],
                 ["It takes weeks to get back, because life is already full.", "thorns"],
                 ["I go back to my normal meals the next day.", "good"]] },
        { type: "scenario", part: "Your body", q: "How do you feel in your body most days?",
          opts: [["I don’t really think about it.", "path"],
                 ["Okay, but not as good as I should for how hard I try.", "rocky"],
                 ["Tired, bloated and stretched thin.", "thorns"],
                 ["Strong, clear and grateful.", "good"]] },
        { type: "scenario", part: "What’s in the way", q: "What’s your biggest obstacle with food right now?",
          opts: [["I don’t really have one.", "path"],
                 ["I’m doing 90 percent and can’t figure out the last 10.", "rocky"],
                 ["Time, money, a picky family or food noise.", "thorns"],
                 ["Staying consistent as life changes.", "good"]] },
        { type: "scenario", part: "Your faith", q: "Where does God fit into how you eat?",
          opts: [["He doesn’t really.", "path"],
                 ["I pray before meals, but that’s about it.", "rocky"],
                 ["I want Him in it, I just haven’t figured out how.", "thorns"],
                 ["Every meal is a way to thank Him and steward my body.", "good"]] },
        { type: "scenario", part: "A year from now", q: "What would you most want a year from now?",
          opts: [["Honestly, I’m just curious.", "path"],
                 ["To finally feel as good as I’m working for.", "rocky"],
                 ["To stop feeling overwhelmed and have peace with food.", "thorns"],
                 ["A body I’m proud of, and a family that eats this way because I showed them how freeing it is.", "good"]] }
      ],

      results: {
        season: "Women move between soils by season. This is where your plate is right now, not a label for life.",
        stageLabel: "Your next step",
        guideLabel: "Start here in your free guide",
        weekLabel: "Do this week",
        pdfBody: "Every result gets the full guide. This is the part to open first.",
        pdfButton: "Download the free guide",
        videoTitle: "My story",
        soon: "Doors open soon. Link coming shortly.",
        note: "Food is not the enemy, but it is what the enemy will always use to distort, manipulate and separate you from God.",
        care: "This is a starting point, not medical advice. If you’re pregnant, nursing, managing a health condition or taking medication, talk to your doctor before big changes. And if food has been feeling out of control, please reach out to your doctor or a counselor. You don’t have to carry it alone."
      }
    }
  }
};
})();
