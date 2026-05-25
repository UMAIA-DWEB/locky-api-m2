const { Locker } = require('../models');

exports.list = async (req, res) => {
  const lockers = await Locker.findAll({
    include: [{ association: 'station', attributes: ['id', 'name', 'city'] }],
    order: [['stationId', 'ASC'], ['number', 'ASC']],
  });
  res.json(lockers);
};

exports.get = async (req, res) => {
  const locker = await Locker.findByPk(req.params.id, {
    include: [{ association: 'station' }],
  });
  if (!locker) return res.status(404).json({ error: 'Locker não encontrado' });
  res.json(locker);
};

exports.create = async (req, res) => {
  const { stationId, number, size, pricePerHour } = req.body;
  if (!stationId || !number || !size || pricePerHour === undefined) {
    return res.status(400).json({ error: 'stationId, number, size e pricePerHour são obrigatórios' });
  }
  const locker = await Locker.create({ stationId, number, size, pricePerHour });
  res.status(201).json(locker);
};

exports.update = async (req, res) => {
  const locker = await Locker.findByPk(req.params.id);
  if (!locker) return res.status(404).json({ error: 'Locker não encontrado' });
  await locker.update(req.body);
  res.json(locker);
};

exports.remove = async (req, res) => {
  const locker = await Locker.findByPk(req.params.id);
  if (!locker) return res.status(404).json({ error: 'Locker não encontrado' });
  await locker.destroy();
  res.status(204).send();
};
