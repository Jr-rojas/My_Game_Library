const express = require('express')
const router = express.Router()
const Developer = require('../models/developer')
const Game = require('../models/game')
const auth = require('../authenticate')

// All Creator Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const developers = await Developer.find(searchOptions)
        res.render('developers/index', {
            developers: developers,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Developer Route
router.get('/new',auth, (req, res) => {
    res.render('developers/new', { developer: new Developer() })
})

//Post Developer Router
router.post('/',auth, async (req, res) => {
    const developer = new Developer({
        name: req.body.name
    })
    try {
        const currentDevelopers = await Developer.findOne({ name: req.body.name})
        if (currentDevelopers){
            res.render('developers/new',{
                developer: developer,
                errorMessage: 'Error creating Developer: Developer already exists'
            })
        }else{
            const newDeveloper = await developer.save()
            res.redirect(`developers/${newDeveloper.id}`)
        }
    } catch {
        res.render('developers/new', {
            developer: developer,
            errorMessage: 'Error creating Developer'
        })
    }
})

// DEVELOPERS/DEVELOPERID
router.get('/:id', async (req, res) => {
    try{
        const developer = await Developer.findById(req.params.id)
        const games = await Game.find({ developer: developer.id }).limit(6).exec()
        res.render('developers/show', { 
            developer: developer,
            gamesByDeveloper: games
        })
    }catch{
        res.redirect('/')
    }
    
})

router.get('/:id/edit', auth, async (req, res) => {
    try{
        const developer = await Developer.findById(req.params.id)
        res.render('developers/edit', { developer: developer })
    }catch{
        res.redirect('/developers')
    }
})

router.put('/:id', auth,  async (req, res) => {
    let developer
    try {
        developer = await Developer.findById(req.params.id)
        developer.name = req.body.name
        await developer.save()
        res.redirect(`/developers/${developer.id}`)
    } catch {
        if (developer == null ){
            res.redirect('/')
        }else{
            res.render('developers/edit', {
                developer: developer,
                errorMessage: 'Error updating Developer'
            })
        }
    }
})

router.delete('/:id',auth, async (req, res) => {
    let developer
    try {
        developer = await Developer.findById(req.params.id)
        await developer.remove()
        res.redirect(`/developers`)
    } catch {
        if (developer == null ){
            res.redirect('/')
        }else{
            res.redirect(`/developers/${developer.id}`)
        }
    }
})
module.exports = router