const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const DATA_FOLDER = path.join(__dirname, '../data')

const {getEntity} = require('../lib/')
const datasetNames = fs
  .readdirSync(DATA_FOLDER)
  .filter(f => f.includes('observed-domains'))
  .sort()
  .reverse()

const observedDomains = new Set()
const domainToTotal = new Map();

for (const datasetName of datasetNames) {
  const dataset = require(`../data/${datasetName}`)

  dataset
    // .map(e => e.domain)
    // .filter(Boolean)
    .forEach(e => {
      const domain = e.domain;
      observedDomains.add(domain);
      let sum = domainToTotal.get(domain) || 0;
      sum += parseInt(e.totalOccurrences, 10); 
      domainToTotal.set(domain, sum);
    })
}



const all = [['domain', 'category', 'totalOccurrences', 'rootdomain', 'rootcategory']];

const entries = Array.from(observedDomains)
  .map(domain => {
    const entity = getEntity(domain)
    const rootdomain = domain.split('.').slice(1).join('.');
    const rootentity = getEntity(rootdomain)

    all.push([domain, entity?.category || 'UNRECOG', domainToTotal.get(domain), rootdomain, rootentity?.category || 'NAWRP']);

    if (!entity) {
      return [domain, domain, 'unknown']
    }

    return [domain, entity.domains[0], entity.category || 'other']
  })
  .filter(Boolean)

fs.writeFileSync(
  path.join(__dirname, '../dist/domain-map.csv'),
  entries.map(l => l.join(',')).join('\n')
)


fs.writeFileSync(
  path.join(__dirname, '../dist/all-domains.csv'),
  all.map(l => l.join(',')).join('\n')
)


fs.writeFileSync(
  path.join(__dirname, '../dist/all-unregcog-domains.csv'),
  all.filter(l => l[1] === 'UNRECOG').map(l => l.join(',')).join('\n')
)
