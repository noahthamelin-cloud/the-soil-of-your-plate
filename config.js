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
  familyTable: "/family-table/",                   // the sales page on this site (VSL + checkout). Soil and source are passed along.
  shop: "https://kayla-bundy.vercel.app/shop",
  bundle: "https://buy.stripe.com/7sY7sK59TfhP2py5oO9AA04"   // Masterclass Bundle, $147 (ebook included)
};
const GUIDE = "assets/pdfs/Biblical-Eating-Foundation-Guide.pdf";
const ART = "assets/soil/";   // parable illustrations (WebP), see README

const OFFER = {
  tablePath: { title: "The 40-Day Family Table", button: "See the 40-Day Family Table", url: LINKS.familyTable,
    body: "If food has never felt like part of your faith, this is the gentlest place to start. Forty days with the plan handed to you and your family at the table. Starts January 1." },
  tableRocky: { title: "The 40-Day Family Table", button: "See the 40-Day Family Table", url: LINKS.familyTable,
    body: "You" + "\u2019" + "re already doing most of it. The 40-Day Family Table gives you the roots: a rhythm, Scripture that grounds you, and women walking with you. Starts January 1." },
  ebook: { title: "Eat Like the Bible", button: "Get the ebook, $27", url: LINKS.ebook,
    body: "Know exactly what to put on your plate and why God made it. The perfect place to begin. $27, instant download." },
  academyTrial: { title: "The Biblical Eating Academy", button: "Start your 7-day free trial", url: LINKS.academy,
    body: "Grow deeper roots alongside women walking the same road, inside my private community on Skool. Free for 7 days, then $50 a month or $550 a year." },
  tableThorns: { title: "The 40-Day Family Table", button: "Join the 40-Day Family Table", url: LINKS.familyTable,
    body: "Forty days with the plan, the grocery lists and the weekly prep handed to you, and your family at the table. Starts January 1. Early families get launch pricing." },
  tableGood: { title: "The 40-Day Family Table", button: "Join the 40-Day Family Table", url: LINKS.familyTable,
    body: "Forty days to turn your rhythm into your family’s rhythm, with meals your husband and kids will actually eat. Starts January 1. Early families get launch pricing." }
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

  /* Kayla's photos through the quiz. [file, focus] where focus is the CSS object-position (which part of the photo stays in frame).
     Set any one to null to hide it. Files live in assets/kayla/ as q-NN-800.webp and q-NN-1200.webp. */
  photos: {
    intro:     ["13", "50% 10%"],
    questions: [["02","50% 10%"], ["06","50% 10%"], ["15","50% 10%"], ["09","50% 20%"], ["19","50% 10%"], ["20","50% 20%"], ["21","50% 20%"]],
    gate:      { photo: ["16","50% 10%"], line: "Your free guide is ready to download the moment you finish." },
    results:   ["10","50% 32%"],
    /* Social proof shown on the results page before Kayla's note (same quotes as the sales page). */
    proof: {"kicker": "From women already eating this way", "heading": "Their families are at the table", "row1": [["Having a plan set and laid out for me is what I knew I needed.", "Member"], ["My husband LOVED the shakshuka and said to add it to the rotation.", "Member"], ["Day 3 dinner. My husband also had the soup and loved it.", "Member"], ["I did the gut board today and my younger son wanted to eat most of it.", "Member"], ["Usually we’d only pray over our dinner when we’re all together. Such a shift to truly pray and give thanks for everything.", "Christina"]], "row2": [["It has been truly life-changing and in a way I never anticipated.", "Member"], ["I feel so much closer to God and praying over my food makes me feel even more grateful for all He provides.", "Courtney"], ["Just starting to see food, actual food, as such a gift.", "Christina"], ["It’s a great way to get closer to God while learning a whole new relationship with food that will change your life.", "Member"], ["I don’t need all the bad foods just to celebrate something.", "Member"], ["I see it now as active obedience to the Lord, and that my choices are going to make a difference in how I function and treat others.", "Member"]], "note": "Real words from real women in Kayla’s community, shared with permission. Results vary.", "ribbon": ["f-dragon2", "f-redrice", "f-raspberries", "f-board2", "f-lentil", "f-beet", "f-berries", "f-dragon"], "ribbonCap": "Every colour He made"},
    note:      { photo: ["12","45% 35%"], kicker: "A note from Kayla",
                 body: "Wherever your plate is today, God isn\u2019t done with your table. I built the 40-Day Family Table so you don\u2019t have to figure this out alone. I\u2019d love to have your family with us in January.",
                 sign: "Kayla" }
  },

  defaultAssessment: "soil",
  linkBetweenAssessments: false,

  gate: {
    ready: "The seed is in the ground.",
    heading: "Your result is ready.",
    body: "Add your first name and email to see where your plate is right now, plus my free Biblical Eating Foundation Guide.",
    fields: [
      { key: "name",      label: "First name", type: "text",  required: true,  autocomplete: "given-name" },
      { key: "email",     label: "Email",      type: "email", required: true,  autocomplete: "email" },
      { key: "whatsapp",  label: "WhatsApp number", type: "tel", required: false, autocomplete: "tel",
        hint: "So I can personally send you your next step." },
      { key: "instagram", label: "Instagram handle", type: "text", required: false, autocomplete: "off", prefix: "@",
        hint: "So we can find you if you message me on Instagram." }
    ],
    consent: "By continuing you agree that Kayla and her team can contact you by email or WhatsApp about your result, the 40-Day Family Table and the Biblical Eating Academy. Unsubscribe or reply STOP anytime.",
    button: "Show my result",
    note: "Your answers go to Kayla and her team only. Nothing is shared or sold."
  },

  offers: { heading: "", items: [] },

  /* Shown under every result's buttons (Kayla, Nov 20): her own-pace products beside the community. Skipped when a result already uses that link. */
  moreLinks: { label: "Prefer to go at your own pace?", items: [
    { text: "Eat Like the Bible ebook, $27", url: LINKS.ebook },
    { text: "The Masterclass Bundle, $147 (ebook included)", url: LINKS.bundle } ] },   // each soil carries its own button (see patterns below)

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
          cta: OFFER.tablePath,
          notReady: { text: "Not ready? Peek inside with a 7-day free trial in the Academy", url: LINKS.academy },
          video: "https://youtu.be/XfpBCy4Pxes", pdf: GUIDE },

        rocky: { name: "Rocky ground", headline: "Your plate is on rocky ground.",
          means: "You’re doing almost everything right, which is exactly why it’s so frustrating. You’ve got a great start, but no deep roots, so one hard week knocks you back. The missing 10 percent is where the change lives.",
          stage: "Renew and Tend",
          next: "Grow a deeper why, and stop doing this alone. The 40-Day Family Table gives you a rhythm, Scripture that roots you, and women who keep you going.",
          guideStart: "Section Five, “What the Modern Diet Got Wrong” (pages 6 to 7)",
          week: "Read the ingredient list on everything you buy. More than 5 ingredients, put it back. Then swap out whatever you find using Section Six.",
          action: "Read every ingredient list this week. More than 5 ingredients goes back. Swap using Section Six.",
          scene: { base: ART + "rocky-base.webp", layers: [{ src: ART + "rocky-sprout.webp", cls: "sprout" }, { src: ART + "rocky-wilted.webp", cls: "wilted" }],
            verse: "Because they had no root, they withered away.", ref: "Matthew 13:6" },
          cta: OFFER.tableRocky,
          notReady: { text: "Not ready? Start a 7-day free trial in the Academy", url: LINKS.academy },
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
