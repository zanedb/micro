const express = require('express')
const router = express.Router()
const UUID = require('uuid-js')
const axios = require('axios')

const Item = require('../models/item')
const Click = require('../models/click')

router.get('/', (req, res) => {
  res.redirect(302, 'https://github.com/zanedb/micro')
})

router.post('/new', async (req, res) => {
  try {
    const item = new Item({
      created_at: new Date().toISOString(),
      urlKey: UUID.create()
    })
    await item.save()
    res.json({
      url: `${process.env.URL}/read-receipts/${item.urlKey}`,
      imageUrl: `${process.env.URL}/read-receipts/${item.urlKey}.png`,
      statsUrl: `${process.env.URL}/read-receipts/stats/${item.id}`
    })
  } catch (e) {
    res.sendStatus(400)
  }
})

router.get('/:key', async (req, res) => {
  try {
    const key = req.path.endsWith('.png')
      ? req.params.key.slice(0, -4)
      : req.params.key
    const item = await Item.findOne({ urlKey: key }).exec()
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const ipGeoRequest = await axios.get(
      `http://api.ipstack.com/${ip}?access_key=${
        process.env.IPSTACK_API_KEY
      }&format=1`
    )
    const userAgent = req.headers['user-agent']
    const click = new Click({
      timestamp: new Date().toISOString(),
      ip: ip,
      userAgent: userAgent,
      geo: ipGeoRequest.data,
      itemId: item.id
    })
    await click.save()
    if (req.path.endsWith('.png')) {
      res.sendFile('pixel.png', { root: __dirname + '/../../static/' })
    } else {
      res.sendStatus(200)
    }
  } catch (e) {
    res.sendStatus(400)
  }
})

router.get('/stats/:id', async (req, res) => {
  try {
    const clicks = await Click.find({ itemId: req.params.id }).exec()
    const filteredClicks = []
    clicks.forEach(click => {
      filteredClicks.push({
        timestamp: click.timestamp,
        ip: click.ip,
        userAgent: click.userAgent,
        geo: click.geo
      })
    })
    res.json({ total: filteredClicks.length, clicks: filteredClicks })
  } catch (e) {
    res.sendStatus(400)
  }
})

module.exports = router
