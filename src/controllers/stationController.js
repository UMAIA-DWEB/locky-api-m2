const { Station } = require('../models');

exports.list = async (req, res) => {
  const stations = await Station.findAll({ order: [['name', 'ASC']] });
  res.json(stations);
};

exports.get = async (req, res) => {
  const station = await Station.findByPk(req.params.id, {
    include: [{ association: 'lockers' }],
  });
  if (!station) {
    return res.status(404).json({ error: 'Station não encontrada' });
  }
  res.json(station);
};

exports.create = async (req, res) => {
  const { name, address, city, isActive } = req.body;
  if (!name || !address || !city) {
    return res.status(400).json({ error: 'name, address e city são obrigatórios' });
  }
  const station = await Station.create({ name, address, city, isActive });
  res.status(201).json(station);
};

exports.update = async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (!station) {
    return res.status(404).json({ error: 'Station não encontrada' });
  }
  await station.update(req.body);
  res.json(station);
};

exports.remove = async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (!station) {
    return res.status(404).json({ error: 'Station não encontrada' });
  }
  await station.destroy();
  res.status(204).send();
};
