'use strict'

const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    required: true
  },
  user_tag: {
    type: Array,
    required: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

submissionSchema.virtual('length').get(function length () {
  return this.text.length
})

const Submission = mongoose.model('Submission', submissionSchema)

module.exports = Submission
