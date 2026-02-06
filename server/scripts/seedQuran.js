const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Surah = require('../models/Surah');
const Ayah = require('../models/Ayah');

// Utility to delay (avoid rate limits)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_URL = 'https://api.quran.com/api/v4';

async function seedSurahs() {
    console.log('Fetching Surahs...');
    const response = await fetch(`${BASE_URL}/chapters`);
    const data = await response.json();

    // Quran.com API returns { chapters: [...] }
    const chapters = data.chapters;

    for (const chapter of chapters) {
        await Surah.findOneAndUpdate(
            { number: chapter.id },
            {
                number: chapter.id,
                name: chapter.name_arabic,
                englishName: chapter.name_simple,
                englishNameTranslation: chapter.translated_name.name,
                numberOfAyahs: chapter.verses_count,
                revelationType: chapter.revelation_place,
            },
            { upsert: true, new: true }
        );
    }
    console.log(`Seeded ${chapters.length} Surahs.`);
}

async function seedAyahs() {
    console.log('Fetching Ayahs (This may take time)...');

    // We iterate 1 to 114
    for (let i = 1; i <= 114; i++) {
        process.stdout.write(`Processing Surah ${i}... `);

        // Fetch Uthmani
        const uthmaniRes = await fetch(`${BASE_URL}/quran/verses/uthmani?chapter_number=${i}`);
        const uthmaniData = await uthmaniRes.json();

        // Fetch IndoPak
        const indoPakRes = await fetch(`${BASE_URL}/quran/verses/indopak?chapter_number=${i}`);
        const indoPakData = await indoPakRes.json();

        const uthmaniVerses = uthmaniData.verses;
        const indoPakVerses = indoPakData.verses;

        // Merge and Insert
        // Both arrays should be same length and order
        if (uthmaniVerses.length !== indoPakVerses.length) {
            console.error(`Mismatch in verse count for Surah ${i}`);
            continue;
        }

        const ayahsToInsert = uthmaniVerses.map((v, index) => {
            // v.verse_key example: "1:1"
            const ipV = indoPakVerses[index];
            const ayahNum = v.verse_key.split(':')[1];

            // Quran.com API v4 structure:
            // verses: [ { id: 1, verse_key: '1:1', text_uthmani: '...' } ]

            return {
                updateOne: {
                    filter: { surahNumber: i, ayahNumber: Number(ayahNum) },
                    update: {
                        surahNumber: i,
                        ayahNumber: Number(ayahNum),
                        text: {
                            uthmani: v.text_uthmani,
                            indoPak: ipV.text_indopak
                        },
                        juz: v.juz_number,
                        page: v.page_number
                    },
                    upsert: true
                }
            };
        });

        await Ayah.bulkWrite(ayahsToInsert);
        process.stdout.write('Done.\n');

        // Respect API rate limits
        await delay(500);
    }
    console.log('Ayah seeding complete.');
}

async function run() {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/hazaquran';
        console.log('Connecting to MongoDB at:', uri);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected for Seeding');

        await seedSurahs();
        await seedAyahs();

        console.log('Seeding Completed Successfully');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
}

run();
