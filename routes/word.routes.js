const router = require("express").Router();
const words = require("../words.json")

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

router.get("/:lang/all", async (req, res) => {
    try {
        let allWords = [].concat(words[req.params.lang].easy, words[req.params.lang].medium, words[req.params.lang].hard)
        res.json({allWords}).status(200);
    } catch (err) {
        res.json({err}).status(400);
    }
});

router.get("/:lang/easy", async (req, res) => {
    try {
        let easyWords = words[req.params.lang].easy;
        res.json({easyWords}).status(200);
    } catch (err) {
        res.json({err}).status(400);
    }
});

router.get("/:lang/medium", async (req, res) => {
    try {
        let mediumWords = words[req.params.lang].medium;
        res.json({mediumWords}).status(200);
    } catch (err) {
        res.json({err}).status(400);
    }
});

router.get("/:lang/hard", async (req, res) => {
    try {
        let hardWords = words[req.params.lang].hard;
        res.json({hardWords}).status(200);
    } catch (err) {
        res.json({err}).status(400);
    }
});

router.get("/:lang/random/:amount", async (req, res) => {
    try {
        let allWords = [].concat(words[req.params.lang].easy, words[req.params.lang].medium, words[req.params.lang].hard)
        let amount = req.params.amount >= 0 && req.params.amount <= allWords.length ? req.params.amount : allWords.length;
        let randomWords = getRandom(allWords, amount)
        res.json({randomWords}).status(200);
    } catch (err) {
        res.json({err}).status(400);
    }
});

router.get("/:lang/random/:easyAmount/:mediumAmount/:hardAmount", async (req, res) => {
    try {
        let easyAmount = req.params.easyAmount >= 0 && req.params.easyAmount <= words[req.params.lang].easy.length ? req.params.easyAmount : words[req.params.lang].easy.length;
        let mediumAmount = req.params.mediumAmount >= 0 && req.params.mediumAmount <= words[req.params.lang].medium.length ? req.params.mediumAmount : words[req.params.lang].medium.length;
        let hardAmount = req.params.hardAmount >= 0 && req.params.hardAmount <= words[req.params.lang].hard.length ? req.params.hardAmount : words[req.params.lang].hard.length;

        let randomWords = [].concat(getRandom(words[req.params.lang].easy, easyAmount), getRandom(words[req.params.lang].medium, mediumAmount), getRandom(words[req.params.lang].hard, hardAmount))

        res.json({randomWords}).status(200);
    } catch (err) {
        res.json({err}).status(400);
    }
});

module.exports = router;