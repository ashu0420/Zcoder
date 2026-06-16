const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await fetch(
            `https://clist.by/api/v2/contest/?username=${process.env.CLIST_USERNAME}&api_key=${process.env.CLIST_API_KEY}&upcoming=true&limit=100`
        );

        const data = await response.json();

        const allowedPlatforms = [
            "codeforces",
            "codechef",
            "atcoder",
            "leetcode",
            "topcoder",
            "hackerrank",
            "geeksforgeeks",
            "codingninjas"
        ];

        const now = Date.now();
        const nextWeek = now + 7 * 24 * 60 * 60 * 1000;

        const contests = data.objects
            .filter((contest) => {
                const startTime = new Date(contest.start).getTime();

                const isAllowedPlatform = allowedPlatforms.some(platform =>
                    contest.resource.toLowerCase().includes(platform)
                );

                return (
                    isAllowedPlatform &&
                    startTime >= now &&
                    startTime <= nextWeek
                );
            })
            .sort((a, b) =>
                new Date(a.start) - new Date(b.start)
            )
            .map((contest) => ({
                id: contest.id,
                name: contest.event,
                platform: contest.resource,
                startTime: contest.start,
                durationHours: Math.round(contest.duration / 3600),
                link: contest.href
            }));

        res.json(contests);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to fetch contests"
        });
    }
});

module.exports = router;