// graph margins/dimensions
const margin = {top: 10, right: 30, bottom: 90, left: 40},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// create svg
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("https://www.freeforexapi.com/api/live?pairs=EURUSD,EURGBP,GBPUSD,USDJPY,AUDUSD,USDCHF,NZDUSD,USDCAD,USDZAR", ({ rates }) => {

  // console.log(rates)
  const myRates = Object.keys(rates).map(d => ({ name: d, rate: rates[d].rate})).sort((a, b) => a.rate - b.rate).reverse();
  // console.log(myRates)

  // X axis
  // console.log(Object.keys(rates))

  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myRates.map(d => d.name))
    .padding(0.2);

  // console.log(d3.extent(myRates, d => d.rate))
  const y = d3.scaleLinear()
    .domain(d3.extent(myRates, d => d.rate))
    .range([ height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));
  
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Bars
  svg.selectAll("mybar")
    .data(myRates)
    .enter()
    .append("rect")
      .attr('width', x.bandwidth())
      .attr('fill', '#69b3a2')
      // no bar at the beginning thus:
      .attr('height', d => height - y(d.rate))
      .attr('y', d => y(0))
      .attr('x', d => x(d.name))

  // Animation
  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr('y', d => y(d.rate))
    .attr('height', d => height - y(d.rate))
    .delay((d,i) => (i*100))

})
