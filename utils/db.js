const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// // Create a schema
// const Contact = mongoose.model('Contact', {
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: String,
//         required: true
//     }
// });

// // Add data
// const contact = new Contact({
//     name: 'Vannesha Angelica',
//     email: 'vanneshaangelica@mail.com',
//     phone: '081234567890'
// });

// // Save data
// contact.save()
//     .then(result => console.log(result))
//     .catch(err => console.log(err));
