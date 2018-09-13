const express = require('express');
const router = express.Router();
const crud = require('./../controller/crud-controller');

router.get('/:table', crud.fetch);
router.post('/:table/create', crud.insert);
router.put('/:table/:id', crud.updateUseID);
router.delete('/:table', crud.deleteUseParam);
router.delete('/:table/:id', crud.deleteUseID);

module.exports = router;