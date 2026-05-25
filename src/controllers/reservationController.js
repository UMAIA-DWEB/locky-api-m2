const { Reservation, Locker } = require('../models');

exports.list = async (req, res) => {
  const reservations = await Reservation.findAll({
    where: { userId: req.user.id },
    order: [['startTime', 'DESC']],
  });
  res.json(reservations);
};

exports.get = async (req, res) => {
  res.json(req.reservation);
};

exports.create = async (req, res) => {
  const { lockerId, startTime, endTime } = req.body;

  if (!lockerId || !startTime || !endTime) {
    return res.status(400).json({ error: 'lockerId, startTime e endTime são obrigatórios' });
  }

  const locker = await Locker.findByPk(lockerId);
  if (!locker) return res.status(400).json({ error: 'lockerId inválido' });

  const start = new Date(startTime);
  const end = new Date(endTime);
  const hours = (end - start) / (1000 * 60 * 60);
  const totalPrice = Number((locker.pricePerHour * hours).toFixed(2));

  const reservation = await Reservation.create({
    userId: req.user.id,
    lockerId,
    startTime: start,
    endTime: end,
    totalPrice,
  });
  res.status(201).json(reservation);
};

exports.update = async (req, res) => {
  const reservation = req.reservation;
  const { startTime, endTime } = req.body;
  const updates = {};
  if (startTime) updates.startTime = new Date(startTime);
  if (endTime) updates.endTime = new Date(endTime);
  await reservation.update(updates);
  res.json(reservation);
};

exports.remove = async (req, res) => {
  await req.reservation.destroy();
  res.status(204).send();
};
