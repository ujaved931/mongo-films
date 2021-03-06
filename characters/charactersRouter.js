const express = require('express');

const Character = require('./Character.js');
const Vehicle = require('../vehicles/Vehicle');
const Film = require('../films/Film');
const router = express.Router();

// add endpoints here
router
    .route('/')
    .get((req, res) => {
        if (req.query.minheight) {
            Character.find({ height: { $gte: Number(req.query.minheight) }, gender: "female" })
                .select("name, gender, height, skin_color, hair_color and eye_color")
                .then(chars => {
                    res.status(200).json(chars);
                })
                .catch(err => {
                    res.status(500).json([{ error: err.message }]);
                })
        } else {
            Character.find()
                .select('name gender height skin_color hair_color eye_color')
                .populate('homeworld')
                .then(chars => {
                    res.status(200).json(chars);
                })
                .catch(err => {
                    res.status(500).json([{ error: err.message }]);
                })
        };
    });


router
    .route('/:id')
    .get((req, res) => {
        const { id } = req.params;
        Character
            .findById(id)
            .select('name gender height skin_color hair_color eye_color')
            .populate('homeworld')
            .then(char => {
                Film.find({ characters: id })
                    .then(films => {
                        const character = { char, movies: films }
                        res.status(200).json(character);
                    })
                    .catch(err => {
                        res.status(500).json({ error: err.message })
                    })
            })
            .catch(err => {
                res.status(500).json({ error: err.message })
            })

    })

router
        .route('/:id/vehicles')
        .get((req, res) => {
        const { id } = req.params;
        Character
            .findById(id)
            .then(char => {
                Vehicle.find({ pilot_keys: char.key })
                    .then(vehicles => {
                        res.status(200).json(vehicles);
                    })
                    .catch(err => {
                        res.status(500).json({ error: err.message })
                    })
            })
            .catch(err => {
                res.status(500).json({ error: err.message })
            })
    })


module.exports = router;
