// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const intentSchema = new Schema({
//     category: { type: String, required: true },
//     phrases: { type: [String], required: true },
//     responses: { type: [String], required: true }
// });

// module.exports = mongoose.model('intentModel', intentSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Follow-up schema
const followUpSchema = new Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    nextResponses: [{ type: Schema.Types.ObjectId, ref: 'Response' }] // References to the next responses
});

// Response schema
const responseSchema = new Schema({
    followUps: [followUpSchema] // Each response may have follow-up questions
});

// Intent schema
const intentSchema = new Schema({
    category: { type: String, required: true },
    phrases: { type: [String], required: true },
    responses: [{ type: Schema.Types.ObjectId, ref: 'Response' }] // References to the responses
});

const Response = mongoose.model('Response', responseSchema);
const Intent = mongoose.model('Intent', intentSchema);

module.exports = { Intent, Response };
  