// Puppies who have already gone home. [slug, name, "breed, sex", where they were]
// Photos live in /public/gone/<slug>.jpg  (replace a file to change a photo)
const rows = [
  ["ace", "Ace", "Pomeranian, boy", "TEDDYPUPS"],
  ["leo", "Leo", "Poodle, boy", "TEDDYPUPS"],
  ["mia", "Mia", "Maltipoo, girl", "DUBAI SHOWROOM"],
  ["sadie", "Sadie", "Maltipoo, girl", "TEDDYPUPS"],
  ["pomeranian", "Pomeranian", "Boy", "TEDDYPUPS"],
  ["ollie", "Ollie", "Pomsky, boy", "TEDDYPUPS"],
  ["bruno", "Bruno", "Maltipoo, boy", "DUBAI SHOWROOM"],
  ["buddy", "Buddy", "Maltese, boy", "DUBAI SHOWROOM"],
  ["charlie", "Charlie", "Maltese, boy", "TEDDYPUPS"],
  ["daisy", "Daisy", "Pomeranian, girl", "DUBAI SHOWROOM"],
  ["bella", "Bella", "Pomeranian, girl", "TEDDYPUPS"],
  ["teddy", "Teddy", "Poodle, boy", "TEDDYPUPS"],
  ["molly", "Molly", "Poodle, girl", "DUBAI SHOWROOM"],
  ["coco", "Coco", "Pomsky, girl", "TEDDYPUPS"],
  ["rosie", "Rosie", "Pomsky, girl", "DUBAI SHOWROOM"],
  ["leo-2", "Leo", "Pomeranian, boy", "DUBAI SHOWROOM"],
  ["molly-2", "Molly", "Poodle, girl", "TEDDYPUPS"],
  ["rocky", "Rocky", "Poodle, boy", "TEDDYPUPS"],
  ["sophie", "Sophie", "Maltipoo, girl", "DUBAI SHOWROOM"],
  ["lola", "Lola", "Maltipoo, girl", "DUBAI SHOWROOM"],
  ["rex", "Rex", "Pomeranian, boy", "TEDDYPUPS"],
  ["finn", "Finn", "Pomsky, boy", "TEDDYPUPS"],
  ["zoe", "Zoe", "Maltipoo, girl", "TEDDYPUPS"],
  ["mimi", "Mimi", "Pomeranian, girl", "DUBAI SHOWROOM"],
  ["bailey", "Bailey", "Bichon, boy", "DUBAI SHOWROOM"],
  ["maltipoo", "Maltipoo", "Girl", "TEDDYPUPS"],
  ["poodle", "Poodle", "Girl", "DUBAI SHOWROOM"],
];
// Extra big photos for a puppy's page (first one is the main photo). Others use their single photo.
const MORE = { ace: ["/gone/ace-1.jpg", "/gone/ace-2.jpg", "/gone/ace.jpg"] };
export const gone = rows.map(([slug, name, info, from]) => {
  const [breedRaw, sexRaw] = info.includes(",") ? info.split(", ") : [name, info];
  const photos = MORE[slug] || ["/gone/" + slug + ".jpg"];
  return {
    slug, name, info, from, image: "/gone/" + slug + ".jpg", photos, small: !MORE[slug],
    breed: breedRaw, sex: sexRaw.replace(/^./, (c) => c.toUpperCase()),
    age: "3 months", where: from === "TEDDYPUPS" ? "Imported for you" : "In our Dubai showroom",
  };
});
