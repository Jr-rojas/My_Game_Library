const express = require('express')
const router = express.Router()
const Developer = require('../models/developer')

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

//New Creator Route
router.get('/new', (req, res) => {
    res.render('developers/new', { developer: new Developer() })
})

//Creator Developer Router
router.post('/', async (req, res) => {
    const developer = new Developer({
        name: req.body.name
    })
    try {
        const newDeveloper = await developer.save()
        //res.redirect(`developer/${newDeveloper.id}`)
        res.redirect(`developers`)
    } catch {
        res.render('developers/new', {
            developer: developer,
            errorMessage: 'Error creating Developer'
        })
    }
})


module.exports = router