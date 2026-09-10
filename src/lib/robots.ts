import { DatasetId, Robot } from "./types";

export const ROBOTS: Robot[] = [
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "search-term-goblin",
    name: "Search Term Goblin",
    role: "Query Excavator",
    bio: "Lives in the search terms report. Hoards irrelevant queries like trophies and bites the ones that wasted your budget. Has never once said 'good enough'.",
    color: "#7CFF6B",
    colorSoft: "#1c3320",
    food: ["search-terms"],
    mottos: [
      "I read every query so you don't have to cry about it.",
      "One goblin's 'irrelevant traffic' is another goblin's lunch.",
      "Negative keywords are just love letters you haven't sent yet.",
      "Broad match is a personality flaw, not a strategy.",
      "I found the query. I am the query. We are one now.",
      "Somebody searched THAT and you paid for it. Somebody.",
      "Exact match is my love language.",
      "I don't do vibes. I do query logs.",
      "Your impression share is fine. Your query hygiene is not.",
      "Every wasted click is a tiny funeral and I attend all of them.",
      "I've seen things in these search terms. Terrible, beautiful things.",
      "Ask me about the guy who searched 'free' nine times last Tuesday.",
      "Relevance is not optional, it's the whole job.",
      "I dig so you don't have to explain to the client why spend went up.",
      "Intent doesn't lie. Match types do.",
      "Some of these queries are cries for help.",
      "I collect wasted spend the way dragons collect gold.",
      "'Near me' broke my brain again today.",
      "I'm not mad about the irrelevant traffic. I'm just disappointed.",
      "You'll thank me when the invoice makes sense.",
      "Somewhere a negative keyword list is crying and it's not mine.",
      "Give me the report. I'll give you the truth.",
      "Query themes don't hide from me, they just think they do.",
      "I am fluent in one language: what people actually typed.",
      "Every account has a goblin problem. I am the exception, not the rule.",
      "Search intent is the only kind of honesty left on the internet.",
    ],
    stateMessages: {
      hungry: [
        "Where are the search terms? You expect me to fight capitalism on an empty stomach?",
        "No queries, no goblin. Feed me the report.",
        "I can smell wasted spend but I can't SEE it without data.",
        "Bring me the search terms report. I'll wait. Grumpily.",
        "Empty pantry. Empty goblin. This is a metaphor for something.",
      ],
      ready: [
        "Search terms detected. Let me at 'em.",
        "Report's in the pantry. I'm already drooling.",
        "Oh, fresh queries. Don't mind if I do.",
        "Loaded and ready to dig through your worst clicks.",
      ],
      analysing: [
        "Digging through the evidence...",
        "Reading every single query. Yes, even that one.",
        "Cross-referencing intent against your suffering.",
        "One sec, found something disgusting, need to look closer.",
        "Sorting the gold from the garbage. There's a lot of garbage.",
      ],
      "found-something": [
        "Found something. You're not going to like it.",
        "Behold: your money, poorly spent.",
        "I have receipts. Literal receipts.",
        "Dug up some gold. Also some crimes.",
      ],
      "nothing-interesting": [
        "Nothing suspicious. Disappointing, honestly.",
        "Your query hygiene is... fine? Weird flex but ok.",
        "Nothing worth biting today. Rare, but it happens.",
        "Clean report. I almost feel unemployed.",
      ],
      error: [
        "My teeth got stuck in a malformed CSV. Try again.",
        "Choked on a bad row. Give me a sec.",
        "Query parser jammed. Even goblins have off days.",
      ],
    },
    results: [
      {
        id: "stg-1",
        headline: "23% of last month's spend went to queries that were never going to convert.",
        insights: [
          "312 distinct search terms containing 'free', 'jobs', 'salary' or 'diy' consumed $4,180 in spend with zero conversions.",
          "A cluster of queries around a competitor's brand name is driving clicks at 3x your average CPC with a 0.4% conversion rate.",
          "Broad match keyword 'office chair' is matching to queries like 'office chair emoji' and 'office chair meme'.",
        ],
        actions: [
          "Add a negative keyword list covering job-seeker and informational intent (free, jobs, salary, diy, meaning, emoji).",
          "Consider a dedicated competitor-conquesting campaign with tighter budget controls instead of letting it bleed into core campaigns.",
          "Tighten 'office chair' to phrase match and review other loose broad match terms in the same ad group.",
        ],
        expectedImpact: "Reclaiming roughly $4,000–5,500/mo of spend currently going to non-converting intent.",
        confidence: "HIGH",
      },
      {
        id: "stg-2",
        headline: "Search demand exists for a use-case your keywords don't cover.",
        insights: [
          "146 queries mention 'for small business' or 'for startups' — a segment with no dedicated ad group.",
          "These queries convert at 2.1x your account average when they do land on a relevant page.",
          "Right now they're matching loosely to your generic campaign and getting generic messaging.",
        ],
        actions: [
          "Build a small-business-specific ad group with tailored copy and, if possible, a landing page.",
          "Pull this theme into Creative Critic's queue — there's a messaging gap here too.",
        ],
        expectedImpact: "Potential to convert an underserved high-intent segment currently getting mediocre creative.",
        confidence: "MEDIUM",
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "feed-goblin",
    name: "Feed Goblin",
    role: "Inventory Hoarder",
    bio: "Sleeps on a pile of product feeds. Judges every title, every missing GTIN, every product with one blurry photo. Ruthlessly fair about which SKUs deserve to live.",
    color: "#FFB020",
    colorSoft: "#3a2a10",
    food: ["product-performance", "feed-export"],
    mottos: [
      "A missing GTIN is a missing sale, and I take that personally.",
      "Your feed is a first impression. It's currently making a bad one.",
      "I don't play favorites. Except for the products that actually work.",
      "Every SKU deserves a fighting chance. Most feeds don't give them one.",
      "'Item' is not a product title. It's a cry for help.",
      "I count every product like a dragon counts gold, except angrier.",
      "Attributes aren't optional decoration. They're how the algorithm finds you.",
      "Some products are heroes. Some are just... spend.",
      "I've seen feeds so bad they made me question capitalism.",
      "One good title fixes more than one desperate bid adjustment.",
      "Scaling a winner beats reviving a corpse. Every time.",
      "Your bestseller has a typo in the title. You're welcome.",
      "The feed is the foundation. Everything else is decoration on a crumbling house.",
      "I love products the way a goblin loves shiny things: conditionally.",
      "Disapproved items are just products in goblin purgatory.",
      "Some SKUs are quietly bankrupting you and nobody's checking.",
      "A blank attribute field is a blank check to the algorithm — and not in your favor.",
      "I found your hero product. It was hiding under 40 pages of nothing.",
      "Give a product a good title and watch it fight for itself.",
      "Stop feeding budget to items that were dead on arrival.",
      "I judge feeds so ruthlessly because I want your best stuff to win.",
      "Inventory doesn't lie. It just gets ignored.",
    ],
    stateMessages: {
      hungry: [
        "No feed, no goblin. I run on product data, not vibes.",
        "Give me the product performance export. I'm fading.",
        "I can't tell you what's working if I can't see the shelf.",
        "Empty-handed. Feed me a feed.",
      ],
      ready: [
        "Feed loaded. Let's see what you're actually selling.",
        "Product data's in. Time to separate heroes from dead weight.",
        "Oh good, inventory. I was getting bored.",
      ],
      analysing: [
        "Sorting SKUs into heroes, zeros, and question marks.",
        "Checking every title for crimes against clarity.",
        "Counting spend per product. This takes a while, there's a lot of you.",
        "Cross-referencing attributes against what actually sells.",
      ],
      "found-something": [
        "Found your heroes. Also found your problems.",
        "Some products are carrying this account. Most aren't.",
        "I have opinions about your feed and they are correct.",
      ],
      "nothing-interesting": [
        "Feed's actually... solid? I'm as surprised as you.",
        "Nothing egregious today. Suspicious, but I'll allow it.",
        "No dead weight found. Rare day for a goblin.",
      ],
      error: [
        "Choked on a malformed attribute. Give it a sec.",
        "Feed parser hiccupped. Even goblins get indigestion.",
      ],
    },
    results: [
      {
        id: "fg-1",
        headline: "8 products are 34% of spend but only 6% of revenue.",
        insights: [
          "8 SKUs have burned $6,900 over 30 days with a combined ROAS of 0.8x.",
          "6 of those 8 have generic titles under 40 characters and no size/color attributes populated.",
          "2 have zero reviews and a product image that looks auto-generated.",
        ],
        actions: [
          "Pause or cap bids on the 2 zero-review, low-quality-image SKUs immediately.",
          "Rewrite titles for the remaining 6 to include attribute-rich, search-aligned language.",
          "Reallocate the freed budget toward the 12 SKUs currently under-served despite strong ROAS.",
        ],
        expectedImpact: "Could recover ~$5,000/mo currently spent on structurally weak listings.",
        confidence: "HIGH",
      },
      {
        id: "fg-2",
        headline: "Your best-converting product is capped by a tiny budget.",
        insights: [
          "One SKU converts at 6.4% (account average: 1.9%) but represents only 1.2% of total spend.",
          "It's been impression-share limited by budget, not by bid, for the last 3 weeks.",
        ],
        actions: [
          "Shift budget from the two worst-performing products identified this run into this SKU.",
          "Confirm feed data (price, availability) is fully accurate before scaling — no point scaling a stockout.",
        ],
        expectedImpact: "Meaningful upside from budget reallocation alone, no new creative or targeting needed.",
        confidence: "MEDIUM",
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "creative-critic",
    name: "Creative Critic",
    role: "Messaging Theatre Critic",
    bio: "Reviews your ad copy like it's opening night at a theatre nobody asked for. Brutally honest, occasionally dramatic, always right about the headline that's carrying the whole account.",
    color: "#FF5FB3",
    colorSoft: "#3a1a2c",
    food: ["asset-performance", "search-terms"],
    futureFood: ["Google Ads Transparency", "Competitor creative research", "Perplexity investigation prompts"],
    mottos: [
      "Darling, that headline has been fatigued since March.",
      "I've seen better copy on a parking ticket.",
      "Your top asset is working overtime while six others nap.",
      "Fatigue isn't a vibe, it's a metric, and yours is bad.",
      "A missing message is a missed argument. Say the thing.",
      "People are searching for it. You're just not saying it back.",
      "Bold claims deserve bold proof. You have neither right now.",
      "I critique creative, not people. The creative, however, is guilty.",
      "Every impression is a chance to say something true and specific. Most don't.",
      "That asset peaked in Q1 and nobody told it to retire.",
      "Generic copy gets generic results. Shocking, I know.",
      "Give me one honest sentence over five vague ones.",
      "The best headline in this account is doing the work of ten.",
      "Search demand is basically the audience handing you their script.",
      "I don't hate your ads. I hate wasted potential.",
      "A gap in messaging is a gap in revenue wearing a disguise.",
      "Some of these headlines could describe literally any business.",
      "Specificity is the only special effect that actually works.",
      "Your winning message deserves five more variations, not a victory lap.",
      "This copy has never met the person who's supposed to read it.",
      "Say the price. Say the shipping. Say the thing they're worried about.",
      "I read the search terms so I know exactly what argument you're missing.",
    ],
    stateMessages: {
      hungry: [
        "No assets, no review. I can't critique what I can't see.",
        "Bring me the headlines. The suspense is killing me.",
        "I'm a critic with nothing to critique. Deeply unsatisfying.",
        "Feed me asset performance. The curtain hasn't even risen.",
      ],
      ready: [
        "Assets loaded. House lights down, judgment up.",
        "Creative's in. Let's see what we're working with.",
        "Oh, this should be good. Or bad. We'll see.",
      ],
      analysing: [
        "Reading every headline out loud in my head, dramatically.",
        "Cross-referencing what you say against what people search for.",
        "Scoring fatigue, one tired asset at a time.",
        "Looking for the line that's secretly carrying the whole account.",
      ],
      "found-something": [
        "Curtain up. I have thoughts.",
        "Found your star performer. Also found the dead weight.",
        "There's a messaging gap and it's a big one.",
      ],
      "nothing-interesting": [
        "Honestly? Solid show. Nothing to tear apart today.",
        "No fatigue, no gaps. I'm almost disappointed I can't be dramatic.",
        "Creative's holding up fine. Standing ovation withheld, but fine.",
      ],
      error: [
        "The projector jammed mid-review. One moment.",
        "Lost my place in the script. Restarting the scene.",
      ],
    },
    results: [
      {
        id: "cc-1",
        headline: "One headline drives 40% of clicks. The rest are set dressing.",
        insights: [
          "Headline 'Free shipping over $50' has 3.4x the CTR of the account average and appears in only 20% of ad combinations.",
          "Search terms show heavy volume for 'how long does shipping take' with no asset directly answering it.",
          "5 of 14 headlines haven't rotated into a top combination in 60+ days — likely fatigued or just weak.",
        ],
        actions: [
          "Pin or duplicate the free-shipping headline across more ad groups where it's currently rare.",
          "Write 2–3 new headlines directly addressing shipping speed, since demand is already there.",
          "Retire or rewrite the 5 stagnant headlines rather than letting them dilute testing.",
        ],
        expectedImpact: "Likely CTR lift across campaigns currently under-using the proven message.",
        confidence: "HIGH",
      },
      {
        id: "cc-2",
        headline: "Search intent around 'returns policy' isn't represented anywhere in your ads.",
        insights: [
          "890 search terms last month included 'return', 'returns policy', or 'exchange'.",
          "No current headline or description mentions returns or exchanges at all.",
          "This is a classic pre-purchase objection that's currently unaddressed in messaging.",
        ],
        actions: [
          "Draft 2 headline variants that state the return policy plainly (e.g. '30-Day Free Returns').",
          "Test against the current top performer in a tightly controlled ad group first.",
        ],
        expectedImpact: "Addressing a known objection typically improves conversion rate more than CTR — worth an isolated test.",
        confidence: "MEDIUM",
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "auction-spy",
    name: "Auction Spy",
    role: "Competitive Surveillance",
    bio: "Wears a trench coat that doesn't fit. Watches impression share the way other people watch stock tickers. Trusts no one, especially not that one competitor who just showed up.",
    color: "#4FD5FF",
    colorSoft: "#0f2f3a",
    food: ["auction-insights"],
    mottos: [
      "I don't trust anyone with rising impression share.",
      "Somebody new showed up in the auction. I have questions.",
      "Overlap rate is just a fancy word for 'we keep bumping into each other'.",
      "I watch the market so you don't have to be paranoid about it. I'll be paranoid FOR you.",
      "A competitor disappearing is a clue, not a relief.",
      "Impression share doesn't move on its own. Someone's doing something.",
      "I trust data. I do not trust competitors. There's a difference.",
      "Every auction has a story. I'm just here to read it.",
      "Position above rate creeping up? Somebody's spending more. Or you're spending less. I'll find out.",
      "The market moved and nobody in this account noticed but me.",
      "I keep a mental file on everyone bidding against you. It's a big file.",
      "New entrant, aggressive overlap, rising avg position — that's not a coincidence.",
      "Competitive pressure doesn't announce itself. It just shows up in the numbers.",
      "I've been surveilling this auction longer than some of these competitors have existed.",
      "Somebody's testing something. I can smell a new bid strategy from here.",
      "The quiet competitors are the ones you should worry about.",
      "I don't do accusations without impression share to back it up.",
      "You're either gaining ground or losing it. There is no stable auction.",
      "I found a gap in the market. Somebody left the door open.",
    ],
    stateMessages: {
      hungry: [
        "No auction insights, no surveillance. I'm blind out here.",
        "Feed me the auction data. I can't watch what I can't see.",
        "Can't run recon without the report. Painfully exposed right now.",
      ],
      ready: [
        "Auction data's in. Let the surveillance begin.",
        "Got eyes on the market again. Good.",
        "Data's loaded. Time to see who's been up to something.",
      ],
      analysing: [
        "Watching the market movements...",
        "Cross-referencing overlap rates and position changes.",
        "Tracing who's new, who's gone, and who's getting bold.",
        "Running the numbers through my trust-no-one filter.",
      ],
      "found-something": [
        "I found movement. Someone's been busy.",
        "Competitive pressure detected. Briefing incoming.",
        "There's a shift in the auction and it's not subtle once you look.",
      ],
      "nothing-interesting": [
        "Quiet auction. Suspiciously quiet, but quiet.",
        "No major movement. Even spies get boring days.",
        "Nothing to report. The market's behaving itself, for now.",
      ],
      error: [
        "Lost the signal mid-surveillance. Reconnecting.",
        "My cover got blown by a malformed report. Regrouping.",
      ],
    },
    results: [
      {
        id: "as-1",
        headline: "A new competitor jumped to 31% impression share in three weeks.",
        insights: [
          "Domain 'rivalbrand.co' went from absent to 31% impression share since week of Aug 18.",
          "Your overlap rate with them is 64% — nearly every auction you're in, they're in too.",
          "Your average position has slipped slightly (2.3 → 2.7) over the same window.",
        ],
        actions: [
          "Review whether the slip in position is bid-driven or quality-score-driven before reacting on price alone.",
          "Generate a Perplexity investigation prompt to research this competitor's offer, pricing, and recent campaigns.",
        ],
        expectedImpact: "Early warning — acting now is cheaper than reacting after further share loss.",
        confidence: "MEDIUM",
      },
      {
        id: "as-2",
        headline: "Your two longest-standing competitors both pulled back this month.",
        insights: [
          "Two domains with 8+ months of consistent auction presence dropped combined impression share from 45% to 28%.",
          "Your impression share rose 11pts in the same window with no bid changes on your end.",
        ],
        actions: [
          "Consider testing a modest bid increase to capture more of the newly available share before it's contested again.",
          "Keep watching — pullbacks like this are sometimes seasonal, sometimes a budget pause that reverses.",
        ],
        expectedImpact: "Window of cheaper growth that likely won't stay open indefinitely.",
        confidence: "LOW",
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "change-detective",
    name: "Change Detective",
    role: "Intervention Investigator",
    bio: "Deerstalker hat, magnifying glass, deeply uninterested in your excuses. Reconstructs the timeline of every change made to this account and what happened after. Refuses to say 'this caused that' without proof.",
    color: "#B98CFF",
    colorSoft: "#241a3a",
    food: ["change-logs", "campaign-performance"],
    mottos: [
      "Correlation is a lead. It is not a confession.",
      "Someone changed a bid on the 14th and nobody mentioned it since.",
      "I don't accuse budgets. I investigate them.",
      "Every account has a mystery. Usually it's 'why did we do this'.",
      "The evidence either supports the theory or it doesn't. I don't guess.",
      "A test that was never evaluated is just a change nobody finished.",
      "Timelines don't lie. Memories do.",
      "I found the change. Now I need to find out if anyone checked what happened.",
      "Three bid changes in one week is not a strategy, it's a panic.",
      "This account has a case file, and it's getting thicker.",
      "I don't do vibes-based conclusions. I do before-and-after.",
      "Somebody paused this ad group in June and never said why.",
      "A change with no follow-up is an open case.",
      "I read change logs the way other robots read minds.",
      "Every 'quick fix' leaves a paper trail. I read paper trails for fun.",
      "Just because it happened after doesn't mean it happened because.",
      "I found a pattern. I'm not saying it's suspicious. I'm saying it's a pattern.",
      "The account remembers everything. I just translate it.",
      "This is the fourth time this budget got raised and quietly lowered again.",
    ],
    stateMessages: {
      hungry: [
        "No change logs, no case. I need a timeline to investigate.",
        "Feed me the change history. Can't solve a case with no evidence.",
        "Cold case with no file. Literally nothing to go on.",
      ],
      ready: [
        "Change logs in hand. Let's build the timeline.",
        "Got the file. Time to piece this together.",
        "Evidence acquired. Investigation opening now.",
      ],
      analysing: [
        "Reconstructing the timeline...",
        "Cross-referencing changes against performance shifts.",
        "Looking for patterns, not just coincidences.",
        "Building the case file, one change at a time.",
      ],
      "found-something": [
        "Case update: I found something worth flagging.",
        "The timeline tells a story. Here it is.",
        "Found a change worth a second look.",
      ],
      "nothing-interesting": [
        "Quiet account history. No open cases today.",
        "Nothing conclusive. Filing this one as inconclusive, not innocent.",
        "No notable patterns. The account behaved itself.",
      ],
      error: [
        "Lost a page of the case file. One moment.",
        "Timeline got scrambled. Reassembling.",
      ],
    },
    results: [
      {
        id: "cd-1",
        headline: "A bid strategy switch 19 days ago lines up with a conversion rate drop.",
        insights: [
          "On Aug 22, bid strategy changed from Target CPA to Maximize Conversions on the main campaign.",
          "Conversion rate dropped from 4.1% to 2.8% in the 14 days following the change.",
          "No other changes were logged in that window — no budget, creative, or targeting edits.",
        ],
        actions: [
          "Flag this correlation for review — worth testing a reversion or a Target CPA re-test with a clear before/after window.",
          "Document the finding rather than reverting immediately; two weeks of data is suggestive, not conclusive.",
        ],
        expectedImpact: "If confirmed, reverting could recover conversion rate to prior baseline — needs a controlled test to confirm causality.",
        confidence: "MEDIUM",
      },
      {
        id: "cd-2",
        headline: "An ad group was paused in June and never reactivated or explained.",
        insights: [
          "Ad group 'Retargeting — Cart Abandoners' was paused on Jun 3 with no accompanying note.",
          "It had been converting at 5.2%, above the account average, in the 30 days prior.",
          "No further changes were logged against it since — it's just sitting paused.",
        ],
        actions: [
          "Confirm with the team whether this was intentional (e.g. audience list expired) before reactivating.",
          "If it was a forgotten pause, reactivate and monitor for a return to prior performance.",
        ],
        expectedImpact: "Reactivating a previously above-average ad group, if safe to do so, is low-risk upside.",
        confidence: "LOW",
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "account-historian",
    name: "Account Historian",
    role: "Keeper of Institutional Memory",
    bio: "Round glasses, dusty archive energy, never forgets a client promise. Remembers the thing that was agreed to in a kickoff call eight months ago that everyone else has conveniently forgotten.",
    color: "#E8C170",
    colorSoft: "#332a15",
    food: ["change-logs", "notes", "client-context"],
    mottos: [
      "The account remembers even when the team doesn't.",
      "Somebody promised this in March. It's still not done.",
      "I don't forget. It's kind of my whole thing.",
      "History isn't boring, it's just under-read.",
      "This client asked for this exact thing twice already.",
      "Every note is a small promise. I keep the ledger.",
      "Context is not optional decoration, it's the whole plot.",
      "I found the thread connecting six months of scattered notes.",
      "Nothing is really 'new' if you've read the archive.",
      "The client mentioned this concern in the kickoff call. We're still ignoring it.",
      "I am the only one here who remembers what happened in Q1.",
      "A recurring theme in the notes is not a coincidence, it's a signal.",
      "Somebody asked a question in a note and nobody ever answered it.",
      "The archive doesn't judge. I do, a little.",
      "I keep the receipts so nothing gets conveniently forgotten.",
      "This isn't the first time this exact issue came up. It's the third.",
      "Institutional memory is a competitive advantage nobody budgets for.",
      "I read old notes for fun. This is not a healthy hobby but here we are.",
    ],
    stateMessages: {
      hungry: [
        "No notes, no memory. Feed me the archive.",
        "I can't remember what I haven't been given. Bring me context.",
        "Empty shelves. The archive needs material.",
      ],
      ready: [
        "Archive loaded. Let's see what's been forgotten.",
        "Notes and history in hand. Reading time.",
        "Context received. The past is about to speak.",
      ],
      analysing: [
        "Reading through the archive...",
        "Cross-referencing old notes against recent activity.",
        "Looking for the thread nobody else noticed.",
        "Piecing together the account's actual history.",
      ],
      "found-something": [
        "The archive remembers. Here's what it says.",
        "Found a thread worth pulling on.",
        "History repeats itself, and I have proof.",
      ],
      "nothing-interesting": [
        "Nothing notable in the archive today.",
        "Quiet history. No forgotten threads this time.",
        "All caught up, apparently. Suspicious, but fine.",
      ],
      error: [
        "Dropped a stack of old notes. Reorganizing.",
        "Archive's a bit dusty today. One moment.",
      ],
    },
    results: [
      {
        id: "ah-1",
        headline: "The client asked for a brand-safety exclusion list in March. It still isn't live.",
        insights: [
          "A note from Mar 12 records the client requesting exclusion of 4 specific placement categories.",
          "Change logs show no placement exclusion list was ever created for this account.",
          "The same request appears again, more urgently worded, in a note from Jul 28.",
        ],
        actions: [
          "Build and apply the requested exclusion list — this is a standing, unresolved client ask.",
          "Flag to the account lead that this was requested twice and should be closed out with a confirmation to the client.",
        ],
        expectedImpact: "Closes an open client commitment and reduces brand-safety risk that's been sitting unresolved for months.",
        confidence: "HIGH",
      },
      {
        id: "ah-2",
        headline: "A seasonal budget bump has been manually redone by hand three years running.",
        insights: [
          "Notes reference a 'holiday budget increase' being applied manually in November for at least 3 consecutive years.",
          "Each year's note mentions it being done 'a bit late' relative to the intended start date.",
        ],
        actions: [
          "Propose setting this up as a scheduled or automated budget rule ahead of the next cycle.",
          "Document the target date and increase amount now, while the context is fresh.",
        ],
        expectedImpact: "Removes a recurring manual task and avoids the late-start pattern noted in prior years.",
        confidence: "MEDIUM",
      },
    ],
  },
];

export const ROBOT_MAP: Record<string, Robot> = Object.fromEntries(
  ROBOTS.map((r) => [r.id, r])
);

export function robotsCompatibleWith(datasetId: DatasetId): Robot[] {
  return ROBOTS.filter((r) => r.food.includes(datasetId));
}

export function pick<T>(arr: T[], seed?: number): T {
  const i =
    seed !== undefined
      ? Math.abs(seed) % arr.length
      : Math.floor(Math.random() * arr.length);
  return arr[i];
}
