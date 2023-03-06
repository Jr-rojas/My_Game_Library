const mongoose = require('mongoose')

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType:{
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
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Game', gameSchema)
