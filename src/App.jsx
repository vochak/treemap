import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './App.css';

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const dataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';

    d3.json(dataUrl).then(data => {
      const svg = d3.select(ref.current)
        .attr('width', 1000)
        .attr('height', 600);

      const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

      d3.treemap()
        .size([1000, 600])
        .padding(1)
        (root);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const tile = svg.selectAll('g')
        .data(root.leaves())
        .enter().append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

      tile.append('rect')
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => color(d.data.category));

      tile.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10)
        .text(d => d);

      const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', 'translate(900, 20)');

      const categories = root.leaves().map(nodes => nodes.data.category);
      const uniqueCategories = [...new Set(categories)];

      legend.selectAll('rect')
        .data(uniqueCategories)
        .enter().append('rect')
        .attr('class', 'legend-item')
        .attr('x', 0)
        .attr('y', (d, i) => i * 20)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', d => color(d));

      legend.selectAll('text')
        .data(uniqueCategories)
        .enter().append('text')
        .attr('x', 24)
        .attr('y', (d, i) => i * 20 + 9)
        .attr('dy', '0.35em')
        .text(d => d);

      const tooltip = d3.select('body').append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

      tile.on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', .9);
        tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
          .attr('data-value', d.data.value)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });
    });
  }, []);

  return (
    <div>
      <h1 id="title" style={{ fontFamily: 'Arial, sans-serif' }}>Kickstarter Pledges Tree Map</h1>
      <p id="description">A tree map representing Kickstarter pledge data</p>
      <svg ref={ref}></svg>
    </div>
  );
}

export default App;
