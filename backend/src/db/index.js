const User = require('./models/User');
const Profile = require('./models/Profile');
const Mood = require('./models/Mood');
const Habit = require('./models/Habit');
const Quest = require('./models/Quest');
const Post = require('./models/Post');

const { query } = require('./client');

module.exports = {
    query,
    User,
    Profile,
    Mood,
    Habit,
    Quest,
    Post
};
