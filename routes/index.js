const express = require('express')
const router = express.Router()
const Game = require('../models/game')

router.get('/', async (req, res) => {
    let games
    try{
        games = await Game.find().sort({createdAt: 'desc'}).limit(10).exec()
    }catch{
        book = []
    }
    res.render('index', {games: games})
})


module.exports = router