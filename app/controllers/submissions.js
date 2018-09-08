'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Submission = models.submission

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Submission.find()
    .then(submissions => res.json({
      submissions: submissions.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    submission: req.submission.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  const submission = Object.assign(req.body.submission, {
    _owner: req.user._id
  })
  Submission.create(submission)
    .then(submission =>
      res.status(201)
        .json({
          submission: submission.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body._owner  // disallow owner reassignment.
  req.submission.update(req.body.submission)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.submission.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Submission), only: ['show'] },
  { method: setModel(Submission, { forUser: true }), only: ['update', 'destroy'] }
] })
