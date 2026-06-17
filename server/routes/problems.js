const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const Chat = require("../models/Chat");
const auth = require("../middleware/auth");
const Favourite = require("../models/Fav");


// router.post("/seed", async (req, res) => {
//     try{
//     await Problem.insertMany([
//         { title: "Two Sum", difficulty: "Easy" ,slug:"gdfd"},
//         { title: "Binary Search", difficulty: "Easy", slug: "gdfdsfdsa" },
//         { title: "Longest Substring", difficulty: "Medium", slug: "gdfdasfgd" },
//         { title: "Merge Intervals", difficulty: "Medium", slug: "gdgfsdfd" },
//         { title: "Word Ladder", difficulty: "Hard", slug: "gdsdgfasffd" },
//     ]);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err.message });
//     }

//     res.json({ message: "Problems added" });
// });


router.get('/', async (req, res) => {
    try {
        const { difficulty, tag, search } = req.query;

        const filter = {};

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (tag) {
            filter.tags = tag;
        }

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        const problems = await Problem.find(filter);

        res.json(problems);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch problems"
        });
    }
});

router.get('/fav', auth, async (req, res) => {
    const userId = req.user.userId;
    const favs = await Favourite.find({ user: userId });
    const favIds = favs.map(f => f.pid.toString());

    res.json(favIds);
});

router.get("/tags/all", async (req, res) => {
    const tags = await Problem.distinct("tags");
    res.json(tags);
});

router.post('/fav/:pid', auth, async (req, res) => {
    const { pid } = req.params;
    const user = req.user.userId;
    const fav = await Favourite.findOne({ user,  pid });
    // console.log(fav);
    if (!fav) {
        await Favourite.create({
            user,
            pid
        })
        res.status(200).json({ message: "Added" });
    }
    else {
        await Favourite.deleteOne({
            user,
            pid
        })
        res.status(200).json({ message: "Removed" });
    }

})
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const problem = await Problem.findOne({ slug });

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.json(problem);
    } catch (err) {
        console.error("Error fetching problem:", err);
        res.status(500).json({ message: err.message });
    }
});

router.get("/:problemId/discussion", async (req, res) => {
    const chats = await Chat.find({
        problem: req.params.problemId,
    })
        .populate("user", "username")
        .sort({ createdAt: -1 });

    res.json(chats);
});

router.post("/:problemId/discussion", auth, async (req, res) => {
    // console.log("USER FROM TOKEN:", req.user);
    const chat = await Chat.create({
        problem: req.params.problemId,
        user: req.user.userId,
        content: req.body.content,
    });

    const populatedChat = await chat.populate("user", "username");
    res.json(populatedChat);
});
module.exports = router;