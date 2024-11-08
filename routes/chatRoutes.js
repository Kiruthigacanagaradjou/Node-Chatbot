const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/', chatController.getIndexPage);
router.post('/chat', chatController.getChatResponse);

module.exports = router;


// const insertIntents = async () => {
//     try {
//         // Create responses for laptop service category
//         const laptopResponse1 = await Response.create({
//             followUps: [
//                 {
//                     question: 'Please choose your laptop brand:',
//                     options: ['HP', 'Mac', 'Lenovo', 'Dell'],
//                     nextResponses: [] // Will be filled later
//                 }
//             ]
//         });

//         const laptopResponse2 = await Response.create({
//             followUps: [
//                 {
//                     question: 'Please select the type of issue:',
//                     options: ['Hardware', 'Software'],
//                     nextResponses: [] // Will be filled later
//                 }
//             ]
//         });

//         const laptopResponse3 = await Response.create({
//             followUps: [
//                 {
//                     question: 'Do you want to open a support ticket?',
//                     options: ['Yes', 'No'],
//                     nextResponses: [] // Will be filled later
//                 }
//             ]
//         });

//         const laptopThankYouResponse = await Response.create({
//             followUps: [
//                 {
//                     question: 'Thank you for your request! If you need further assistance, feel free to ask.',
//                     options: [],
//                     nextResponses: [] // No next response
//                 }
//             ]
//         });

//         // Link responses for laptop service
//         laptopResponse1.followUps[0].nextResponses.push(laptopResponse2._id); // Link first response to second
//         laptopResponse2.followUps[0].nextResponses.push(laptopResponse3._id); // Link second response to third
//         laptopResponse3.followUps[0].nextResponses.push(laptopThankYouResponse._id); // Link to thank you response

//         // Save the updated laptop responses
//         await laptopResponse1.save();
//         await laptopResponse2.save();
//         await laptopResponse3.save();
//         await laptopThankYouResponse.save();

//         // Create the laptop service intent document
//         const laptopIntent = await Intent.create({
//             category: 'laptopServiceRelated',
//             phrases: [
//                 'how do I request a laptop service?', 
//                 'what should I do if my laptop is not working?',
//                 'who should I contact for laptop repairs?', 
//                 'laptop repair'
//             ],
//             responses: [laptopResponse1._id] // Link the first response
//         });

//         // Create responses for meeting-related category
//         const meetingResponse1 = await Response.create({
//             followUps: [
//                 {
//                     question: 'Please select a date:',
//                     options: ['Today', 'Tomorrow', 'Next week'],
//                     nextResponses: [] // Will be filled later
//                 }
//             ]
//         });

//         const meetingResponse2 = await Response.create({
//             followUps: [
//                 {
//                     question: 'What time would you prefer?',
//                     options: ['10:00 AM', '2:00 PM', '4:00 PM'],
//                     nextResponses: [] // Will be filled later
//                 }
//             ]
//         });

//         const meetingResponse3 = await Response.create({
//             followUps: [
//                 {
//                     question: 'Do you want to invite others to the meeting?',
//                     options: ['Yes', 'No'],
//                     nextResponses: [] // Will be filled later
//                 }
//             ]
//         });

//         const meetingThankYouResponse = await Response.create({
//             followUps: [
//                 {
//                     question: 'Thank you for scheduling your meeting! If you have any more questions, feel free to ask.',
//                     options: [],
//                     nextResponses: [] // No next response
//                 }
//             ]
//         });

//         // Link responses for meeting-related
//         meetingResponse1.followUps[0].nextResponses.push(meetingResponse2._id); // Link first response to second
//         meetingResponse2.followUps[0].nextResponses.push(meetingResponse3._id); // Link second response to third
//         meetingResponse3.followUps[0].nextResponses.push(meetingThankYouResponse._id); // Link to thank you response

//         // Save the updated meeting responses
//         await meetingResponse1.save();
//         await meetingResponse2.save();
//         await meetingResponse3.save();
//         await meetingThankYouResponse.save();

//         // Create the meeting intent document
//         const meetingIntent = await Intent.create({
//             category: 'meetingRelated',
//             phrases: [
//                 'schedule a meeting', 
//                 'book a meeting', 
//                 'how do I schedule a meeting?', 
//                 'I need to set up a meeting', 
//                 'meeting schedule', 
//                 'meeting arrangement'
//             ],
//             responses: [meetingResponse1._id] // Link the first response
//         });

//         console.log('Intents and responses inserted successfully:', { laptopIntent, meetingIntent });
//     } catch (error) {
//         console.error('Error inserting intents:', error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// insertIntents();