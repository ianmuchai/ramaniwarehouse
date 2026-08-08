const baseTrackFields = {
  urgency: 'this week',
  location: '',
  budget: '',
  notes: ''
};

export const solutionTracks = [
  {
    id: 'eco-boards',
    title: 'Eco Board panels & partitions',
    categoryName: 'Eco Board',
    estimatorType: 'area',
    projectType: 'interior fit-out',
    measurementLabel: 'Area-led board planning',
    buyingPath: 'Quote-led',
    decisionCue: 'Surface area, room count, finish direction',
    prompt: 'Best when the buyer knows the wall, partition, ceiling, or display surface to cover.',
    productCategoryIds: ['eco-boards'],
    relatedCategoryIds: ['interior-design'],
    specDefaults: { spaceType: 'office partition', areaSqm: '', rooms: '', finishLevel: 'paint-ready', installSupport: 'supply only' },
    fields: [
      { key: 'spaceType', label: 'Space type', type: 'select', options: ['office partition', 'retail display', 'ceiling accent', 'home interior', 'other'] },
      { key: 'areaSqm', label: 'Approx. surface area (sqm)', type: 'number', placeholder: 'e.g. 36' },
      { key: 'rooms', label: 'Rooms or wall sections', type: 'number', placeholder: 'e.g. 4' },
      { key: 'finishLevel', label: 'Finish expectation', type: 'select', options: ['paint-ready', 'decorative finish', 'moisture-prone area', 'not sure'] },
      { key: 'installSupport', label: 'Support needed', type: 'select', options: ['supply only', 'cutting guidance', 'installer referral', 'full fit-out consult'] }
    ],
    confirmationPoints: ['board dimensions and thickness', 'cutting waste and off-cuts', 'edge finishing', 'site access and delivery handling']
  },
  {
    id: 'hdpe-plastics',
    title: 'HDPE bulk plastics supply',
    categoryName: 'HDPE Plastics',
    estimatorType: 'bulk',
    projectType: 'manufacturing',
    measurementLabel: 'Kg and batch planning',
    buyingPath: 'Quote-led',
    decisionCue: 'Quantity, grade expectation, production use',
    prompt: 'Best for buyers sourcing recycled HDPE for manufacturing, packaging, or moulding runs.',
    productCategoryIds: ['hdpe-plastics'],
    relatedCategoryIds: [],
    specDefaults: { productionUse: 'manufacturing input', targetKg: '', batchFrequency: 'one-off', gradeExpectation: 'washed material', packagingNeed: 'standard bags' },
    fields: [
      { key: 'productionUse', label: 'Production use', type: 'select', options: ['manufacturing input', 'packaging production', 'moulding', 'resale supply', 'other'] },
      { key: 'targetKg', label: 'Target quantity (kg)', type: 'number', placeholder: 'e.g. 500' },
      { key: 'batchFrequency', label: 'Supply rhythm', type: 'select', options: ['one-off', 'weekly', 'monthly', 'repeat contract'] },
      { key: 'gradeExpectation', label: 'Grade expectation', type: 'select', options: ['washed material', 'colour sorted', 'manufacturing grade', 'not sure'] },
      { key: 'packagingNeed', label: 'Packaging or handling', type: 'select', options: ['standard bags', 'bulk sacks', 'palletized', 'to confirm'] }
    ],
    confirmationPoints: ['material grade', 'colour and contamination tolerance', 'minimum viable batch', 'loading and delivery requirements']
  },
  {
    id: 'glass-recycling',
    title: 'Glass crafting & recycling supply',
    categoryName: 'Glass Recycling',
    estimatorType: 'bulk',
    projectType: 'glass craft',
    measurementLabel: 'Sorted batch planning',
    buyingPath: 'Quote-led',
    decisionCue: 'Use case, sorting need, volume, handling',
    prompt: 'Best for craft, decor, construction reuse, or industrial recycled-glass projects.',
    productCategoryIds: ['glass-recycling'],
    relatedCategoryIds: [],
    specDefaults: { glassUse: 'glass craft', targetKg: '', sortingNeed: 'mixed sorted', handlingNeed: 'bagged', safetyNeed: 'standard handling' },
    fields: [
      { key: 'glassUse', label: 'Glass use', type: 'select', options: ['glass craft', 'decor project', 'construction reuse', 'industrial recycling', 'other'] },
      { key: 'targetKg', label: 'Approx. volume (kg)', type: 'number', placeholder: 'e.g. 200' },
      { key: 'sortingNeed', label: 'Sorting need', type: 'select', options: ['mixed sorted', 'colour sorted', 'clear glass', 'crushed', 'not sure'] },
      { key: 'handlingNeed', label: 'Packaging/handling', type: 'select', options: ['bagged', 'bulk sacks', 'site collection', 'to confirm'] },
      { key: 'safetyNeed', label: 'Safety expectation', type: 'select', options: ['standard handling', 'craft-safe sizing', 'construction aggregate', 'to confirm'] }
    ],
    confirmationPoints: ['sort quality', 'size and sharp-edge handling', 'packaging format', 'delivery or collection method']
  },
  {
    id: 'ppr-pipes-fittings',
    title: 'PPR pipes & fittings kit',
    categoryName: 'PPR Pipes & Fittings',
    estimatorType: 'plumbing',
    projectType: 'plumbing',
    measurementLabel: 'Pipe-run and fitting schedule',
    buyingPath: 'Consult first',
    decisionCue: 'Pipe run, fixture points, pressure class',
    prompt: 'Best for contractors and maintenance teams planning water-system supply.',
    productCategoryIds: ['ppr-pipes-fittings'],
    relatedCategoryIds: [],
    specDefaults: { buildingType: 'residential', pipeRunMeters: '', fixturePoints: '', pressureClass: 'cold water', installStage: 'new installation' },
    fields: [
      { key: 'buildingType', label: 'Building type', type: 'select', options: ['residential', 'commercial', 'hospitality', 'maintenance repair', 'other'] },
      { key: 'pipeRunMeters', label: 'Approx. pipe run (meters)', type: 'number', placeholder: 'e.g. 80' },
      { key: 'fixturePoints', label: 'Fixture or outlet points', type: 'number', placeholder: 'e.g. 12' },
      { key: 'pressureClass', label: 'Water system', type: 'select', options: ['cold water', 'hot water', 'hot and cold water', 'high pressure', 'not sure'] },
      { key: 'installStage', label: 'Install stage', type: 'select', options: ['new installation', 'repair', 'extension', 'bill of quantities available'] }
    ],
    confirmationPoints: ['pipe diameter and pressure class', 'fittings: elbows, tees, couplers, valves and unions', 'site drawings or pipe runs', 'installer or contractor requirements']
  },
  {
    id: 'interior-design',
    title: 'Interior fit-out package',
    categoryName: 'Interior Design',
    estimatorType: 'space',
    projectType: 'interior fit-out',
    measurementLabel: 'Space and finish planning',
    buyingPath: 'Consult first',
    decisionCue: 'Space size, use, finish direction, budget',
    prompt: 'Best when Ramani needs to help combine boards, finishes, furniture, and fit-out direction.',
    productCategoryIds: ['interior-design'],
    relatedCategoryIds: ['eco-boards', 'furniture'],
    specDefaults: { spaceUse: 'office', areaSqm: '', rooms: '', finishDirection: 'modern functional', siteStage: 'planning' },
    fields: [
      { key: 'spaceUse', label: 'Space use', type: 'select', options: ['office', 'retail', 'hospitality', 'home', 'display area', 'other'] },
      { key: 'areaSqm', label: 'Approx. area (sqm)', type: 'number', placeholder: 'e.g. 65' },
      { key: 'rooms', label: 'Rooms or zones', type: 'number', placeholder: 'e.g. 5' },
      { key: 'finishDirection', label: 'Finish direction', type: 'select', options: ['modern functional', 'premium retail', 'warm hospitality', 'durable utility', 'not sure'] },
      { key: 'siteStage', label: 'Site stage', type: 'select', options: ['planning', 'shell ready', 'renovation active', 'urgent refresh'] }
    ],
    confirmationPoints: ['site photos or layout', 'finish schedule', 'budget range', 'installation scope and timeline']
  },
  {
    id: 'cleaning-solutions',
    title: 'Detergent & grease operations supply',
    categoryName: 'Detergent & Grease',
    estimatorType: 'repeat-supply',
    projectType: 'cleaning operations',
    measurementLabel: 'Pack and repeat-supply planning',
    buyingPath: 'Quote-led',
    decisionCue: 'Facility type, cleaning zones, frequency',
    prompt: 'Best for workshops, warehouses, hospitality backrooms, and repeat operations supply.',
    productCategoryIds: ['cleaning-solutions'],
    relatedCategoryIds: [],
    specDefaults: { facilityType: 'workshop', cleaningZones: '', frequency: 'weekly', greaseLevel: 'medium grease', repeatNeed: 'one-off order' },
    fields: [
      { key: 'facilityType', label: 'Facility type', type: 'select', options: ['workshop', 'warehouse', 'hospitality backroom', 'food handling zone', 'office support area', 'other'] },
      { key: 'cleaningZones', label: 'Cleaning zones or stations', type: 'number', placeholder: 'e.g. 6' },
      { key: 'frequency', label: 'Cleaning frequency', type: 'select', options: ['daily', 'several times weekly', 'weekly', 'monthly'] },
      { key: 'greaseLevel', label: 'Soil/grease level', type: 'select', options: ['light grease', 'medium grease', 'heavy grease', 'not sure'] },
      { key: 'repeatNeed', label: 'Supply need', type: 'select', options: ['one-off order', 'monthly restock', 'weekly restock', 'repeat contract'] }
    ],
    confirmationPoints: ['pack size', 'surface compatibility', 'repeat supply rhythm', 'storage and safety handling']
  },
  {
    id: 'furniture',
    title: 'Furniture sets & custom pieces',
    categoryName: 'Furniture',
    estimatorType: 'pieces',
    projectType: 'furniture sourcing',
    measurementLabel: 'Sets, seats and finish planning',
    buyingPath: 'Quote-led',
    decisionCue: 'Room type, number of sets, finish preference',
    prompt: 'Best for dining, hospitality, furnished suites, and custom furniture requests.',
    productCategoryIds: ['furniture'],
    relatedCategoryIds: ['interior-design'],
    specDefaults: { roomType: 'dining room', sets: '', seats: '', finishPreference: 'wood finish', deliveryAccess: 'standard access' },
    fields: [
      { key: 'roomType', label: 'Room or use', type: 'select', options: ['dining room', 'apartment furnishing', 'hospitality suite', 'commercial suite', 'custom request'] },
      { key: 'sets', label: 'Number of sets', type: 'number', placeholder: 'e.g. 2' },
      { key: 'seats', label: 'Seats needed', type: 'number', placeholder: 'e.g. 12' },
      { key: 'finishPreference', label: 'Finish preference', type: 'select', options: ['wood finish', 'dark polish', 'light polish', 'custom finish', 'not sure'] },
      { key: 'deliveryAccess', label: 'Delivery access', type: 'select', options: ['standard access', 'stairs', 'lift access', 'tight access', 'to confirm'] }
    ],
    confirmationPoints: ['finish availability', 'exact dimensions', 'delivery access', 'custom lead time']
  }
];

