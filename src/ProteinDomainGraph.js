'use strict';

const d3 = require('d3');

export class ProteinDomainGraph{

	constructor(proteinObj){
		this.data = proteinObj[0].proteinDomainRegions;
		
		this.domain = this.data.reduce( (acc,cur) => {
			acc[0] = acc[0] < cur.start ? acc[0] : cur.start;
			acc[1] = acc[1] > cur.end ? acc[1] : cur.end;
			return acc;
		},[Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]);

		
		this.width = parseInt(d3.select('#canvas_proteinDomain').style('width'));
		this.height = parseInt(d3.select('#canvas_proteinDomain').style('height'));

		this.margin = {top: 40, right: 40, bottom: 40, left: 40};

		let scale = d3.scaleLinear()
			.domain(this.domain)
			.range([0, this.width-this.margin.left-this.margin.right])
			.nice();
			

		this.xAxis = d3.axisTop(scale)
			.tickSize(this.margin.top-(this.height-this.margin.bottom));
		// .tickSize(100);
		// this.yAxis = d3.;

		this.plot();
	}

	plot(){
		d3.select('g#xAxis')
			.attr('transform', 'translate('+this.margin.left+', '+this.margin.top+')')
			.call(this.xAxis);
		d3.selectAll('g#xAxis .tick line')
			.attr('stroke-opacity', 0.5)
			.attr('stroke-dasharray', '2,2');
		
	}
}