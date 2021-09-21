const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

// post a POST...
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.get('/tasks', auth, async (req, res) => {
//     try {
//         const tasks = await Task.find({ owner: req.user._id })
//         res.send(tasks)
//     } catch (e) {
//         res.status(500).send()
//     }
// })



// sort based on the query string
// GET  /task?completed:true
// GET /tasks?sortBy:createdAt:desc


// implement pagination 
// GET /tasks?limit=20&skip=10
// If a client wanted the first page of 10 tasks, 
// limit would be set to 10 and skip would be
// set to 0. If the client wanted the third page of 10 tasks, limit would be set to 10 and skip
// would be set to 20.
// Both limit and skip can be added onto the options object passed to populate.




// implement sortind 
// A sort property should be set, which is an object containing key/value pairs. 
// The key is the field to sort. The value is 1 for ascending and -1 for descending sorting.
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed ==='true'
    }

    if(req.query.sortBy) {
        const part = req.query.sortBy.split(':')
        // info-----------if part[1] === 'desc' aanel its -1 (ascending) else descending
        sort[part[0]] = part[1] === 'desc' ? -1 : 1   
   
    }
    try {
        await req.user.populate({
            path:'tasks',
            match,
            options : {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})



router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router