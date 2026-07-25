import { readFileSync } from 'node:fs';
import {
  buildEstimatorPayload,
  buildEstimatorSummary,
  createEstimatorInput,
  recommendProducts,
  solutionTracks
} from '../src/utils/estimatorLogic.mjs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const products = JSON.parse(readFileSync(new URL('../server/data/products.json', import.meta.url), 'utf8'));

const requiredTracks = [
  'eco-boards',
  'hdpe-plastics',
  'glass-recycling',
  'ppr-pipes-fittings',
  'interior-design',
  'cleaning-solutions',
  'furniture'
];

for (const trackId of requiredTracks) {
  assert(solutionTracks.some((track) => track.id === trackId), `Missing estimator track ${trackId}`);
}

const ecoInput = createEstimatorInput('eco-boards', {
  spec: { areaSqm: '24', rooms: '3', finishLevel: 'paint-ready' },
  urgency: 'this week',
  location: 'Nairobi'
});
const ecoRecs = recommendProducts(products, ecoInput);
const ecoSummary = buildEstimatorSummary(ecoInput, ecoRecs);
assert(ecoRecs[0]?.categoryId === 'eco-boards', 'Eco Board recommendation should lead with Eco Board products');
assert(ecoSummary.quantitySignal.includes('boards'), 'Eco Board summary should translate area into board planning language');

const pprInput = createEstimatorInput('ppr-pipes-fittings', {
  spec: { pipeRunMeters: '80', fixturePoints: '12', pressureClass: 'hot and cold water' }
});
const pprSummary = buildEstimatorSummary(pprInput, recommendProducts(products, pprInput));
assert(pprSummary.quantitySignal.includes('pipe run'), 'PPR summary should reference pipe runs');
assert(pprSummary.confirmationPoints.some((point) => point.toLowerCase().includes('fittings')), 'PPR summary should ask Ramani to confirm fittings');

const cleaningInput = createEstimatorInput('cleaning-solutions', {
  spec: { facilityType: 'workshop', cleaningZones: '6', frequency: 'daily' }
});
const cleaningSummary = buildEstimatorSummary(cleaningInput, recommendProducts(products, cleaningInput));
assert(cleaningSummary.quantitySignal.includes('packs'), 'Cleaning summary should estimate pack planning');

const payload = buildEstimatorPayload(ecoInput, { name: 'Buyer', phone: '+254700000000' }, 'whatsapp', ecoRecs, ecoSummary);
assert(payload.input.selectedTrack.title.includes('Eco Board'), 'Payload should preserve selected product path');
assert(payload.input.categories.includes('Eco Board'), 'Payload should include selected product category');
assert(payload.input.quantity.includes('24 sqm'), 'Payload should carry product-specific quantity context');

console.log('Estimator logic check passed.');
