const Event = require('../models/EventModel');
const User = require('../models/userModel');

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user._id,
      organizerPhone: req.user.phone,
      joinedPlayers: [req.user._id]
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err });
  }
};

exports.listEvents = async (req, res) => {
  try {
    const events = await Event.find({ isClosed: false }).populate('organizer', 'username fullName');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error listing events', error: err });
  }
};

exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.joinedPlayers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined' });
    }

    event.joinedPlayers.push(req.user._id);
    await event.save();

    req.user.eventsJoined.push(event._id);
    await req.user.save();

    res.json({ message: 'Joined successfully', event });
  } catch (err) {
    res.status(500).json({ message: 'Join failed', error: err });
  }
};

exports.closeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.organizer.equals(req.user._id)) return res.status(403).json({ message: 'Unauthorized' });

    const { winnerId, loserId, score } = req.body;

    const winner = await User.findById(winnerId);
    const loser = await User.findById(loserId);

    // Update stats
    winner.wins += 1;
    winner.totalScore += score;
    winner.eventsPlayed += 1;
    loser.losses += 1;
    loser.eventsPlayed += 1;
    await winner.save();
    await loser.save();

    event.isClosed = true;
    event.result = { winner: winner.username, loser: loser.username, score };
    await event.save();

    res.json({ message: 'Event closed and scores updated', event });
  } catch (err) {
    res.status(500).json({ message: 'Error closing event', error: err });
  }
};
