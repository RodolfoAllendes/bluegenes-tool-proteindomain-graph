'use strict';

const d3 = require('d3');

export class ProteinDomainGraph{

	constructor(proteinObj){
		this.protein = proteinObj[0].primaryAccession;
		this.plength = proteinObj[0].length;

		this.regions = proteinObj[0].proteinDomainRegions;
		this.types = this.regions.reduce((acc,cur) => {
			let t = cur.proteinDomain.type.replace('_', ' ');
			return acc.set(t);
		},new Map());

		[...this.types.keys()].forEach((k,i) => { 
			this.types.set(k, d3.schemeSet3[i%d3.schemeSet3.length]);
		});

		this.rows = [];
		let i = 0;
		this.types.forEach((v,k) =>{
			this.rows.push({ i, type: 'title', leftTick: '', rightTick: '', title: k});
			i+=1;
			proteinObj[0].proteinDomainRegions.forEach(r => {
				if(r.proteinDomain.type.replace('_',' ') === k){
					this.rows.push({ 
						i, type: 'rect',
						leftTick: r.proteinDomain.primaryIdentifier,
						rightTick: r.originalId,
						start: r.start,
						end: r.end,
						color: v
					});
					i += 1;
				}
			});
		},this);
		
		this._width = parseInt(d3.select('#canvas_proteinDomain').style('width'));
		this._height = parseInt(d3.select('#canvas_proteinDomain').style('height'));
		this._margin = {top: 40, right: 100, bottom: 40, left: 100};
		this.plot();

		window.addEventListener('resize', ()=> {this.plot();});
	}
		
	/**
	 * 
	 */	
	plot(){
		this._width = parseInt(d3.select('#canvas_proteinDomain').style('width'));
		this._height = parseInt(d3.select('#canvas_proteinDomain').style('height'));
		d3.select('#canvas_proteinDomain')
			.attr('viewBox', '0 0 '+this._width+' '+this._height);

		this.plotXAxis();
		this.plotLeftAxis();
		this.plotRightAxis();
		this.plotBars();
	}

	/**
	 * 
	 */
	plotBars(){
		d3.select('g#bars')
			.attr('transform', 'translate('+this._margin.left+', '+this._margin.top+')')
			.selectAll('rect')
				.data(this.rows.filter(d => d.type === 'rect'))
				.join('rect')
					.attr('x', d => this.x(d.start))
					.attr('y', d => this.left(d.i))
					.attr('width', d => this.x(d.end)-this.x(d.start))
					.attr('height', this.left.bandwidth)
					.attr('fill', d => d.color);
		
		d3.select('g#bars').selectAll('text')
			.data(this.rows.filter(d => d.type === 'title'))
			.join('text')
				.attr('x', () => this.x(this.plength*.05))
				.attr('y', d => this.left(d.i)+(this.left.bandwidth()/2))
				.text(d => d.title);
	}

	/**
	 * 
	 */
	plotLeftAxis(){
		this.left = d3.scaleBand()
			.range([0, this._height-this._margin.top-this._margin.bottom])
			.domain([...Array(this.regions.length+this.types.size).keys()])
			.padding(.1);
		this.leftAxis = d3.axisLeft(this.left); 
		d3.select('g#leftAxis')
			.attr('transform', 'translate('+this._margin.left+', '+this._margin.top+')')
			.call(this.leftAxis);
		
		d3.selectAll('g#leftAxis .tick line').remove();
		d3.selectAll('g#leftAxis .tick text')
			.data(this.rows)
			.join('text')
			.text(d => d.leftTick);
	}

	/**
	 * 
	 */
	plotRightAxis(){
		this.right = d3.scaleBand()
			.range([0, this._height-this._margin.top-this._margin.bottom])
			.domain([...Array(this.regions.length+this.types.size).keys()])
			.padding(.1);
		this.rightAxis = d3.axisRight(this.right); 
		d3.select('g#rightAxis')
			.attr('transform', 'translate('+(this._width-this._margin.right)+', '+this._margin.top+')')
			.call(this.rightAxis);
		
		d3.selectAll('g#rightAxis .tick line').remove();
		d3.selectAll('g#rightAxis .tick text')
			.data(this.rows)
			.join('text')
			.text(d => d.rightTick);
	}

	/**
	 * 
	 */
	plotXAxis(){
		this.x = d3.scaleLinear()
			.domain([0, this.plength])
			.range([0, this._width-this._margin.left-this._margin.right]);
		
		this.xAxis = d3.axisTop(this.x)
			.tickSize(this._margin.top-(this._height-this._margin.bottom));
		
		d3.select('g#xAxis')
			.attr('transform', 'translate('+this._margin.left+', '+this._margin.top+')')
			.call(this.xAxis);
		d3.selectAll('g#xAxis .domain').remove();
		d3.selectAll('g#xAxis .tick line')
			.attr('stroke-opacity', 0.3)
			.attr('stroke-dasharray', '2,2');
	}
}