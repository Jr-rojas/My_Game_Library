const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/gameCovers'

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    coverImageName: {
        type: String,
        required: true
    },
    developer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Developer'
    }
}, {timestamps: true})

gameSchema.virtual('coverImagePath').get(function(){
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Game', gameSchema)
module.exports.coverImageBasePath = coverImageBasePath
