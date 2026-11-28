// Sample data for the draft. Tiers are definitions; works are plain records.
// To add a work: add one row to its tier. To add a tier: add one entry to TIERS.
window.NEST = (function () {
  "use strict";
  const TIERS = [
    { id: "platinum", name: "Platinum", color: "#6E8FE0", note: "The 10 works with the most updates and plays this month.", mark: { kind: "badge", metal: ["#E3EAFF", "#9DB4F0", "#5F7FD6"] } },
    { id: "diamond", name: "Diamond", color: "#9EE8F0", note: "Places 11 to 20.", mark: { kind: "script", ink: ["#D8FBFF", "#9EE8F0", "#7FB8FF"] } },
    { id: "gold", name: "Gold", color: "#F2C14E", note: "Places 21 to 30. Most post an update every week or two.", mark: { kind: "ink", ink: ["#FFE58A", "#F5B13D", "#EE7A35"] } },
    { id: "silver", name: "Silver", color: "#C8D0D4", note: "Places 31 to 40.", mark: { kind: "badge", metal: ["#FFFFFF", "#D3DADE", "#A3AEB5"] } },
    { id: "bronze", name: "Bronze", color: "#D99A66", note: "Places 41 to 50, mostly new this term.", mark: { kind: "ink", ink: ["#F7C29A", "#DE8C55", "#B5602F"] } },
  ];

  // [name, room, maker, one line, handwriting on the picture (optional)]
  const ROWS = {
    platinum: [
      ["Burrow Knights", "Game", "Pim", "The two-player demo is up. Dig, fight, and get lost underground with a friend."],
      ["WheelSense", "IoT", "Mind", "A soil probe that texts you before your plants get thirsty.", "soil probe, 2 x AA"],
      ["NestBoard", "Web", "Tonkla", "The class noticeboard the whole school now checks before lunch."],
      ["Sunflower Bank", "Idea", "Phoom", "Twelve friends put in a little each month, and one gets the pot.", "12 friends, one pot"],
      ["RE//SLASH", "Game", "Phoom.x", "Fast first-person hack-and-slash: parry everything, go Slash Mode with the katana, keep your momentum."],
      ["AquaNode", "IoT", "Bank", "Keeps an eye on the pond so the fish don't have to.", "pond sensor"],
      ["Kernel Docs", "Web", "Earth", "Notes for the computer club, written by the people who got stuck first."],
      ["Moonwheel", "Game", "Ploy", "A slow night-time puzzle about turning the moon one notch at a time."],
      ["Coop Watch", "IoT", "Nan", "Counts the hens in at dusk and shuts the gate.", "coop gate counter"],
      ["Lunch Swap", "Idea", "Mew", "Trade the lunch you brought for one you'd rather eat.", "swap, don't waste"],
    ],
    diamond: [
      ["Tunnel Tales", "Game", "Bas", "A choose-your-path story told through a mole's diary."],
      ["Bus Ping", "IoT", "Ice", "A little light at the gate that turns green when the bus is two stops away.", "2 stops away"],
      ["Homework Radar", "Web", "Nine", "Every deadline from every class on one page."],
      ["Book Loop", "Idea", "Jane", "Pass a book on, then follow where it goes next.", "pass it on"],
      ["Cheek Pouch", "Game", "Pim", "Stuff as many seeds as you can before the cat wakes up."],
      ["Fan Brain", "IoT", "Tee", "A desk fan that turns itself off when you leave the room.", "off when you go"],
      ["Canteen Queue", "Web", "Beam", "See how long the line is before you walk down three floors."],
      ["Pixel Pals", "Game", "Kaew", "Raise a tiny pet that only grows when you finish your reading."],
      ["Rain Jar", "IoT", "Win", "Measures the rain on the roof and posts it to the class chat.", "mm per hour"],
      ["Tutor Trade", "Idea", "Oat", "Teach what you're good at, learn what you're not.", "maths for guitar"],
    ],
    gold: [
      ["Lantern Run", "Game", "Pond", "Carry a lantern through a cave that changes every night."],
      ["Shelf Scale", "IoT", "Fern", "Tells the shop when the rice shelf is getting light.", "rice, 4 kg left"],
      ["Club Finder", "Web", "Pang", "Answer five questions and find the club that fits."],
      ["Uniform Swap", "Idea", "May", "Outgrown uniforms find the next kid who needs them.", "size up"],
      ["Kite Wars", "Game", "Tan", "Cut the other kites out of the sky. Two players, one keyboard."],
      ["Door Bell Plus", "IoT", "Gun", "A doorbell that tells you who it is before you get up.", "who is it"],
      ["Grade Guess", "Web", "Mook", "Type in your scores so far and see what you need on the final."],
      ["Night Market", "Game", "Kla", "Run a noodle stall and keep the queue happy."],
      ["Plant Talk", "IoT", "Joy", "A pot that lights up when it's had enough sun.", "too much sun"],
      ["Repair Café", "Idea", "Top", "Bring something broken on Saturday, leave with it working.", "fix, don't toss"],
    ],
    silver: [
      ["Frog Hop", "Game", "Ming", "Get the frog home across a road that never stops."],
      ["Lab Timer", "IoT", "Arm", "A big timer for the science room that beeps in three colours.", "3 colours"],
      ["Exam Map", "Web", "Bow", "Which room, which seat, which floor, on one map."],
      ["Snack Fund", "Idea", "Gift", "The class saves a little each week for the end-of-term party.", "party fund"],
      ["Star Catch", "Game", "Palm", "Catch falling stars with a net that keeps getting smaller."],
      ["Bike Lock Buzz", "IoT", "Nueng", "Buzzes your phone if someone touches your bike.", "buzz, buzz"],
      ["Recipe Box", "Web", "Pear", "Mum's recipes, typed up before they get lost."],
      ["Block Drop", "Game", "Toey", "Stack the blocks as high as you can before the wind picks up."],
      ["Water Meter", "IoT", "Ohm", "Shows how much water the dorm used today.", "litres today"],
      ["Old Phone Library", "Idea", "Fai", "Lend old phones to kids who need one for school.", "borrow one"],
    ],
    bronze: [
      ["Cloud Hopper", "Game", "Tar", "Jump from cloud to cloud. Don't look down."],
      ["Light Switch Bot", "IoT", "Jay", "A tiny arm that flips your old light switch from your phone.", "click"],
      ["Note Share", "Web", "Pla", "Upload your class notes, get someone else's in return."],
      ["Walk Buddy", "Idea", "Air", "Find someone going the same way home after dark.", "same way home"],
      ["Paper Planes", "Game", "Ton", "Fold, throw, and see how far the wind takes you."],
      ["Mood Lamp", "IoT", "Boss", "A lamp that slowly changes colour to match the weather outside.", "rainy blue"],
      ["Bus Routes", "Web", "Proud", "Every bus that stops near school, with the times that actually happen."],
      ["Snail Race", "Game", "Kim", "Bet your lunch money on the slowest race in town. Pretend money only."],
      ["Fish Feeder", "IoT", "Nok", "Feeds the class fish over the long weekend.", "twice a day"],
      ["Skill Swap Wall", "Idea", "Pan", "A wall in the canteen where you pin what you can teach.", "pin it up"],
    ],
  };

  // Genres per room, the same lists as the room pages (design/v2), plus Smart home and School.
  const ROOMS = {
    Game: ["Roguelike", "Puzzle", "Casual", "Co-op"],
    IoT: ["Smart farm", "Water", "Wearable", "Smart home"],
    Web: ["SaaS", "Ecommerce", "Dev tool", "School"],
    Idea: ["Fintech", "Logistics", "Community"],
  };
  const GENRE = {
    "Burrow Knights": "Co-op", "RE//SLASH": "Action", "Moonwheel": "Puzzle", "Tunnel Tales": "Roguelike", "Cheek Pouch": "Casual",
    "Pixel Pals": "Casual", "Lantern Run": "Roguelike", "Kite Wars": "Co-op", "Night Market": "Casual", "Frog Hop": "Casual",
    "Star Catch": "Casual", "Block Drop": "Puzzle", "Cloud Hopper": "Casual", "Paper Planes": "Casual", "Snail Race": "Co-op",
    "WheelSense": "Smart farm", "AquaNode": "Water", "Coop Watch": "Smart farm", "Bus Ping": "Wearable", "Fan Brain": "Smart home",
    "Rain Jar": "Water", "Shelf Scale": "Smart farm", "Door Bell Plus": "Smart home", "Plant Talk": "Smart farm", "Lab Timer": "Smart home",
    "Bike Lock Buzz": "Wearable", "Water Meter": "Water", "Light Switch Bot": "Smart home", "Mood Lamp": "Smart home", "Fish Feeder": "Water",
    "NestBoard": "School", "Kernel Docs": "Dev tool", "Homework Radar": "School", "Canteen Queue": "SaaS", "Club Finder": "School",
    "Grade Guess": "School", "Exam Map": "School", "Recipe Box": "SaaS", "Note Share": "School", "Bus Routes": "SaaS",
    "Sunflower Bank": "Fintech", "Lunch Swap": "Community", "Book Loop": "Community", "Tutor Trade": "Community", "Uniform Swap": "Logistics",
    "Repair Café": "Community", "Snack Fund": "Fintech", "Old Phone Library": "Logistics", "Walk Buddy": "Community", "Skill Swap Wall": "Community",
  };

  // Where each work runs. Picked per room so the sample looks real; a real work lists its own.
  const PLATFORMS = {
    Game: [["Windows", "Web"], ["Windows", "macOS"], ["Web"], ["Android", "Windows"], ["Windows"]],
    IoT: [["ESP32"], ["Arduino"], ["Raspberry Pi"], ["ESP32", "Android"]],
    Web: [["Web"], ["Web", "Android"], ["Web", "iOS"]],
    Idea: [["Pitch deck"], ["Pitch deck", "Web"]],
  };

  // Sample "last update" per work: what changed and how long ago. Picked by room so it reads true to the work.
  const UPDATES = {
    Game: ["Added a second level", "Fixed the jump that felt floaty", "New sound for the boss fight", "Two players on one keyboard now work", "Faster loading on old laptops", "Posted a devlog about the map"],
    IoT: ["Battery now lasts two weeks", "New case, printed in PETG", "Sends a message when it goes offline", "Calibrated against a real meter", "Added a test at the school farm"],
    Web: ["Dark mode", "Loads twice as fast on phones", "Thai and English", "Fixed sign-in on Safari", "New page for teachers"],
    Idea: ["First ten people signed up", "Pitched it to the student council", "Wrote down the rules", "Ran a one-week trial", "Found a teacher to back it"],
  };
  const AGO = ["today", "yesterday", "2 days ago", "3 days ago", "5 days ago", "last week", "2 weeks ago"];

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const VIDEOS = {};
  const REAL = { "re-slash": { team: [["Phoom.x", ""], ["PetePeachPeat", ""], ["Dnsw", ""]], links: [["itch.io", "https://phoomx.itch.io/reslash"]] } };
  const works = [];
  for (const t of TIERS) {
    ROWS[t.id].forEach(([name, room, maker, blurb, scribble], i) =>
      works.push({ posted: new Date(Date.UTC(2026, 10, 28) - ((works.length * 67 + name.length * 13) % 360) * 864e5).toISOString().slice(0, 10), favs: (works.length * 41 + name.length * 97) % 600 + 3, update: { what: UPDATES[room][(name.length * 3 + i) % UPDATES[room].length], when: AGO[(i + t.id.length) % AGO.length] }, platforms: PLATFORMS[room][(name.length + i) % PLATFORMS[room].length], id: slug(name), name, room, genre: GENRE[name], maker, blurb, scribble, tier: t.id, place: i + 1, frames: 7, video: VIDEOS[slug(name)] || null, ...REAL[slug(name)] }));
  }
  // The hero shows the best of each room from the top tier.
  const hero = ["burrow-knights", "wheelsense", "nestboard", "sunflower-bank"];

  return {
    tiers: TIERS,
    rooms: ROOMS,
    works,
    inTier: (id) => works.filter((w) => w.tier === id),
    byId: (id) => works.find((w) => w.id === id),
    hero: () => hero.map((id) => works.find((w) => w.id === id)),
  };
})();
