const { NlpManager } = require('node-nlp');
const { trainNLP, getResponseById, getDynamicSuggestionsById } = require('../intents/intents');

// Initialize NLP Manager
const manager = new NlpManager({ languages: ['en'] });

// Train the NLP model with intents
trainNLP(manager);

// Define the chatController object
const chatController = {
    // Serve the index.jade page
    getIndexPage: (req, res) => {
        res.render('../views/index.jade');
    },

    // Handle chat response
    getChatResponse: async (req, res) => {
        let { message, responseId } = req.body;
        let response, suggestions;

        // If there's a responseId, get follow-up using ObjectId
        if (responseId) {
            const responseObject = await getResponseById(null, null, responseId); // Get response by _id
            response = responseObject ? responseObject.followUps[0].question : 'I am not sure about that.';
            suggestions = responseObject ? responseObject.followUps[0].options : [];
            responseId = responseObject ? responseObject.followUps[0].nextResponses[0] : null
        } else {
            // Otherwise, process initial NLP message
            const result = await manager.process('en', message);
            if (result.intent) {
                const [category, intent] = result.intent.split('.');
                const responseObject = await getResponseById(category, intent, responseId); // Get initial response by intent
                response = responseObject ? responseObject.followUps[0].question : 'I am not sure about that.';
                suggestions = responseObject ? responseObject.followUps[0].options : [];
                responseId = responseObject ? responseObject.followUps[0].nextResponses[0] : null
            } else {
                response = 'I am not sure about that. Could you please provide more details or ask something else?';
                suggestions = [];
            }
        }

        res.json({ reply: response, suggestions, responseId });
    }
};

// Export the chatController object
module.exports = chatController;


