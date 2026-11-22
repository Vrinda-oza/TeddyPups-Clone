// Helper: builds the image link used on the reference website
const img = (p) =>
  "https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2F" + p.replace(/\//g, "%2F") + "&w=1080&q=75";

export const LOGO = "https://puppy.instabizweb.com/_next/image?url=%2Fbrand%2Flogo.png&w=128&q=75";
export const WHATSAPP =
  "https://wa.me/919898124987?text=" + encodeURIComponent("Hi TeddyPups! I'd love to know more about your puppies.");
export const whatsappFor = (text) => "https://wa.me/919898124987?text=" + encodeURIComponent(text);
export const SHOWROOM = img("FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg");
export const BREEDS = ["Maltipoo", "Pomeranian", "Poodle", "Cavapoo", "Shih Tzu"];

// [slug, name, breed, gender, age, origin, image, hasVideo]
const rows = [
  ["maltipoo-max-male", "Max", "Maltipoo", "boy", "3 months", "local", "Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp", true],
  ["korean-teacup-maltipoo-female", "Korean Teacup Maltipoo", "Maltipoo", "girl", "2 months", "imported", "gAaGwoGej2g6/5523e884dd/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg", true],
  ["korean-teacup-poodle-female", "Korean Teacup Poodle", "Poodle", "girl", "2 months", "imported", "xeMJCapr5vcU/e618c653b2/b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg", false],
  ["maltipoo-cavapoo-male", "Maltipoo & Cavapoo", "Cavapoo", "boy", "3 months Maltipoo & 2 months Cavapoo", "local", "YQhey4j7uWvZ/3ea10db6c1/b942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg", true],
  ["toy-poodle-male-female", "Toy Poodle", "Poodle", "boy & girl", "2 months", "local", "vMu0BPvkAZ-j/c65e53967d/b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg", false],
  ["maltipoo-female-2", "Maltipoo", "Maltipoo", "girl", "3 months", "local", "3WJNmn6VVgVu/732f779474/b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg", true],
  ["pomeranian-female", "Pomeranian", "Pomeranian", "girl", "3 months", "local", "3yOfnmoyPooH/81e0c7e00c/b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg", false],
  ["copper-male", "Copper", "Cavapoo", "boy", "2 months", "local", "O-6w4FYqE10j/be76f399cc/b942a5_bb73ebbb952047988f944f3a8e3052bd-mv2.jpg", false],
  ["shitzu-female", "Shih Tzu", "Shih Tzu", "girl", "2 months", "local", "qNrTCSrsYyzY/168fa8c4ff/b942a5_eb14616c76c24da89afe7fa3b7d7ae6a-mv2.jpeg", false],
  ["shitzu-male", "Shih Tzu", "Shih Tzu", "boy", "2 months", "local", "crgs9ih6as_M/e37bafb1bf/b942a5_344e49c6c34940d2b09a3ddd5c2e3234-mv2.jpg", false],
  ["maltipoo-female-1", "Maltipoo", "Maltipoo", "girl", "2.5 months", "local", "wNm2_VIBEQvK/4b68f59e75/b942a5_7dd33c9b78c04f78a6a1c7386fb55620-mv2.jpg", false],
  ["maltipoo-female", "Maltipoo", "Maltipoo", "girl", "2 months", "local", "lMhASnmIIVQ4/ad2353ad31/b942a5_6a5617708d75408b8f73725080ed0149-mv2.jpg", false],
  ["korean-teacup-pomeranian-1", "Korean Teacup Pomeranian", "Pomeranian", "girl", "2 months", "imported", "EsAq2LSRvVCJ/4d553ed044/b942a5_a8d264c1aa754d80bc7c98917dfd1fda-mv2.jpg", false],
  ["korean-teacup-pomeranian", "Korean Teacup Pomeranian", "Pomeranian", "girl", "2 months", "imported", "vzf7P8SPCZ-Q/a8db4ee114/b942a5_967bb346583b4146acb56607f5da5f21-mv2.jpg", false],
  ["korean-teacup-pomeranian-male", "Korean Teacup Pomeranian", "Pomeranian", "boy", "2 months", "imported", "nZTGFv46hrZI/fb9eeefc9c/b942a5_dcb8eb174915463ea0c40c58b7b0e406-mv2.jpg", false],
];

export const puppies = rows.map(([slug, name, breed, gender, age, origin, image, video]) => ({
  slug, name, breed, gender, age, origin, video, image: img(image),
}));

export const families = [
  ["dI8Jv0KRTiLJ/d2d7e5375b/27b888_7d940ce5701f48d98327e4a242b53ac4-mv2.jpg", "Lulu 🧸 with her new mummy ❤️"],
  ["TI-WtaFssfQt/c41fb2a387/27b888_15920f828b864dd1b44b98ec4e964c53-mv2.jpg", "Adorable Maltipoo baby 🧸❤️"],
  ["j6T9eswP2eS8/59c6879a1d/27b888_bc27df54dcce410196c6016475364ff3-mv2.jpg", "My new teddy puppy 🥰🧸"],
  ["HJgL4rRnmReV/533701358f/27b888_082e47dfd8144423a96dc70d966fa5b2-mv2.jpg", "Our new puppies 🧸🥰🤗"],
  ["uc5ANs5jm7r7/7160d8b7b1/27b888_f7f4966e59e94db591784d4ec546682f-mv2.jpg", "New puppy 🧸😍"],
  ["pRJubyqHw8p7/d58c4c07ee/27b888_b073c5815f7c4f92ad9a57741a653663-mv2.jpg", "Gang of 3 😍🧸"],
  ["4wOJk9azop_-/65ecf66bf0/27b888_cfe895dbcc2d4bff85f890be9b496543-mv2.jpg", "So happy 😍😍"],
  ["3h20rIasJCOa/10c307cb1c/27b888_a7e7ab6a931e4c79a798bab9927d396e-mv2.jpg", "New pup 🤗💫"],
].map(([p, caption]) => ({ image: img(p), caption }));

export const steps = [
  ["Choose your breed", "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle."],
  ["Get photos & details", "Our team will share real photos, health details, and all necessary information directly on WhatsApp."],
  ["Secure & safe delivery", "Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free."],
];

export const trust = [
  ["Vet-checked & healthy", "Every puppy comes vaccinated, dewormed, and with a verified health certificate."],
  ["Korea to Dubai, safely", "Trusted breeders, safe travel, and premium care from start to finish."],
  ["Support 24/7", "Always here to help, from choosing your puppy to post-delivery support."],
  ["Trusted by families worldwide", "Puppies delivered to loving homes all around the world."],
];

export const faqs = [
  ["Are your puppies vaccinated and health-checked?", "Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family."],
  ["Can I meet a puppy before I decide?", "Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision."],
  ["Can I take my puppy home the same day?", "Local puppies are available immediately, so you can take your puppy home the same day."],
  ["Do you deliver across the UAE?", "Yes. We help you find the right match and ensure a smooth, safe delivery across the UAE."],
  ["Can you ship a puppy abroad?", "Yes. We offer worldwide shipping. Message us on WhatsApp and our team will explain the process for your country."],
  ["How do imported puppies reach me?", "We order from reputable breeders in Korea and handle the whole import, so your puppy arrives in Dubai safe and stress-free."],
  ["Will I see photos and health details first?", "Yes. Our team shares real photos, health details, and all necessary information directly on WhatsApp before you decide."],
  ["Which breeds do you usually have?", "Mostly Maltipoo, Pomeranian, Poodle, Cavapoo, and Shih Tzu, including rare Korean teacup puppies. Availability changes, so check the Puppies page or ask on WhatsApp."],
  ["Do you import puppies from abroad?", "Yes. Order a rare miniature breed from trusted breeders worldwide, and we handle the import."],
];

// Showroom photos and video shown on the original home page
export const SHOWROOM_PHOTOS = [
  ["FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg", "A tiny apricot teddy bear puppy held up in the TeddyPups showroom"],
  ["Vi-kzyvemRl4/e740ed8a24/27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg", "The apricot teddy bear puppy from our showroom, close up"],
  ["g_e4ebbc7fyG/8276289ae7/27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg", "The apricot teddy bear puppy from our showroom, looking up"],
  ["skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg", "The apricot teddy bear puppy from our showroom, held up to say hello"],
].map(([p, alt]) => ({ image: img(p), alt }));
export const SHOWROOM_VIDEO =
  "https://puppy.instabizweb.com/media/dSAUmXs8Qai9/ef39cbea20/27b888_323008bb0f6a41d4bde2a0da7206cd98-720p.mp4";
