const { Reservation, Locker } = require('../models');

const reservationInclude = [
  {
    association: 'locker',
    include: [{ association: 'station' }],
  },
];

exports.list = async (req, res) => {
  const reservations = await Reservation.findAll({
    where: { userId: req.user.id },
    include: reservationInclude,
    order: [['startTime', 'DESC']],
  });
  res.json(reservations);
};

exports.get = async (req, res) => {
  const reservation = await Reservation.findByPk(req.reservation.id, {
    include: reservationInclude,
  });
  res.json(reservation);
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

  const full = await Reservation.findByPk(reservation.id, { include: reservationInclude });
  res.status(201).json(full);
};

exports.update = async (req, res) => {
  const reservation = req.reservation;
  const { startTime, endTime } = req.body;
  const updates = {};
  if (startTime) updates.startTime = new Date(startTime);
  if (endTime) updates.endTime = new Date(endTime);

  if (startTime || endTime) {
    const newStart = updates.startTime || reservation.startTime;
    const newEnd = updates.endTime || reservation.endTime;
    const locker = await Locker.findByPk(reservation.lockerId);
    if (locker) {
      const hours = (newEnd - newStart) / (1000 * 60 * 60);
      updates.totalPrice = Number((locker.pricePerHour * hours).toFixed(2));
    }
  }

  await reservation.update(updates);

  const full = await Reservation.findByPk(reservation.id, { include: reservationInclude });
  res.json(full);
};

exports.remove = async (req, res) => {
  await req.reservation.destroy();
  res.status(204).send();
};
