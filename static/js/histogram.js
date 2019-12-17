var histogram = d3.select(".histogram_graph")
  , histo_width = histogram.node().getBoundingClientRect().width
  , histo_height = histogram.node().getBoundingClientRect().height
  , margin = {top:10, bottom:20, left:40,  right:10}

function translate_date_in_millisecond(date_string){
    return Date.parse(date_string, "ddd MMM DD HH:mm:ss +0000 YYYY");
}

function convert_milliseconds_in_days(date_start, date_end){
    var one_day=1000*60*60*24;
    return Math.round((date_end - date_start)/one_day);
}


function draw_histogram_graph(data){
    var date_in_milli = Array.from(data, d=>translate_date_in_millisecond(d.created_at))
      , date_start = d3.extent(date_in_milli)[0]
      , date_final = d3.extent(date_in_milli)[1]
      , date_in_days = Array.from(date_in_milli, d => convert_milliseconds_in_days(date_start,d));

    var x = d3.scaleLinear()
      .domain(d3.extent(date_in_days))     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, histo_width -  margin.left - margin.right]);

    // set the parameters for the histogram
    var histo_data = d3.histogram()
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

    histogram.append("g")
      .attr("transform", "translate("+margin.left+"," + (histo_height - margin.bottom) + ")")
      .call(d3.axisBottom(x));

    // And apply this function to data to get the bins
    var bins = histo_data(date_in_days);

    var y = d3.scaleLinear()
      .range([histo_height - margin.top - margin.bottom, 0]);

    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

    histogram.append("g")
      .attr("transform", "translate("+margin.left+",0)")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  histogram.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", margin.left+1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + (y(d.length)-margin.bottom) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return histo_height - y(d.length); })
        .style("fill", "#69b3a2")

    console.log(bins);
}
