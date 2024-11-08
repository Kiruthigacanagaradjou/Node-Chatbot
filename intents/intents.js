const mongoose = require('mongoose');
const { Intent, Response } = require('../models/intentModel');

mongoose.connect('mongodb://localhost:27017/ChatBot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Fetch all intents from the database
async function fetchIntents() {
    try {
        const intents = await Intent.find({});
        return intents;
    } catch (error) {
        console.error('Error fetching intents from DB:', error);
        return [];
    }
}

// Train the NLP model with the intents from the DB
async function trainNLP(manager) {
    let intentsFromDB = await fetchIntents();
    for (const intentData of intentsFromDB) {
        const category = intentData.category;
        const phrases = intentData.phrases;
        for (const phrase of phrases) {
            manager.addDocument('en', phrase, `${category}.${phrase}`);
        }
    }
    await manager.train();
    manager.save();
}

// Get response by _id (ObjectId)
async function getResponseById(category, intent, responseId) {
    try {
        console.log(responseId)
        if(responseId){
            const responseObject = await Response.findById(responseId).lean(); // Fetch response by _id
            return responseObject;
        }else{
            const intentData = await Intent.findOne({ category: category, phrases: intent }).lean();
            if (intentData) {
                const responseId = intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
                const responseObject = await Response.findById(responseId).lean(); 
                return responseObject;
            }
            return null;
        }
    } catch (error) {
        console.error('Error fetching response from DB:', error);
        return null;
    }
}

// Get dynamic suggestions using nextResponses ObjectId
async function getDynamicSuggestionsById(responseId) {
    try {
        const responseObject = await Response.findById(responseId).lean();
        if (responseObject && responseObject.followUps.length > 0) {
            return responseObject.followUps.map(followUp => ({
                question: followUp.question,
                options: followUp.options
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching dynamic suggestions:', error);
        return [];
    }
}

// Export modules
module.exports = { trainNLP, fetchIntents, getResponseById, getDynamicSuggestionsById };

// const mongoose = require('mongoose');
// const { Intent, Response} = require('../models/intentModel');

// mongoose.connect('mongodb://localhost:27017/ChatBot', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// async function fetchIntents() {
//     try {
//         const intents = await Intent.find({});
//         return intents;
//     } catch (error) {
//         console.error('Error fetching intents from DB:', error);
//         return [];
//     }
// }

// // Function to initialize and train the NLP model
// async function trainNLP(manager) {
//     let intentsFromDB = await fetchIntents();
//     for (const intentData of intentsFromDB) {
//         const category = intentData.category;
//         const phrases = intentData.phrases;
//         for (const phrase of phrases) {
//             manager.addDocument('en', phrase, `${category}.${phrase}`);
//             manager.addAnswer('en', `${category}.${phrase}`, getResponse(category, phrase));
//         }
//     }
//     await manager.train();
//     manager.save();
// }

// // Function to get the response from the database
// async function getResponse(category, intent) {
//     try {
//         const intentData = await Intent.findOne({ category: category, phrases: intent });
//         if (intentData) {
//             const response = intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
//             return response.text; 
//         }
//         return 'I am not sure about that. Could you please provide more details or ask something else?';
//     } catch (error) {
//         console.error('Error fetching response from DB:', error);
//         return 'An error occurred while processing your request.';
//     }
// }

// // Function to return suggestions based on intent
// async function getDynamicSuggestions(category, responseText) {
//     try {
//         const intentData = await Intent.findOne({ category: category, 'responses.text': responseText }).lean();
        
//         if (intentData) {
//             const response = intentData.responses.find(resp => resp.text === responseText);
//             if (response && response.followUps.length > 0) {
//                 return response.followUps.map(followUp => ({
//                     question: followUp.question,
//                     options: followUp.options
//                 }));
//             }
//         }
//         return [];
//     } catch (error) {
//         console.error('Error fetching dynamic suggestions:', error);
//         return [];
//     }
// }
// // Export modules
// module.exports = { trainNLP, fetchIntents, getResponse, getDynamicSuggestions };
// const mongoose = require('mongoose');
// const Intent = require('../models/intentModel');

// mongoose.connect('mongodb://localhost:27017/ChatBot', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// async function fetchIntents() {
//     try {
//         const intents = await Intent.find({});
//         return intents;
//     } catch (error) {
//         console.error('Error fetching intents from DB:', error);
//         return [];
//     }
// }

// // Function to initialize and train the NLP model
// async function trainNLP(manager) {
//     let intentsFromDB = await fetchIntents();
//     for (const intentData of intentsFromDB) {
//         const category = intentData.category;
//         const phrases = intentData.phrases; 
//         for (const phrase of phrases) {
//             manager.addDocument('en', phrase, `${category}.${phrase}`);
//             manager.addAnswer('en', `${category}.${phrase}`, getResponse(category, phrase));
//         }
//     }
//     await manager.train();
//     manager.save();
// }

// // Function to get the response from the database
// async function getResponse(category, intent) {
//     try {
//         const intentData = await Intent.findOne({ category: category, phrases: intent });
//         console.log(intentData,'in')
//         if (intentData) {
//             return JSON.stringify(intentData.responses[Math.floor(Math.random() * intentData.responses.length)]);
//         }
//         return 'I am not sure about that. Could you please provide more details or ask something else?';
//     } catch (error) {
//         console.error('Error fetching response from DB:', error);
//         return 'An error occurred while processing your request.';
//     }
// }

// // Function to return suggestions based on intent
// async function getDynamicSuggestions(intent) {
//     try {
//         const intentData = await Intent.findOne({ category: intent }).lean();
//         console.log(intentData);

//         if (intentData) {
//             // Collect all follow-up questions into an array
//             const followUps = intentData.responses
//                 .filter(response => response.followUp) // Filter responses with follow-up questions
//                 .map(response => response.followUp); // Extract the follow-up questions

//             console.log(followUps, 'followUps'); // Log the array of follow-ups
            
//             return {
//                 followUps: followUps.length > 0 ? followUps : null, // Return follow-ups as an array
//                 options: intentData.options || [] // Return options
//             };
//         }
//         return { followUps: null, options: [] }; // Return null if no intent found
//     } catch (error) {
//         console.error('Error fetching dynamic suggestions:', error);
//         return { followUps: null, options: [] }; // Return null if an error occurs
//     }
// }

// const insertIntents = async () => {
//     const intents = [
//         {
//             category: 'laptopServiceRelated',
//             phrases: [
//                 'how do I request a laptop service?', 'what should I do if my laptop is not working?',
//                 'who should I contact for laptop repairs?', 'laptop repair'
//             ],
//             responses: [
//                 {
//                     text: 'You can request laptop service through the IT service desk.',
//                     followUps: [
//                         {
//                             question: 'Please choose your laptop brand:',
//                             options: ['HP', 'Mac', 'Lenovo', 'Dell'],
//                             nextResponses: [
//                                 {
//                                     text: 'You chose HP. Is it a hardware or software issue?',
//                                     followUps: [
//                                         {
//                                             question: 'Please select the type of issue:',
//                                             options: ['Hardware', 'Software'],
//                                             nextResponses: [
//                                                 {
//                                                     text: 'You selected Hardware. Do you want to open a support ticket?',
//                                                     followUps: [
//                                                         {
//                                                             question: 'Would you like to proceed with opening a ticket?',
//                                                             options: ['Yes', 'No']
//                                                         }
//                                                     ]
//                                                 },
//                                                 {
//                                                     text: 'You selected Software. Do you want to install updates?',
//                                                     followUps: [
//                                                         {
//                                                             question: 'Would you like to proceed with the installation?',
//                                                             options: ['Yes', 'No']
//                                                         }
//                                                     ]
//                                                 }
//                                             ]
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     text: 'You chose Mac. Is it a hardware or software issue?',
//                                     followUps: [
//                                         {
//                                             question: 'Please select the type of issue:',
//                                             options: ['Hardware', 'Software'],
//                                             nextResponses: [
//                                                 {
//                                                     text: 'You selected Hardware. Do you want to open a support ticket?',
//                                                     followUps: [
//                                                         {
//                                                             question: 'Would you like to proceed with opening a ticket?',
//                                                             options: ['Yes', 'No']
//                                                         }
//                                                     ]
//                                                 },
//                                                 {
//                                                     text: 'You selected Software. Do you want to install updates?',
//                                                     followUps: [
//                                                         {
//                                                             question: 'Would you like to proceed with the installation?',
//                                                             options: ['Yes', 'No']
//                                                         }
//                                                     ]
//                                                 }
//                                             ]
//                                         }
//                                     ]
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             category: 'meetingRelated',
//             phrases: [
//                 'schedule a meeting', 'book a meeting', 'how do I schedule a meeting?', 
//                 'I need to set up a meeting', 'meeting schedule', 'meeting arrangement'
//             ],
//             responses: [
//                 {
//                     text: 'I can help you schedule a meeting. When would you like to have it?',
//                     followUps: [
//                         {
//                             question: 'Please select a date:',
//                             options: ['Today', 'Tomorrow', 'Next week'],
//                             nextResponses: [
//                                 {
//                                     text: 'You selected Today. What time would you prefer?',
//                                     followUps: [
//                                         {
//                                             question: 'Please choose a time:',
//                                             options: ['10:00 AM', '2:00 PM', '4:00 PM'],
//                                             nextResponses: [
//                                                 {
//                                                     text: 'You selected 10:00 AM. Do you want to invite others to the meeting?',
//                                                     followUps: [
//                                                         {
//                                                             question: 'Would you like to send invitations?',
//                                                             options: ['Yes', 'No']
//                                                         }
//                                                     ]
//                                                 },
//                                                 {
//                                                     text: 'You selected 2:00 PM. Do you want to invite others to the meeting?',
//                                                     followUps: [
//                                                         {
//                                                             question: 'Would you like to send invitations?',
//                                                             options: ['Yes', 'No']
//                                                         }
//                                                     ]
//                                                 }
//                                             ]
//                                         }
//                                     ]
//                                 },
//                                 {
//                                     text: 'You selected Tomorrow. What time would you prefer?',
//                                     followUps: [
//                                         {
//                                             question: 'Please choose a time:',
//                                             options: ['10:00 AM', '2:00 PM', '4:00 PM'],
//                                             nextResponses: [
//                                                 {
//                                                     text: 'You selected 10:00 AM. Do you want to invite others to the meeting?',
//                                                     followUps: [
//                                                         {
//                                                             question: 'Would you like to send invitations?',
//                                                             options: ['Yes', 'No']
//                                                         }
//                                                     ]
//                                                 },
//                                                 {
//                                                     text: 'You selected 2:00 PM. Do you want to invite others to the meeting?',
//                                                     followUps: [
//                                                         {
//                                                             question: 'Would you like to send invitations?',
//                                                             options: ['Yes', 'No']
//                                                         }
//                                                     ]
//                                                 }
//                                             ]
//                                         }
//                                     ]
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         }
//     ];

//     try {
//         let insertedData = await Intent.insertMany(intents);
//         console.log('Intents inserted successfully:', insertedData);
//     } catch (error) {
//         console.error('Error inserting intents:', error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// insertIntents();


// // Export modules
// module.exports = { trainNLP, fetchIntents, getResponse, getDynamicSuggestions };

// const mongoose = require('mongoose');
// const Intent = require('../models/intentModel');

// mongoose.connect('mongodb://localhost:27017/ChatBot', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// async function fetchIntents() {
//     try {
//         const intents = await Intent.find({});
//         return intents;
//     } catch (error) {
//         console.error('Error fetching intents from DB:', error);
//         return [];
//     }
// }

// // Function to initialize and train the NLP model
// async function trainNLP(manager) {
//     let intentsFromDB = await fetchIntents();
//     for (const intentData of intentsFromDB) {
//         const category = intentData.category;
//         const phrases = intentData.phrases; 
//         for (const phrase of phrases) {
//             manager.addDocument('en', phrase, `${category}.${phrase}`);
//             manager.addAnswer('en', `${category}.${phrase}`, getResponse(category, phrase));
//         }
//     }
//     await manager.train();
//     manager.save();
// }

// // Function to get the response from the database
// async function getResponse(category, intent) {
//     try {
//         const intentData = await Intent.findOne({ category: category, phrases: intent });
//         // console.log(intentData)
//         if (intentData) {
//             return intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
//         }
//         return 'I am not sure about that. Could you please provide more details or ask something else?';
//     } catch (error) {
//         console.error('Error fetching response from DB:', error);
//         return 'An error occurred while processing your request.';
//     }
// }
// // Export modules
// module.exports = { trainNLP, fetchIntents, getResponse };

// // Function to insert intents into the database
// const insertIntents = async () => {
//     const intents = [
//         {
//             category: 'greetings',
//             phrases: [
//                 'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 
//                 'greet', 'salute', 'howdy', 'what’s up'
//             ],
//             responses: [
//                 'Hello! How can I assist you today?',
//                 'Hi! How can I help you?',
//                 'Good morning! How can I help you today?',
//                 'Good afternoon! What can I do for you today?',
//                 'Good evening! Need any assistance?'
//             ]
//         },
//         {
//             category: 'farewells',
//             phrases: [
//                 'bye', 'goodbye', 'see you later', 'see ya', 
//                 'farewell', 'take care', 'later', 'cya'
//             ],
//             responses: [
//                 'Goodbye! Have a great day!',
//                 'Farewell! Take care!',
//                 'See you later! Have a great day!',
//                 'Take care! See you soon!'
//             ]
//         },
//         {
//             category: 'askingHow',
//             phrases: [
//                 'how are you?', 'how is it going?', 
//                 'how do you do?', 'what’s up?', 'how have you been?'
//             ],
//             responses: [
//                 'I am doing well, thank you! How can I assist you?',
//                 'I am here to assist you! What do you need?'
//             ]
//         },
//         {
//             category: 'askingTime',
//             phrases: [
//                 'what time is it?', 'can you tell me the time?', 
//                 'current time', 'tell me the time'
//             ],
//             responses: [
//                 "I am just a bot, but you can check your device for the time."
//             ]
//         },
//         {
//             category: 'askingForHelp',
//             phrases: [
//                 'help me', 'I need help', 'can you assist me?', 
//                 'I need assistance', 'support me'
//             ],
//             responses: [
//                 'Sure! How can I assist you?',
//                 'Absolutely! How can I support you?'
//             ]
//         },
//         {
//             category: 'expressingThanks',
//             phrases: [
//                 'thank you', 'thanks', 'I appreciate it', 
//                 'thank you very much', 'much appreciated'
//             ],
//             responses: [
//                 'You’re welcome! I’m here to help.',
//                 'You’re very welcome! I’m happy to help.'
//             ]
//         },
//         {
//             category: 'officeRelated',
//             phrases: [
//                 'what are the office hours?', 'when does the office open?', 
//                 'when does the office close?', 'what is the office address?', 
//                 'where is the meeting room?', 'how do I report a technical issue?', 
//                 'what is the company policy on remote work?', 'how do I request time off?', 
//                 'who should I contact for HR questions?', 'where can I find the employee handbook?',
//                 'working hours', 'office location', 'office hours'
//             ],
//             responses: [
//                 'Our office hours are from 9 AM to 5 PM, Monday to Friday.',
//                 'The office opens at 9 AM.',
//                 'The office closes at 5 PM.',
//                 'Our office is located at 123 Main St, Anytown, USA.',
//                 'The meeting room is located on the second floor.',
//                 'You can report technical issues by emailing support@example.com.',
//                 'The company allows remote work on Fridays.',
//                 'You can request time off through the HR portal.',
//                 'You can contact HR at hr@example.com.',
//                 'The employee handbook is available on the company intranet.'
//             ]
//         },
//         {
//             category: 'salaryRelated',
//             phrases: [
//                 'when will I receive my salary?', 'how is my salary calculated?', 
//                 'who can I contact about salary issues?', 'what are the deductions in my salary?', 
//                 'what is my current salary?', 'pay', 'compensation', 
//                 'earnings', 'wages', 'salary payment'
//             ],
//             responses: [
//                 'Salaries are credited on the last working day of every month.',
//                 'Your salary is calculated based on your CTC, including basic, HRA, and allowances.',
//                 'For salary issues, contact the finance department at finance@example.com.',
//                 'Deductions include taxes, PF, and insurance contributions.',
//                 'You can view your current salary details on the HR portal.'
//             ]
//         },
//         {
//             category: 'hrRelated',
//             phrases: [
//                 'who is the HR manager?', 'how do I contact HR?', 
//                 'what is the HR email address?', 'how do I schedule a meeting with HR?', 
//                 'who handles employee grievances?', 'human resources', 
//                 'HR', 'HR contact', 'HR manager', 'HR email', 'grievance'
//             ],
//             responses: [
//                 'The HR manager is John Doe. You can reach him at john.doe@example.com.',
//                 'You can contact HR via hr@example.com.',
//                 'The HR email address is hr@example.com.',
//                 'Email HR at hr@example.com to schedule a meeting.',
//                 'Grievances are handled by the HR manager.'
//             ]
//         },
//         {
//             category: 'cafeteriaRelated',
//             phrases: [
//                 'what are the cafeteria hours?', 'what is on the cafeteria menu?', 
//                 'where is the cafeteria located?', 'how can I provide feedback on the cafeteria?', 
//                 'are vegetarian options available in the cafeteria?', 
//                 'cafeteria timings', 'lunch menu', 'food options'
//             ],
//             responses: [
//                 'The cafeteria is open from 7 AM to 7 PM.',
//                 'The menu changes daily; you can find it on the intranet.',
//                 'The cafeteria is on the ground floor next to the lobby.',
//                 'You can provide feedback through the feedback form available in the cafeteria.',
//                 'Yes, we offer a variety of vegetarian options daily.'
//             ]
//         },
//         {
//             category: 'leaveRelated',
//             phrases: [
//                 'how many leaves do I have left?', 'what is the leave policy?', 
//                 'how do I apply for leave?', 'who approves leave requests?', 
//                 'can I carry over unused leave to next year?', 'vacation', 
//                 'holiday', 'leave balance', 'sick leave', 'annual leave'
//             ],
//             responses: [
//                 'You can check your remaining leave balance on the HR portal.',
//                 'The company provides 12 annual leaves and 6 sick leaves.',
//                 'Apply for leave via the HR portal.',
//                 'Leave requests are approved by your direct manager.',
//                 'Up to 5 unused annual leaves can be carried over.'
//             ]
//         },
//         {
//             category: 'laptopServiceRelated',
//             phrases: [
//                 'how do I request a laptop service?', 'what should I do if my laptop is not working?', 
//                 'who should I contact for laptop repairs?', 'how long does laptop service take?', 
//                 'is there a backup option during laptop repairs?', 
//                 'laptop support', 'laptop issues', 'computer repair'
//             ],
//             responses: [
//                 'You can request laptop service through the IT service desk.',
//                 'Please contact the IT support team via email for assistance.',
//                 'You can contact the IT department for laptop repairs.',
//                 'Service time varies; typically, it takes 3-5 business days.',
//                 'Yes, we provide a backup laptop during repairs if requested.'
//             ]
//         }
//     ];
    

//     try {
//         // Insert the intents into the database
//         let indent = await Intent.insertMany(intents);
//         console.log(indent)
//         console.log('Intents inserted successfully');
//     } catch (error) {
//         console.error('Error inserting intents:', error);
//     } finally {
//         // Close the database connection
//         mongoose.connection.close();
//     }
// };

// // Call the function to insert the intents
// insertIntents();


// const insertIntents = async () => {
//     const intents = [
//         {
//             category: 'laptopServiceRelated',
//             phrases: [
//                 'how do I request a laptop service?',
//                 'what should I do if my laptop is not working?',
//                 'who should I contact for laptop repairs?',
//                 'how long does laptop service take?',
//                 'is there a backup option during laptop repairs?'
//             ],
//             responses: [
//                 {
//                     text: 'You can request laptop service through the IT service desk.',
//                     followUp: [
//                         {
//                             question: 'Please choose your laptop brand:',
//                             options: [
//                                 { brand: 'HP', response: 'For HP, contact hp.support@example.com.' },
//                                 { brand: 'Mac', response: 'For Mac, contact mac.support@example.com.' },
//                                 { brand: 'Lenovo', response: 'For Lenovo, contact lenovo.support@example.com.' }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     text: 'Please contact the IT support team via email for assistance.',
//                     followUp: []
//                 },
//                 {
//                     text: 'You can contact the IT department for laptop repairs.',
//                     followUp: []
//                 },
//                 {
//                     text: 'Service time varies; typically, it takes 3-5 business days.',
//                     followUp: []
//                 },
//                 {
//                     text: 'Yes, we provide a backup laptop during repairs if requested.',
//                     followUp: []
//                 }
//             ]
//         },
//         {
//             category: 'leaveRelated',
//             phrases: [
//                 'how many leaves do I have left?',
//                 'what is the leave policy?',
//                 'how do I apply for leave?',
//                 'who approves leave requests?',
//                 'can I carry over unused leave to next year?'
//             ],
//             responses: [
//                 {
//                     text: 'You can check your remaining leave balance on the HR portal.',
//                     followUp: []
//                 },
//                 {
//                     text: 'The company provides 12 annual leaves and 6 sick leaves.',
//                     followUp: [
//                         {
//                             question: 'Would you like to know how to apply for leave?',
//                             options: [
//                                 { response: 'Yes, please explain how to apply for leave.' },
//                                 { response: 'No, thank you.' }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     text: 'Apply for leave via the HR portal.',
//                     followUp: []
//                 },
//                 {
//                     text: 'Leave requests are approved by your direct manager.',
//                     followUp: []
//                 },
//                 {
//                     text: 'Up to 5 unused annual leaves can be carried over.',
//                     followUp: []
//                 }
//             ]
//         },
//         {
//             category: 'salaryRelated',
//             phrases: [
//                 'when will I receive my salary?',
//                 'how is my salary calculated?',
//                 'who can I contact about salary issues?',
//                 'what are the deductions in my salary?',
//                 'what is my current salary?'
//             ],
//             responses: [
//                 {
//                     text: 'Salaries are credited on the last working day of every month.',
//                     followUp: []
//                 },
//                 {
//                     text: 'Your salary is calculated based on your CTC, including basic, HRA, and allowances.',
//                     followUp: []
//                 },
//                 {
//                     text: 'For salary issues, contact the finance department at finance@example.com.',
//                     followUp: [
//                         {
//                             question: 'Would you like to know more about salary deductions?',
//                             options: [
//                                 { response: 'Yes, explain salary deductions.' },
//                                 { response: 'No, I am good.' }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     text: 'Deductions include taxes, PF, and insurance contributions.',
//                     followUp: []
//                 },
//                 {
//                     text: 'You can view your current salary details on the HR portal.',
//                     followUp: []
//                 }
//             ]
//         },
//         {
//             category: 'officeRelated',
//             phrases: [
//                 'what are the office hours?',
//                 'when does the office open?',
//                 'when does the office close?',
//                 'what is the office address?',
//                 'where is the meeting room?'
//             ],
//             responses: [
//                 {
//                     text: 'Our office hours are from 9 AM to 5 PM, Monday to Friday.',
//                     followUp: []
//                 },
//                 {
//                     text: 'The office opens at 9 AM and closes at 5 PM.',
//                     followUp: [
//                         {
//                             question: 'Would you like to know more about meeting rooms?',
//                             options: [
//                                 { response: 'Yes, where is the meeting room located?' },
//                                 { response: 'No, I am fine.' }
//                             ]
//                         }
//                     ]
//                 },
//                 {
//                     text: 'Our office is located at 123 Main St, Anytown, USA.',
//                     followUp: []
//                 },
//                 {
//                     text: 'The meeting room is located on the second floor.',
//                     followUp: []
//                 }
//             ]
//         }
//     ];

//     try {
//         let result = await Intent.insertMany(intents);
//         console.log('Intents inserted successfully:', result);
//     } catch (error) {
//         console.error('Error inserting intents:', error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// insertIntents();