const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs =require('fs')
const Game = require('../models/game')
const Developer = require('../models/developer')
const uploadPath = path.join('public', Game.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All Games Route
router.get('/', async (req, res) => {
    let query = Game.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try{
        const games = await query.exec()
        res.render('games/index', {
            games: games,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//New Game Route
router.get('/new',  async (req, res) => {
    renderNewPage(res, new Game())
})

//Creator Game Router
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const game = new Game ({
        title: req.body.title,
        developer: req.body.developer,
        publishDate: new Date (req.body.publishDate),
        size: req.body.size,
        coverImageName: fileName,
        description: req.body.description
    })
    try{
        const newGame = await game.save()
        //res.redirect(`games/${newGame.id}`)
        res.redirect(`games`)
    } catch (error) {
        console.log(error)
        if (game.coverImageName != null){
            removeGameCover(game.coverImageName)
        }
        renderNewPage(res, game, true)
    }
})

function removeGameCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, game, hasError = false) {
    try{
        const developers = await Developer.find({})
        const params = {
            developers: developers,
            game: game
        }
        if (hasError) params.errorMessage = 'Error Creating Game'
        res.render('games/new', params)
    }catch{
        res.redirect('/games')
    }
}

module.exports = router