export const urgencies = ['today', 'this week', 'this month', 'planning'];

export function getTrack(trackId) {
  return solutionTracks.find((track) => track.id === trackId) || solutionTracks[0];
}

export function createEstimatorInput(trackId = solutionTracks[0].id, overrides = {}) {
  const track = getTrack(trackId);
  const { spec = {}, ...rest } = overrides;
  return {
    ...baseTrackFields,
    trackId: track.id,
    projectType: track.projectType,
    relatedCategoryIds: track.relatedCategoryIds,
    spec: { ...track.specDefaults, ...spec },
    ...rest
  };
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function numeric(value) {
  const parsed = Number(String(value || '').replace(/,/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function fieldLabel(track, key) {
  return track.fields.find((field) => field.key === key)?.label || key;
}

function fieldValueForLead(key, value) {
  const clean = String(value || '').trim();
  if (!clean) return '';
  if (key === 'areaSqm') return `${clean} sqm`;
  if (key === 'targetKg') return `${clean} kg`;
  if (key === 'pipeRunMeters') return `${clean}m pipe run`;
  if (key === 'fixturePoints') return `${clean} fixture points`;
  if (key === 'cleaningZones') return `${clean} cleaning zones`;
  if (key === 'sets') return `${clean} set(s)`;
  if (key === 'seats') return `${clean} seats`;
  if (key === 'rooms') return `${clean} rooms/zones`;
  return clean;
}

function specTerms(input) {
  return [
    input.projectType,
    input.notes,
    input.budget,
    ...Object.values(input.spec || {})
  ].map(normalize).join(' ');
}

export function recommendProducts(products = [], input) {
  const track = getTrack(input.trackId);
  const terms = specTerms(input);
  return products
    .map((product) => {
      const primary = track.productCategoryIds.includes(product.categoryId);
      const related = track.relatedCategoryIds.includes(product.categoryId);
      const text = [product.name, product.category, product.description, ...(product.tags || []), ...(product.useCases || []), ...(product.projectTypes || [])].map(normalize).join(' ');
      const termScore = terms.split(/\s+/).filter((term) => term.length > 3 && text.includes(term)).length;
      const score = (primary ? 100 : 0) + (related ? 35 : 0) + termScore + (product.featured ? 4 : 0);
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product)
    .slice(0, 5);
}

export function buildEstimatorSummary(input, recommendation = []) {
  const track = getTrack(input.trackId);
  const spec = input.spec || {};
  const area = numeric(spec.areaSqm);
  const kg = numeric(spec.targetKg);
  const pipeRun = numeric(spec.pipeRunMeters);
  const fixturePoints = numeric(spec.fixturePoints);
  const zones = numeric(spec.cleaningZones);
  const sets = numeric(spec.sets);
  const seats = numeric(spec.seats);
  const rooms = numeric(spec.rooms);

  let quantitySignal = 'Ramani will confirm the required quantity after reviewing your project details.';
  let planningBasis = track.measurementLabel;

  if (track.estimatorType === 'area') {
    const boardCount = area ? Math.ceil((area / 2.9) * 1.12) : 0;
    quantitySignal = boardCount
      ? `${area} sqm points to about ${boardCount} boards before Ramani confirms board size, thickness, and cutting waste.`
      : 'Enter surface area so Ramani can translate it into a board planning range.';
  }

  if (track.id === 'hdpe-plastics') {
    quantitySignal = kg
      ? `${kg.toLocaleString()} kg target supply, ${spec.batchFrequency || 'one-off'} rhythm, with grade confirmation required.`
      : 'Enter target kg or batch size so Ramani can confirm grade, handling, and delivery feasibility.';
  }

  if (track.id === 'glass-recycling') {
    quantitySignal = kg
      ? `${kg.toLocaleString()} kg of ${spec.sortingNeed || 'sorted'} glass for ${spec.glassUse || 'project use'}.`
      : 'Enter approximate glass volume so Ramani can plan sorting, bagging, and handling.';
  }

  if (track.estimatorType === 'plumbing') {
    const fittingRange = fixturePoints ? `${Math.max(1, fixturePoints * 3)}+ fittings` : 'fittings list to confirm';
    quantitySignal = pipeRun
      ? `${pipeRun}m pipe run with ${fixturePoints || 'unconfirmed'} fixture points; plan for ${fittingRange} after site review.`
      : 'Enter pipe-run meters and outlet points so Ramani can prepare a fitting schedule.';
    planningBasis = 'Pipe run, fixture points, and fittings compatibility';
  }

  if (track.estimatorType === 'space') {
    quantitySignal = area
      ? `${area} sqm across ${rooms || 'unconfirmed'} zones; Ramani should confirm finishes, furniture, and fit-out scope.`
      : 'Enter space area and zones so Ramani can shape the fit-out consultation.';
  }

  if (track.estimatorType === 'repeat-supply') {
    const multiplier = spec.frequency === 'daily' ? 2 : spec.frequency === 'several times weekly' ? 1.5 : spec.frequency === 'monthly' ? 0.5 : 1;
    const packs = zones ? Math.max(1, Math.ceil(zones * multiplier)) : 0;
    quantitySignal = packs
      ? `${packs} packs as a starting restock signal for ${zones} zones on a ${spec.frequency} cleaning rhythm.`
      : 'Enter zones and cleaning frequency so Ramani can plan pack quantities and repeat restock.';
  }

  if (track.estimatorType === 'pieces') {
    quantitySignal = sets || seats
      ? `${sets || 'Custom'} set(s), ${seats || 'seat count to confirm'} seats, with finish and delivery access to confirm.`
      : 'Enter sets or seats so Ramani can confirm furniture availability and custom lead time.';
  }

  return {
    track,
    planningBasis,
    quantitySignal,
    buyingPath: track.buyingPath,
    recommendedCount: recommendation.length,
    confirmationPoints: track.confirmationPoints
  };
}

export function buildEstimatorPayload(input, customer, preferredContact, recommendation, summary) {
  const track = getTrack(input.trackId);
  const categories = [track.categoryName, ...track.relatedCategoryIds.map((id) => getTrack(id).categoryName).filter(Boolean)];
  const quantityParts = Object.entries(input.spec || {})
    .map(([key, value]) => [fieldLabel(track, key), fieldValueForLead(key, value)])
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  return {
    customer: { ...customer, location: customer.location || input.location },
    input: {
      ...input,
      projectType: track.projectType,
      categories,
      quantity: quantityParts.join('; '),
      selectedTrack: {
        id: track.id,
        title: track.title,
        estimatorType: track.estimatorType,
        buyingPath: track.buyingPath,
        measurementLabel: track.measurementLabel
      },
      summary
    },
    preferredContact,
    recommendation: {
      products: recommendation.map((product) => ({ id: product.id, name: product.name, sku: product.sku, buyingMode: product.buyingMode })),
      summary
    }
  };
}
