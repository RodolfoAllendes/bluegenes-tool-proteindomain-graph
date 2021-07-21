'use strict';
import { ProteinDomainGraph } from './ProteinDomainGraph.js';

// make sure to export main, with the signature
function main(el, service, imEntity, state, config) {
	if (!state) state = {};
	if (!el || !service || !imEntity || !state || !config) {
		throw new Error('Call main with correct signature');
	}

	let imService = new imjs.Service(service);
	imService.fetchModel().then(model => {
		let query = new imjs.Query({ model });
		query.adjustPath('Protein');

		query.select([
			'primaryAccession',
			'length',

			'proteinDomainRegions.start',
			'proteinDomainRegions.end',
			'proteinDomainRegions.originalId',

			'proteinDomainRegions.proteinDomain.primaryIdentifier',
			'proteinDomainRegions.proteinDomain.type',
			'proteinDomainRegions.proteinDomain.name'
		]);

		query.addConstraint({
			path: 'id',
			op: '=',
			value: imEntity.Protein.value
		});

		return imService.records(query);
	}).then(rows => {
		window.ProteinDomainGraph = new ProteinDomainGraph(rows);
	});
	
	el.innerHTML = `
		<div class="rootContainer">
			<div id="proteinDomainGraph-div" class="targetmineGraphDisplayer">
				<svg id="canvas_proteinDomain" class="targetmineGraphSVG">
					<g id="graph">
						<g id="xAxis"></g>
						<g id="leftAxis"></g>
						<g id="rightAxis"></g>
						<g id="bars"></g>
					</g>
				</svg>
			</div>
			
		</div>
	`;
}

export { main };
